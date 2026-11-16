import Image from "next/image";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { Reveal } from "@/presentation/components/ui/reveal";
import { ScrollScene } from "@/presentation/components/ui/scroll-scene";
import { jatinaContent, jatinaPairPhotos, jatinaPhoto } from "@/presentation/content/home";

/**
 * "Jatina" concept as an editorial spread: a giant title drifting with the scroll, an arch
 * photograph in parallax and three Japan / Latin America pairs whose words travel from
 * opposite edges and meet as each row crosses the screen (styles: scenes.css).
 */
export function Jatina() {
  const { eyebrow, title, lead, columns, pairs } = jatinaContent;

  return (
    <ScrollScene as="section" aria-labelledby="jatina-title" className="overflow-x-clip py-24 sm:py-36">
      <Container size="wide" className="grid items-end gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <h2
            id="jatina-title"
            className="jatina-title mt-6 text-[clamp(5.5rem,21vw,19rem)] leading-[0.8] tracking-[-0.065em]"
          >
            {title}
          </h2>
          <Reveal delay={100} className="mt-10 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-12">
            <p className="text-xs font-medium tracking-[0.28em] whitespace-nowrap text-ink-muted uppercase">
              {columns.left} <span className="text-aqua">×</span> {columns.right}
            </p>
            <p className="max-w-md text-xl leading-relaxed sm:text-2xl">{lead}</p>
          </Reveal>
        </div>

        <div className="jatina-arch relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-full bg-tint shadow-[0_50px_90px_-60px_var(--brand-aqua)] sm:max-w-sm lg:max-w-none">
          <div className="jatina-arch-media absolute inset-0">
            <Image
              src={jatinaPhoto.src}
              alt={jatinaPhoto.alt}
              fill
              sizes="(min-width: 1024px) 28rem, 22rem"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      <ol className="mt-20 border-b border-line sm:mt-28">
        {pairs.map((pair, index) => {
          const photo = jatinaPairPhotos[index];
          return (
            <li key={pair.japan} className="border-t border-line">
              <ScrollScene className="jatina-pair">
                <Container size="wide" className="py-8 sm:py-12">
                  <div
                    aria-hidden
                    className="mb-3 flex justify-between text-[0.65rem] font-medium tracking-[0.3em] text-ink-muted uppercase sm:mb-5 sm:text-xs"
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")} · {columns.left}
                    </span>
                    <span>{columns.right}</span>
                  </div>
                  <p className="text-[clamp(1.9rem,8.4vw,8rem)] leading-[1] font-medium tracking-[-0.045em]">
                    <span className="flex items-center gap-[0.22em]">
                      <span className="from-left">{pair.japan}</span>
                      {photo && (
                        <span
                          aria-hidden
                          className="pill relative inline-block h-[0.78em] w-[1.9em] shrink-0 overflow-hidden rounded-full bg-tint"
                        >
                          <span className="absolute inset-0">
                            <Image src={photo.src} alt="" fill sizes="16rem" className="object-cover" />
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="mt-[0.08em] flex items-center justify-end gap-[0.25em]">
                      <span
                        aria-hidden
                        className="plus relative grid size-[0.62em] shrink-0 place-items-center rounded-full border border-aqua"
                      >
                        <span className="absolute h-px w-[38%] bg-aqua" />
                        <span className="absolute h-[38%] w-px bg-aqua" />
                      </span>
                      <span className="sr-only"> y </span>
                      <span className="from-right text-aqua">{pair.latam}</span>
                    </span>
                  </p>
                </Container>
              </ScrollScene>
            </li>
          );
        })}
      </ol>
    </ScrollScene>
  );
}
