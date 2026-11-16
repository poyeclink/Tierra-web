// Converts the PNG frames rendered by design/ritual-3d/build_scene.py into the WebP
// sets used by the home scroll sequence (src/presentation/components/home/ritual-sequence.tsx).
//
//   node scripts/export-ritual-frames.mjs <render-folder> [version]
//
// Sizes, steps and the version folder must match `ritualFrames` in
// src/presentation/content/home.ts.
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const [input, version = "v2"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/export-ritual-frames.mjs <render-folder> [version]");
  process.exit(1);
}

const SETS = [
  { name: "l", size: 1000, step: 1, quality: 78 },
  { name: "s", size: 600, step: 2, quality: 74 },
];
/** Alpha below this is render haze from the shadow catcher, not a shadow. */
const ALPHA_FLOOR = 10;
/** Shadow pixels: RGB below this. They fade between these distances from the centre (0.5 = edge). */
const SHADOW_MAX = 40;
const SHADOW_FADE = [0.3, 0.47];

const source = resolve(input);
const out = new URL(`../public/ritual/${version}/`, import.meta.url);
const frames = readdirSync(source)
  .filter((file) => /^f_\d+\.png$/.test(file))
  .sort();
if (!frames.length) {
  console.error(`No f_####.png frames in ${source}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
for (const set of SETS) mkdirSync(new URL(`${set.name}/`, out), { recursive: true });

const totals = Object.fromEntries(SETS.map((set) => [set.name, { files: 0, bytes: 0 }]));

for (const file of frames) {
  const index = Number(file.match(/\d+/)[0]);
  const { data, info } = await sharp(join(source, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    let alpha = data[i];
    if (alpha <= ALPHA_FLOOR) {
      data[i] = 0;
      continue;
    }
    alpha = ((alpha - ALPHA_FLOOR) * 255) / (255 - ALPHA_FLOOR);
    // Floor shadows (black, translucent) fade out towards the frame edge, so they never end in a hard line.
    if (alpha < 230 && Math.max(data[i - 3], data[i - 2], data[i - 1]) < SHADOW_MAX) {
      const pixel = (i - 3) / 4;
      const dx = (pixel % info.width) / info.width - 0.5;
      const dy = Math.floor(pixel / info.width) / info.height - 0.5;
      const t = Math.min(1, Math.max(0, (Math.hypot(dx, dy) - SHADOW_FADE[0]) / (SHADOW_FADE[1] - SHADOW_FADE[0])));
      alpha *= 1 - t * t * (3 - 2 * t);
    }
    data[i] = Math.round(alpha);
  }
  const clean = { raw: { width: info.width, height: info.height, channels: 4 } };

  for (const set of SETS) {
    if (index % set.step) continue;
    const target = fileURLToPath(new URL(`${set.name}/${String(index).padStart(3, "0")}.webp`, out));
    await sharp(data, clean)
      .resize(set.size, set.size)
      .webp({ quality: set.quality, alphaQuality: 80, effort: 6 })
      .toFile(target);
    totals[set.name].files += 1;
    totals[set.name].bytes += statSync(target).size;
  }
}

for (const [name, { files, bytes }] of Object.entries(totals)) {
  console.log(`${name}: ${files} frames, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}
