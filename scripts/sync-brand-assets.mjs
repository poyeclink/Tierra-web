// Copies web-ready brand files from brand-assets/ (source of truth) to public/brand/.
// Runs automatically before `dev` and `build`. public/brand/ is git-ignored.
import { cpSync, rmSync } from "node:fs";

const src = new URL("../brand-assets/", import.meta.url);
const dest = new URL("../public/brand/", import.meta.url);

const folders = {
  "logos/svg/": "logos/",
  "iconos/": "iconos/",
  "frases/": "frases/",
  "texturas/": "texturas/",
};

rmSync(dest, { recursive: true, force: true });
for (const [from, to] of Object.entries(folders)) {
  cpSync(new URL(from, src), new URL(to, dest), { recursive: true });
}
console.log("brand-assets -> public/brand synced");
