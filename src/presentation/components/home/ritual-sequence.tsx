"use client";

import { useEffect, useRef } from "react";
import { ButtonLink } from "@/presentation/components/ui/button-link";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { ritualBeats, ritualFrames, ritualSequenceContent } from "@/presentation/content/home";

/** Keep in sync with the `motion-js` variant in globals.css. */
const ENHANCED = "(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-height: 38rem)";
const SMALL = "(max-width: 767px)";
const LAST = ritualBeats.length - 1;
const pad = (value: number) => String(value).padStart(2, "0");

/** Coarse-to-fine: the whole sequence is scrubbable early, detail fills in after. */
function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let index = 0; index < count; index += stride) {
      if (!seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    }
  }
  return order;
}

/**
 * Home section right after the hero. A 3D sequence (beans → grounds → pour → cup)
 * drawn on a canvas and scrubbed by scroll while the stage stays pinned; the copy
 * changes with each beat.
 *
 * Without JS, with reduced motion or on very short viewports nothing is pinned:
 * the beats stack as regular content, each with its still frame.
 */
export function RitualSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const poster = posterRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !stage || !canvas || !poster || !context) return;

    const enhanced = window.matchMedia(ENHANCED);
    let dispose = () => {};

    const start = () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      const set = window.matchMedia(SMALL).matches ? ritualFrames.small : ritualFrames.large;
      const step = set.step * (saveData ? 4 : 1);
      const count = Math.floor((ritualFrames.count - 1) / step) + 1;
      const images: (HTMLImageElement | undefined)[] = new Array(count);
      const beats = Array.from(section.querySelectorAll<HTMLElement>("[data-beat]"));
      canvas.width = canvas.height = set.size;

      let target = 0;
      let current = 0;
      let drawn = -1;
      let activeBeat = 0;
      let frame = 0;
      let alive = true;

      const range = () => Math.max(1, section.offsetHeight - stage.offsetHeight);
      const stickyTop = () => parseFloat(getComputedStyle(stage).top) || 0;

      const nearestLoaded = (index: number) => {
        for (let distance = 0; distance < count; distance++) {
          if (images[index - distance]) return index - distance;
          if (images[index + distance]) return index + distance;
        }
        return -1;
      };

      const render = () => {
        const index = nearestLoaded(Math.round(current * (count - 1)));
        if (index >= 0 && index !== drawn) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(images[index]!, 0, 0, canvas.width, canvas.height);
          drawn = index;
          poster.style.visibility = "hidden";
        }

        let beat = 0;
        ritualBeats.forEach((item, i) => {
          if (current >= item.from) beat = i;
        });
        if (beat !== activeBeat || !section.hasAttribute("data-running")) {
          activeBeat = beat;
          beats.forEach((element, i) => {
            element.dataset.state = i === beat ? "active" : i < beat ? "past" : "next";
          });
          if (counterRef.current) counterRef.current.textContent = pad(beat + 1);
          section.setAttribute("data-running", "");
        }
        section.style.setProperty("--ritual-progress", current.toFixed(4));
        section.toggleAttribute("data-started", current > 0.02);
      };

      const tick = () => {
        frame = 0;
        const delta = target - current;
        current = Math.abs(delta) < 0.0005 ? target : current + delta * 0.14;
        render();
        if (current !== target) frame = requestAnimationFrame(tick);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };

      const onScroll = () => {
        const scrolled = stickyTop() - section.getBoundingClientRect().top;
        target = Math.min(1, Math.max(0, scrolled / range()));
        schedule();
      };

      /** Keyboard users: focusing a link inside a hidden beat scrolls to that beat. */
      const onFocus = (event: FocusEvent) => {
        const beat = (event.target as HTMLElement).closest<HTMLElement>("[data-beat]");
        const index = beat ? beats.indexOf(beat) : -1;
        if (index < 0 || index === activeBeat) return;
        const top = section.getBoundingClientRect().top + window.scrollY - stickyTop();
        window.scrollTo({ top: top + (ritualBeats[index].from + 0.04) * range() });
      };

      const load = (index: number) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => {
            if (alive) {
              images[index] = image;
              drawn = -1;
              schedule();
            }
            resolve();
          };
          image.onerror = () => resolve();
          image.src = set.src(index * step);
        });

      const loadAll = async () => {
        const queue = loadOrder(count);
        const worker = async () => {
          while (alive && queue.length) await load(queue.shift()!);
        };
        await Promise.all(Array.from({ length: 6 }, worker));
      };

      // Frames wait for the page to finish loading (the hero comes first) and for the
      // section to be within a viewport of the screen.
      const onLoad = () => void loadAll();
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          if (document.readyState === "complete") onLoad();
          else window.addEventListener("load", onLoad, { once: true });
        },
        { rootMargin: "100% 0px" },
      );
      observer.observe(section);

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      section.addEventListener("focusin", onFocus);
      onScroll();

      dispose = () => {
        alive = false;
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("load", onLoad);
        section.removeEventListener("focusin", onFocus);
        section.removeAttribute("data-running");
        section.removeAttribute("data-started");
        poster.style.visibility = "";
        context.clearRect(0, 0, canvas.width, canvas.height);
        beats.forEach((element, i) => (element.dataset.state = i === 0 ? "active" : "next"));
      };
    };

    const sync = () => {
      dispose();
      dispose = () => {};
      if (enhanced.matches) start();
    };
    sync();
    enhanced.addEventListener("change", sync);
    return () => {
      enhanced.removeEventListener("change", sync);
      dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ritual"
      aria-label={ritualSequenceContent.label}
      className="relative scroll-mt-20 motion-js:h-[420svh]"
    >
      <div ref={stageRef} className="motion-js:sticky motion-js:top-20 motion-js:h-[calc(100svh-5rem)] motion-js:overflow-hidden">
        <Container
          size="wide"
          className="relative grid gap-16 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-x-16 lg:gap-y-28 motion-js:h-full motion-js:grid-rows-[auto_minmax(0,1fr)] motion-js:gap-4 motion-js:pt-4 motion-js:pb-14 sm:py-20 motion-js:sm:pt-8 motion-js:sm:pb-16 motion-js:lg:grid-cols-[0.95fr_1.05fr] motion-js:lg:grid-rows-1 motion-js:lg:items-center motion-js:lg:gap-16 motion-js:lg:py-8"
        >
          {/* Sequence: poster (first frame) + canvas drawn over it once frames arrive */}
          <div
            aria-hidden
            className="relative mx-auto aspect-square w-full max-w-[26rem] motion-js:size-[min(84vw,calc(100svh-25rem))] motion-js:max-w-none motion-js:sm:size-[min(70vw,calc(100svh-29rem))] motion-js:lg:size-[min(46vw,78svh)]"
          >
            <span className="absolute inset-[9%] rounded-full bg-tint" />
            <div className="ritual-frame absolute inset-0 motion-js:animate-float">
              <picture>
                <source media={SMALL} srcSet={ritualFrames.small.src(0)} />
                {/* Plain <img>: the frame is pre-optimized and shares its URL with the canvas loader. */}
                <img
                  ref={posterRef}
                  src={ritualFrames.large.src(0)}
                  alt=""
                  width={ritualFrames.large.size}
                  height={ritualFrames.large.size}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full"
                />
              </picture>
              <canvas ref={canvasRef} className="absolute inset-0 hidden size-full motion-js:block" />
            </div>
          </div>

          {/* Beats: stacked content by default, cross-faded in place when pinned */}
          <div className="contents motion-js:grid motion-js:min-h-0">
            {ritualBeats.map((beat, index) => (
              <div
                key={beat.id}
                data-beat=""
                data-state={index === 0 ? "active" : "next"}
                className={`ritual-beat motion-js:col-[1] motion-js:row-[1] motion-js:self-start motion-js:lg:col-[1] motion-js:lg:block motion-js:lg:self-center ${
                  index === 0 ? "" : "lg:col-[1/-1] lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16"
                }`}
              >
                {index > 0 && (
                  <picture>
                    <source media={SMALL} srcSet={ritualFrames.small.src(beat.still)} />
                    {/* Still frame for the non-animated layout. */}
                    <img
                      src={ritualFrames.large.src(beat.still)}
                      alt=""
                      width={ritualFrames.large.size}
                      height={ritualFrames.large.size}
                      loading="lazy"
                      decoding="async"
                      className="mx-auto mb-10 aspect-square w-full max-w-[26rem] lg:mb-0 motion-js:hidden"
                    />
                  </picture>
                )}

                <div className="max-w-2xl">
                  <Eyebrow>{`${pad(index + 1)} · ${beat.label}`}</Eyebrow>
                  <h2 className="mt-4 text-[clamp(2rem,min(5.2vw,8svh),4.5rem)] leading-[1.04] tracking-[-0.03em] text-balance sm:mt-7">
                    {beat.title}
                  </h2>
                  <p className="mt-3 max-w-lg text-base leading-normal text-ink-muted sm:mt-7 sm:text-xl sm:leading-relaxed">
                    {beat.text}
                  </p>
                  {index === LAST && (
                    <div className="mt-5 sm:mt-10">
                      <ButtonLink href="/menu" className="max-sm:px-5">
                        Ver menú
                      </ButtonLink>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress: only meaningful while pinned */}
          <div
            aria-hidden
            className="absolute bottom-4 left-5 hidden items-center gap-4 text-[0.65rem] font-medium tracking-[0.3em] text-ink-muted motion-js:flex sm:left-8 lg:bottom-8"
          >
            <span ref={counterRef}>01</span>
            <span className="relative block h-px w-24 bg-line">
              <span
                className="absolute inset-0 origin-left bg-aqua"
                style={{ transform: "scaleX(var(--ritual-progress, 0))" }}
              />
            </span>
            <span>{pad(ritualBeats.length)}</span>
          </div>
          <div
            aria-hidden
            className="ritual-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-medium tracking-[0.3em] text-ink-muted uppercase motion-js:[@media(min-height:760px)]:lg:flex"
          >
            Desliza
            <span className="block h-10 w-px animate-scroll-cue bg-aqua" />
          </div>
        </Container>
      </div>
    </section>
  );
}
