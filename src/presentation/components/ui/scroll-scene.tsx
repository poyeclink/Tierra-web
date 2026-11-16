"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

/** Same condition as the `motion-js` CSS variant and the scene styles (globals.css, scenes.css). */
export const MOTION_QUERY = "(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-height: 38rem)";

/**
 * Writes the scroll progress of `ref` (0 → 1) into its `--p` CSS variable, once per frame
 * and only while it is near the viewport. Styles in scenes.css turn `--p` into motion.
 *
 * - Default: progress while the element crosses the viewport (enters at the bottom → leaves at the top).
 * - `pinned`: progress while its `[data-stage]` child (position: sticky) is stuck. Moving focus into a
 *   pinned scene jumps to its end, so keyboard users never land on content that is still hidden.
 *
 * Without JS or with reduced motion nothing runs and the styles show the final, static layout.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, pinned = false) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia(MOTION_QUERY);
    let frame = 0;
    let visible = false;
    let stage: HTMLElement | null = null;
    let stickyTop = 0;

    // Optional [data-scene-head] inside the stage: its bottom edge is exposed as --head, so the
    // scene's styles can keep artwork clear of the heading at any screen width.
    const head = element.querySelector<HTMLElement>("[data-scene-head]");
    const measureHead = () => {
      if (head) element.style.setProperty("--head", `${Math.ceil(head.offsetTop + head.offsetHeight)}px`);
    };
    const headObserver = head ? new ResizeObserver(measureHead) : null;

    const measure = () => {
      stage = pinned ? element.querySelector<HTMLElement>("[data-stage]") : null;
      stickyTop = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
      measureHead();
    };
    const range = () => (stage ? element.offsetHeight - stage.offsetHeight : 0);

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = stage
        ? range() > 0
          ? (stickyTop - rect.top) / range()
          : 0
        : (viewport - rect.top) / (viewport + rect.height);
      element.style.setProperty("--p", Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    let focusTimer = 0;
    const jumpToEnd = () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("scrollend", jumpToEnd);
      const end = element.getBoundingClientRect().top + window.scrollY - stickyTop + range();
      if (Math.abs(window.scrollY - end) > 4) window.scrollTo({ top: end, behavior: "instant" });
    };
    const onFocus = () => {
      if (!stage) return;
      // Wait for the browser's own (possibly smooth) scroll to the focused element to finish.
      window.addEventListener("scrollend", jumpToEnd, { once: true });
      focusTimer = window.setTimeout(jumpToEnd, 1200);
      requestAnimationFrame(() => {
        if (!element.matches(":focus-within")) return;
        // Nothing scrolled: no scrollend will come.
        const rect = element.getBoundingClientRect();
        if (rect.top <= stickyTop && rect.bottom >= window.innerHeight) jumpToEnd();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onResize();
      },
      { rootMargin: "30% 0px" },
    );

    const start = () => {
      measure();
      observer.observe(element);
      if (head) headObserver?.observe(head);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      element.addEventListener("focusin", onFocus);
    };
    const stop = () => {
      observer.disconnect();
      headObserver?.disconnect();
      element.style.removeProperty("--head");
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scrollend", jumpToEnd);
      window.clearTimeout(focusTimer);
      element.removeEventListener("focusin", onFocus);
      element.style.removeProperty("--p");
    };
    const sync = () => {
      stop();
      if (motion.matches) start();
    };

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      stop();
    };
  }, [ref, pinned]);
}

type ScrollSceneProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "li";
  pinned?: boolean;
  children: ReactNode;
};

/** An element that exposes its scroll progress as `--p` (see useScrollProgress). */
export function ScrollScene({ as = "div", pinned = false, children, ...props }: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, pinned);
  // One concrete tag type keeps the ref typing simple; the rendered tag is still `as`.
  const Tag = as as "div";
  return (
    <Tag {...props} ref={ref} data-scene="">
      {children}
    </Tag>
  );
}
