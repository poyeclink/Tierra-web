"use client";

import Image from "next/image";
import { useState } from "react";
import { brandStatements } from "@/presentation/content/home";

const HEIGHT = 80;

/** Infinite band of official brand lettering. Pausable (WCAG 2.2.2). */
export function StatementsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="frases"
      aria-label="Frases de marca"
      className="relative scroll-mt-20 overflow-hidden bg-aqua py-10 [--focus-ring:var(--brand-white)] sm:py-14"
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto"
        style={paused ? { animationPlayState: "paused" } : undefined}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center motion-reduce:[&:nth-child(2)]:hidden">
            {brandStatements.map((statement) => (
              <li key={statement.src} className="flex items-center">
                <Image
                  src={statement.src}
                  alt={copy === 0 ? statement.alt : ""}
                  width={Math.round(HEIGHT * statement.ratio)}
                  height={HEIGHT}
                  unoptimized
                  className="h-14 w-auto sm:h-20"
                />
                <span aria-hidden className="mx-10 size-1.5 rounded-full bg-paper sm:mx-16" />
              </li>
            ))}
          </ul>
        ))}
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
