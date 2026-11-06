"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { heroContent, heroPhoto, icon, ICON_RATIO } from "@/presentation/content/home";

/**
 * Hero artwork: torii-texture arch, floating brand statement and a rotating badge.
 * Layers drift with the pointer (fine pointers only, motion allowed).
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const pathId = useId();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const canAnimate = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!canAnimate.matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        element.style.setProperty("--px", x.toFixed(3));
        element.style.setProperty("--py", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const layer = (depth: number) => ({
    transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
  });

  return (
    <div ref={ref} aria-hidden className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] animate-rise [animation-delay:250ms]">
      {/* Arch: official torii texture as the frame, photograph inside */}
      <div
        className="absolute inset-x-[6%] top-0 bottom-[6%] overflow-hidden rounded-t-full bg-aqua shadow-[0_40px_80px_-40px_var(--brand-aqua)] transition-transform duration-700 ease-calm"
        style={layer(-10)}
      >
        <Image
          src="/brand/texturas/textura-aqua.svg"
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 26rem, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-3 overflow-hidden rounded-t-full bg-tint sm:inset-4">
          <div className="absolute -inset-6 transition-transform duration-1000 ease-calm" style={layer(14)}>
            <Image
              src={heroPhoto.src}
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) 26rem, 90vw"
              className="animate-settle object-cover"
            />
          </div>
        </div>
      </div>

      {/* Floating brand statement */}
      <div
        className="absolute bottom-0 left-0 w-[62%] rounded-[1.75rem] bg-canvas px-6 py-5 shadow-[0_24px_60px_-28px_var(--color-text)] transition-transform duration-700 ease-calm sm:px-8 sm:py-6"
        style={layer(14)}
      >
        <Image
          src="/brand/frases/frase-stay-grounded-aqua.svg"
          alt=""
          width={360}
          height={164}
          unoptimized
          className="h-auto w-full"
        />
      </div>

      {/* Rotating badge */}
      <div
        className="group absolute top-[8%] -right-1 size-32 transition-transform duration-700 ease-calm sm:-right-4 sm:size-36"
        style={layer(26)}
      >
        <div className="absolute inset-0 rounded-full bg-canvas shadow-[0_20px_50px_-24px_var(--color-text)]" />
        <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow group-hover:[animation-play-state:paused]">
          <defs>
            <path id={pathId} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          </defs>
          <text className="fill-crimson text-[13px] font-medium tracking-[0.12em] uppercase">
            <textPath href={`#${pathId}`} textLength="462" lengthAdjust="spacing">
              {heroContent.badgeText}
            </textPath>
          </text>
        </svg>
        <Image
          src={icon("sol-amanecer")}
          alt=""
          width={Math.round(96 * ICON_RATIO)}
          height={96}
          unoptimized
          className="absolute top-1/2 left-1/2 h-auto w-[62%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
