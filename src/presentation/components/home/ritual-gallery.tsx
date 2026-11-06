"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { Reveal } from "@/presentation/components/ui/reveal";
import { ritualContent } from "@/presentation/content/home";

/**
 * "El ritual": horizontal, snap-scrolling photo strip.
 * Works with touch/trackpad scrolling; the arrow buttons page through it on desktop.
 */
export function RitualGallery() {
  const { eyebrow, title, moments } = ritualContent;
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const element = track.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: reduce ? "instant" : "smooth" });
  };

  // aria-disabled (not disabled) keeps keyboard focus on the button at either end.
  const arrow = "grid size-12 place-items-center rounded-full border border-line transition-all duration-500 ease-calm hover:border-aqua hover:bg-aqua hover:text-paper aria-disabled:pointer-events-none aria-disabled:opacity-30";

  return (
    <section aria-labelledby="ritual-title" className="overflow-x-clip py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="ritual-title" className="mt-6">
              {title}
            </h2>
          </div>
          <div className="hidden shrink-0 gap-3 sm:flex">
            <button type="button" aria-label="Fotos anteriores" aria-disabled={edges.start} onClick={() => page(-1)} className={arrow}>
              <span aria-hidden>←</span>
            </button>
            <button type="button" aria-label="Fotos siguientes" aria-disabled={edges.end} onClick={() => page(1)} className={arrow}>
              <span aria-hidden>→</span>
            </button>
          </div>
        </Reveal>
      </Container>

      {/* Full-bleed track aligned with the container's left edge. */}
      <ul
        ref={track}
        className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 scroll-px-5 sm:px-[max(2rem,calc((100vw-80rem)/2+2rem))] sm:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {moments.map((moment, index) => (
          <li
            key={moment.caption}
            className={`w-[72vw] shrink-0 snap-start sm:w-[22rem] ${index % 2 ? "sm:pt-16" : ""}`}
          >
            <Reveal delay={(index % 4) * 120} className="unveil">
              <figure className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-tint">
                  <Image
                    src={moment.photo.src}
                    alt={moment.photo.alt}
                    fill
                    sizes="(min-width: 640px) 22rem, 72vw"
                    className="object-cover transition-[scale] duration-1000 ease-calm group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-5 flex items-baseline gap-4">
                  <span className="text-sm text-ink-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-medium">{moment.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
