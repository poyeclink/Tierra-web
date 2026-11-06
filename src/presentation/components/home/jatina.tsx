import Image from "next/image";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { Reveal } from "@/presentation/components/ui/reveal";
import { jatinaContent, jatinaPhoto } from "@/presentation/content/home";

/**
 * "Jatina" concept: each Japanese / Latin pair converges into one point
 * when it scrolls into view (see .converge-* in globals.css). Hover lights it up.
 */
export function Jatina() {
  const { eyebrow, title, lead, columns, pairs } = jatinaContent;

  return (
    <section aria-labelledby="jatina-title" className="overflow-x-clip py-24 sm:py-32">
      <Container size="wide" className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* Photo: after the pairs on mobile, left column on desktop. */}
        <Reveal delay={150} className="unveil order-last lg:order-first">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-tint sm:aspect-[16/10] lg:aspect-[4/5] lg:rounded-t-[999px]">
            <Image
              src={jatinaPhoto.src}
              alt={jatinaPhoto.alt}
              fill
              sizes="(min-width: 1024px) 32rem, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="jatina-title" className="mt-6">
              {title}
            </h2>
            <p className="mt-6 max-w-md text-xl leading-relaxed sm:text-2xl">{lead}</p>
          </Reveal>

          <Reveal className="mt-14 grid grid-cols-[1fr_auto_1fr] gap-4 border-b border-line pb-4 text-xs font-medium tracking-[0.28em] text-ink-muted uppercase sm:gap-8">
            <span className="text-right">{columns.left}</span>
            <span aria-hidden className="w-10 sm:w-14" />
            <span>{columns.right}</span>
          </Reveal>

          <ul>
            {pairs.map((pair, index) => (
              <li key={pair.japan}>
                <Reveal delay={index * 150} className="converge group">
                  <p className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line py-7 text-[clamp(1rem,3.6vw,2rem)] font-medium sm:gap-8 sm:py-9">
                    <span className="converge-left text-right">{pair.japan}</span>
                    <span
                      className="relative grid size-10 place-items-center rounded-full border border-aqua transition-all duration-700 ease-calm group-hover:scale-110 group-hover:bg-aqua sm:size-14"
                    >
                      <span className="sr-only">y</span>
                      <span aria-hidden className="absolute h-px w-3.5 bg-aqua transition-colors duration-700 group-hover:bg-paper" />
                      <span aria-hidden className="absolute h-3.5 w-px bg-aqua transition-all duration-700 group-hover:rotate-90 group-hover:bg-paper" />
                    </span>
                    <span className="converge-right">{pair.latam}</span>
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
