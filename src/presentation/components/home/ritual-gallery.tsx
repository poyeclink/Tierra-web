import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { MaskLines } from "@/presentation/components/ui/mask-lines";
import { Reveal } from "@/presentation/components/ui/reveal";
import { ScrollScene } from "@/presentation/components/ui/scroll-scene";
import { ritualContent } from "@/presentation/content/home";

/** The moment that opens up to full screen. */
const HERO = 2;

/**
 * Collage placement while pinned: position and width on small screens (x, y, w) and from
 * 1024px (…-lg), plus the direction (dx, dy) each photo flies off to. Keyed by moment index.
 * On small screens the top photos hang from the heading's measured bottom (--head).
 */
const TILES: Record<number, Record<string, string | number>> = {
  0: { "--x": "1%", "--y": "calc(var(--head, 10rem) + 3.5rem)", "--w": "23vw", "--x-lg": "5%", "--y-lg": "38%", "--w-lg": "14vw", "--dx": -1, "--dy": 0.2 },
  1: { "--x": "6%", "--y": "76%", "--w": "24vw", "--x-lg": "24%", "--y-lg": "62%", "--w-lg": "11vw", "--dx": -0.7, "--dy": 0.8 },
  3: { "--x": "75%", "--y": "calc(var(--head, 10rem) + 2rem)", "--w": "23vw", "--x-lg": "66%", "--y-lg": "7%", "--w-lg": "13vw", "--dx": 0.6, "--dy": -0.9 },
  4: { "--x": "70%", "--y": "75%", "--w": "27vw", "--x-lg": "81%", "--y-lg": "40%", "--w-lg": "15vw", "--dx": 1, "--dy": 0.1 },
  5: { "--x": "38%", "--y": "82%", "--w": "22vw", "--x-lg": "63%", "--y-lg": "70%", "--w-lg": "12vw", "--dx": 0.5, "--dy": 0.9 },
};

/**
 * "El ritual". With motion: a pinned collage whose centre photo opens to fill the screen as
 * the others drift away, then the six moments are written over it (.zoom in scenes.css).
 * Without motion: a regular photo grid with captions.
 */
export function RitualGallery() {
  const { eyebrow, title, moments } = ritualContent;

  return (
    <ScrollScene as="section" pinned aria-labelledby="ritual-title" className="zoom relative motion-js:h-[280svh]">
      <div data-stage className="relative motion-js:sticky motion-js:top-20 motion-js:h-[calc(100svh-5rem)] motion-js:overflow-hidden">
        {/* data-scene-head: its height keeps the centre photo below the heading (scenes.css) */}
        <div data-scene-head className="zoom-head relative z-10 pt-24 sm:pt-32 motion-js:pt-8 motion-js:sm:pt-12">
          <Container size="wide">
            <Reveal className="mask-reveal max-w-xl">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 id="ritual-title" className="mt-5 text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.035em] text-balance">
                <MaskLines lines={[title]} />
              </h2>
            </Reveal>
          </Container>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 px-5 pb-24 sm:grid-cols-3 sm:gap-x-6 sm:px-8 sm:pb-32 lg:mx-auto lg:max-w-7xl motion-js:absolute motion-js:inset-0 motion-js:m-0 motion-js:block motion-js:max-w-none motion-js:p-0">
          {moments.map((moment, index) =>
            index === HERO ? (
              <li key={moment.caption} className="zoom-hero motion-js:absolute motion-js:inset-0">
                <figure className="h-full">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-tint motion-js:aspect-auto motion-js:h-full motion-js:rounded-none">
                    <div className="zoom-hero-media absolute inset-0">
                      <Image
                        src={moment.photo.src}
                        alt={moment.photo.alt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="zoom-shade absolute inset-0 hidden bg-linear-to-t from-deep/90 via-deep/35 to-deep/10 motion-js:block"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline gap-4 motion-js:sr-only">
                    <span className="text-sm text-ink-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-medium">{moment.caption}</span>
                  </figcaption>
                </figure>
              </li>
            ) : (
              <li key={moment.caption} className="zoom-tile motion-js:z-[1]" style={TILES[index] as CSSProperties}>
                <figure>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-tint shadow-[0_30px_60px_-35px_var(--color-text)] motion-js:aspect-[4/5] motion-js:rounded-[1.25rem] motion-js:lg:rounded-[1.75rem]">
                    <Image
                      src={moment.photo.src}
                      alt={moment.photo.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline gap-4 motion-js:mt-2 motion-js:gap-2">
                    <span className="text-sm text-ink-muted tabular-nums motion-js:text-[0.65rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl font-medium motion-js:text-xs motion-js:tracking-[0.2em] motion-js:uppercase motion-js:lg:text-sm">
                      {moment.caption}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ),
          )}
        </ul>

        {/* Closing words over the open photo (the captions, already listed above) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden pb-10 text-paper motion-js:block sm:pb-14">
          <Container size="wide">
          <p className="flex flex-wrap items-baseline gap-x-[0.45em] gap-y-1 text-[clamp(2rem,6vw,5.5rem)] leading-[1.05] font-medium tracking-[-0.04em]">
            {moments.map((moment, index) => (
              <span key={moment.caption} className="zoom-word inline-flex items-baseline gap-[0.45em]" style={{ "--i": index } as CSSProperties}>
                {moment.caption}
                {index < moments.length - 1 && <span className="size-[0.14em] translate-y-[-0.3em] rounded-full bg-aqua" />}
              </span>
            ))}
          </p>
          </Container>
        </div>
      </div>
    </ScrollScene>
  );
}
