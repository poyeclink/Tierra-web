"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Principle } from "@/core/establishment/domain/establishment";
import { ICON_RATIO, principleIcons, principlePhotos } from "@/presentation/content/home";

/**
 * Brand principles. Mobile: accordion. Desktop: list + large illustrated panel.
 * Hovering or focusing a principle on desktop previews it.
 */
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

export function Principles({ principles }: { principles: readonly Principle[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  // -1 = every accordion item closed (mobile); the desktop panel keeps showing the first.
  const current = principles[Math.max(active, 0)];
  if (!current) return null;
  const currentIcon = principleIcons[current.title];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <ol className="border-t border-line">
        {principles.map((principle, index) => {
          const isActive = index === active;
          const panelId = `${baseId}-${index}`;
          return (
            <li key={principle.title} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  // Desktop is a preview list (never collapses); mobile is a toggling accordion.
                  onClick={() => setActive(isActive && !isDesktop() ? -1 : index)}
                  onFocus={() => isDesktop() && setActive(index)}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                  className="group relative flex w-full items-center gap-5 py-6 text-left sm:gap-8"
                >
                  <span
                    aria-hidden
                    className={`absolute top-0 left-0 h-full w-0.5 origin-top bg-aqua transition-transform duration-700 ease-calm ${
                      isActive ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  <span className="w-8 pl-4 text-sm text-ink-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span
                    className={`flex-1 text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-ink-muted group-hover:text-ink"
                    }`}
                  >
                    {principle.title}
                  </span>
                  <span
                    aria-hidden
                    className={`relative grid size-9 place-items-center rounded-full border transition-all duration-500 ease-calm lg:hidden ${
                      isActive ? "rotate-45 border-aqua" : "border-line"
                    }`}
                  >
                    <span className="absolute h-px w-3 bg-ink" />
                    <span className="absolute h-3 w-px bg-ink" />
                  </span>
                </button>
              </h3>
              {/* Inline description: mobile accordion. On desktop it stays for screen readers
                  while the illustrated panel shows it visually. */}
              <div
                id={panelId}
                aria-hidden={!isActive}
                className={`grid transition-[grid-template-rows] duration-700 ease-calm lg:sr-only ${
                  isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  {principlePhotos[principle.title] && (
                    <div className="relative mb-6 ml-[4.25rem] aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-tint lg:hidden">
                      <Image
                        src={principlePhotos[principle.title].src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 36rem, 80vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-5 pr-2 pb-7 pl-[4.25rem]">
                    <p className="flex-1 text-ink-muted">{principle.description}</p>
                    {principleIcons[principle.title] && (
                      <Image
                        src={principleIcons[principle.title]}
                        alt=""
                        width={Math.round(80 * ICON_RATIO)}
                        height={80}
                        unoptimized
                        className="h-auto w-24 shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop panel */}
      <div aria-hidden className="relative hidden lg:block">
        <div className="sticky top-28">
          <div className="relative mx-auto aspect-square max-w-[28rem]">
            {/* Every photo stays mounted so switching is an instant crossfade. */}
            <div className="absolute inset-0 overflow-hidden rounded-full bg-tint shadow-[0_40px_90px_-50px_var(--brand-aqua)]">
              {principles.map((principle) => {
                const photo = principlePhotos[principle.title];
                const isCurrent = principle === current;
                return (
                  photo && (
                    <Image
                      key={principle.title}
                      src={photo.src}
                      alt=""
                      fill
                      sizes="28rem"
                      className={`object-cover transition-[opacity,scale] duration-1000 ease-calm ${
                        isCurrent ? "scale-100 opacity-100" : "scale-110 opacity-0"
                      }`}
                    />
                  )
                );
              })}
            </div>
            {currentIcon && (
              <span className="absolute bottom-[2%] left-[2%] size-32 rounded-full border-4 border-canvas bg-tint shadow-[0_20px_50px_-24px_var(--color-text)]">
                <Image
                  key={current.title}
                  src={currentIcon}
                  alt=""
                  width={Math.round(160 * ICON_RATIO)}
                  height={160}
                  unoptimized
                  className="absolute top-1/2 left-1/2 h-auto w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 animate-rise"
                />
              </span>
            )}
          </div>
          <div key={current.title} className="mx-auto mt-8 max-w-sm animate-rise text-center">
            <p className="text-2xl font-medium">{current.title}</p>
            <p className="mt-3 text-ink-muted">{current.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
