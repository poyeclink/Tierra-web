"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Photo } from "@/presentation/content/photos";
import { ICON_RATIO } from "@/presentation/content/home";

type Item = { readonly title: string; readonly text: string; readonly icon: string; readonly photo: Photo };

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Large editorial rows beside a sticky preview (desktop). Hovering or focusing a row makes
 * it active: its photo wipes into the arch and its icon and description appear underneath,
 * never on top of the list. Small screens get an inline thumbnail and description instead.
 */
export function OfferingList({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  if (!current) return null;

  return (
    <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
      <ul className="border-t border-line">
        {items.map((item, index) => (
          <li key={item.title} className="border-b border-line">
            <Link
              href="/menu"
              data-active={index === active}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
              onFocus={() => setActive(index)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 sm:gap-8 sm:py-9 lg:grid-cols-[2.5rem_1fr_auto]"
            >
              {/* Fill behind the active / hovered row */}
              <span
                aria-hidden
                className="absolute inset-x-[-1.25rem] inset-y-0 origin-bottom scale-y-0 rounded-[1.5rem] bg-canvas transition-transform duration-700 ease-calm group-hover:scale-y-100 group-focus-visible:scale-y-100 sm:inset-x-[-1.75rem] lg:group-data-[active=true]:scale-y-100"
              />

              <span aria-hidden className="relative hidden text-sm text-ink-muted tabular-nums lg:block">
                {pad(index + 1)}
              </span>

              {/* Small screens: inline photo */}
              <span aria-hidden className="relative size-16 shrink-0 overflow-hidden rounded-full bg-tint sm:size-20 lg:hidden">
                <Image src={item.photo.src} alt="" fill sizes="5rem" className="object-cover" />
              </span>

              <span className="relative min-w-0">
                {/* Text roll: the ink line slides up and an aqua copy follows it */}
                <span className="relative block overflow-hidden pb-[0.06em]">
                  <span className="block text-[clamp(1.6rem,3.2vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.035em] transition-[translate,opacity] duration-700 ease-calm group-hover:-translate-y-full group-hover:opacity-0 group-focus-visible:-translate-y-full group-focus-visible:opacity-0 lg:group-data-[active=true]:-translate-y-full lg:group-data-[active=true]:opacity-0">
                    {item.title}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-full block text-[clamp(1.6rem,3.2vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.035em] text-aqua transition-transform duration-700 ease-calm group-hover:-translate-y-full group-focus-visible:-translate-y-full lg:group-data-[active=true]:-translate-y-full"
                  >
                    {item.title}
                  </span>
                </span>
                {/* Shown inline on small screens; on desktop the preview shows it, this stays for screen readers */}
                <span className="mt-1 block text-ink-muted lg:sr-only">{item.text}</span>
              </span>

              <span
                aria-hidden
                className="relative grid size-12 place-items-center justify-self-end rounded-full border border-line text-ink transition-all duration-500 ease-calm group-hover:-rotate-45 group-hover:border-crimson group-hover:bg-crimson group-hover:text-on-crimson group-focus-visible:-rotate-45 group-focus-visible:border-crimson group-focus-visible:bg-crimson group-focus-visible:text-on-crimson sm:size-14 lg:group-data-[active=true]:-rotate-45 lg:group-data-[active=true]:border-crimson lg:group-data-[active=true]:bg-crimson lg:group-data-[active=true]:text-on-crimson"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop preview: beside the list, never over it */}
      <div aria-hidden className="relative hidden lg:block">
        <div className="sticky top-28">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[24rem]">
            <div className="absolute inset-0 overflow-hidden rounded-t-full bg-tint shadow-[0_50px_90px_-50px_var(--brand-aqua)]">
              {items.map((item, index) => (
                <div
                  key={item.title}
                  className={`absolute inset-0 transition-[clip-path] duration-[900ms] ease-calm ${
                    index === active ? "z-[1] [clip-path:inset(0)]" : "[clip-path:inset(100%_0_0_0)]"
                  }`}
                >
                  <Image
                    src={item.photo.src}
                    alt=""
                    fill
                    sizes="24rem"
                    className={`object-cover transition-transform duration-[1.4s] ease-calm ${index === active ? "scale-100" : "scale-115"}`}
                  />
                </div>
              ))}
            </div>
            <span className="absolute -bottom-6 -left-6 z-[2] size-28 rounded-full border-4 border-tint bg-canvas shadow-[0_20px_50px_-24px_var(--color-text)]">
              <Image
                key={current.title}
                src={current.icon}
                alt=""
                width={Math.round(140 * ICON_RATIO)}
                height={140}
                unoptimized
                className="absolute top-1/2 left-1/2 h-auto w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2 animate-rise"
              />
            </span>
          </div>

          <div key={current.title} className="mx-auto mt-12 max-w-[24rem] animate-rise">
            <p className="text-xs font-medium tracking-[0.28em] text-ink-muted tabular-nums">
              {pad(active + 1)} / {pad(items.length)}
            </p>
            <p className="mt-3 text-2xl font-medium">{current.title}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink-muted">{current.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
