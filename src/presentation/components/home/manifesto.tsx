"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { manifestoContent } from "@/presentation/content/home";

/**
 * Manifesto that "writes itself" while scrolling: one CSS variable (--p, 0→1)
 * drives every word's opacity. Server render and reduced motion: fully visible.
 */
export function ManifestoText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = manifestoContent.text.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.85;
      const distance = rect.height + viewport * 0.35;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
      element.style.setProperty("--p", progress.toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.18] font-medium tracking-[-0.02em] text-balance"
      style={{ "--p": 1, "--n": words.length } as CSSProperties}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="transition-opacity duration-300"
          style={
            {
              "--i": index,
              opacity: "clamp(0.16, calc(var(--p) * var(--n) * 1.2 - var(--i)), 1)",
            } as CSSProperties
          }
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
