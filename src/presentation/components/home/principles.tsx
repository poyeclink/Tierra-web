import Image from "next/image";
import type { CSSProperties } from "react";
import type { Principle } from "@/core/establishment/domain/establishment";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { ScrollScene } from "@/presentation/components/ui/scroll-scene";
import { ICON_RATIO, principleIcons, principlePhotos, principlesContent } from "@/presentation/content/home";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Brand principles as a horizontal gallery. With motion the section pins and vertical
 * scroll moves the track sideways (sizes and motion: .hscroll in scenes.css); otherwise
 * it is a native, snap-scrolling strip.
 */
export function PrinciplesSection({ principles }: { principles: readonly Principle[] }) {
  const { eyebrow, title, lead } = principlesContent;

  return (
    <ScrollScene
      as="section"
      pinned
      aria-labelledby="principles-title"
      className="hscroll relative"
      style={{ "--count": principles.length } as CSSProperties}
    >
      <div
        data-stage
        className="py-24 sm:py-32 motion-js:sticky motion-js:top-20 motion-js:flex motion-js:h-[calc(100svh-5rem)] motion-js:items-center motion-js:overflow-hidden motion-js:py-0"
      >
        <ol className="hscroll-track flex snap-x snap-mandatory scroll-px-[var(--pad)] gap-[var(--gap)] overflow-x-auto px-[var(--pad)] pb-2 [scrollbar-width:none] motion-js:snap-none motion-js:overflow-visible motion-js:pb-0 [&::-webkit-scrollbar]:hidden">
          <li className="flex w-[var(--intro)] shrink-0 snap-start flex-col justify-center pr-4 sm:pr-10">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="principles-title" className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.035em] text-balance">
              {title}
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-muted">{lead}</p>
            <div aria-hidden className="mt-10 hidden items-center gap-4 text-[0.65rem] font-medium tracking-[0.3em] text-ink-muted uppercase motion-js:flex">
              <span>Desliza</span>
              <span className="relative block h-px w-32 bg-line">
                <span className="hscroll-bar absolute inset-0 origin-left bg-aqua" />
              </span>
              <span className="tabular-nums">{pad(principles.length)}</span>
            </div>
          </li>

          {principles.map((principle, index) => {
            const photo = principlePhotos[principle.title];
            const icon = principleIcons[principle.title];
            return (
              <li
                key={principle.title}
                style={{ "--i": index } as CSSProperties}
                className={`group relative h-[32rem] w-[var(--panel)] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-deep text-paper motion-js:h-[min(72svh,40rem)] ${
                  index % 2 ? "motion-js:translate-y-[4svh]" : "motion-js:-translate-y-[4svh]"
                }`}
              >
                {photo && (
                  <div className="hscroll-media absolute inset-0">
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 27rem, 78vw"
                      className="object-cover transition-transform duration-[1.6s] ease-calm group-hover:scale-105"
                    />
                  </div>
                )}
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-deep via-deep/45 to-deep/10" />

                <article className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                  <div className="flex items-start justify-between gap-4">
                    <span aria-hidden className="text-[clamp(3.5rem,6vw,5rem)] leading-none font-medium tracking-[-0.05em] text-paper/90 tabular-nums">
                      {pad(index + 1)}
                    </span>
                    {icon && (
                      <span aria-hidden className="relative size-16 shrink-0 rounded-full bg-canvas transition-transform duration-700 ease-calm group-hover:-rotate-12 sm:size-20">
                        <Image
                          src={icon}
                          alt=""
                          width={Math.round(120 * ICON_RATIO)}
                          height={120}
                          unoptimized
                          className="absolute top-1/2 left-1/2 h-auto w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2"
                        />
                      </span>
                    )}
                  </div>
                  <div>
                    <span aria-hidden className="block h-px w-12 bg-aqua-soft transition-[width] duration-700 ease-calm group-hover:w-24" />
                    <h3 className="mt-6 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.02em]">
                      {principle.title}
                    </h3>
                    <p className="mt-3 max-w-xs leading-relaxed text-paper/85">{principle.description}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </ScrollScene>
  );
}
