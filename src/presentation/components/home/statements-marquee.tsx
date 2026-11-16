"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useScrollProgress } from "@/presentation/components/ui/scroll-scene";
import { brandStatements, type BrandArt } from "@/presentation/content/home";

const HEIGHT = 80;
const reversed = [...brandStatements].reverse();

function Row({ statements, reverse, paused, small }: { statements: readonly BrandArt[]; reverse?: boolean; paused: boolean; small?: boolean }) {
  return (
    <div
      className={`flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto ${reverse ? "[animation-direction:reverse]" : ""}`}
      style={paused ? { animationPlayState: "paused" } : undefined}
    >
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1 || reverse} className="flex shrink-0 items-center motion-reduce:[&:nth-child(2)]:hidden">
          {statements.map((statement) => (
            <li key={statement.src} className="flex items-center">
              <Image
                src={statement.src}
                alt={copy === 0 && !reverse ? statement.alt : ""}
                width={Math.round(HEIGHT * statement.ratio)}
                height={HEIGHT}
                unoptimized
                className={small ? "h-10 w-auto opacity-80 sm:h-14" : "h-14 w-auto sm:h-20"}
              />
              <span aria-hidden className={`size-1.5 rounded-full bg-paper ${small ? "mx-8 sm:mx-12" : "mx-10 sm:mx-16"}`} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/**
 * Two bands of official brand lettering running in opposite directions; scrolling also
 * pushes them apart (.marquee-shift-* in scenes.css). Pausable (WCAG 2.2.2).
 */
export function StatementsMarquee() {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  return (
    <section
      ref={ref}
      id="frases"
      data-scene=""
      aria-label="Frases de marca"
      className="relative scroll-mt-20 overflow-hidden bg-aqua py-10 [--focus-ring:var(--brand-white)] sm:py-14"
    >
      <div className="marquee-shift-a hover:[&_.animate-marquee]:[animation-play-state:paused]">
        <Row statements={brandStatements} paused={paused} />
      </div>
      <div className="marquee-shift-b mt-6 hover:[&_.animate-marquee]:[animation-play-state:paused] motion-reduce:hidden sm:mt-10">
        <Row statements={reversed} paused={paused} reverse small />
      </div>

      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? "Reanudar animación de frases" : "Pausar animación de frases"}
        className="absolute right-4 bottom-3 grid size-8 place-items-center rounded-full border border-paper/60 text-paper transition-colors hover:bg-paper hover:text-aqua motion-reduce:hidden sm:right-6"
      >
        {paused ? (
          <span aria-hidden className="ml-0.5 size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
        ) : (
          <span aria-hidden className="flex gap-[3px]">
            <span className="h-2.5 w-[3px] bg-current" />
            <span className="h-2.5 w-[3px] bg-current" />
          </span>
        )}
      </button>
    </section>
  );
}
