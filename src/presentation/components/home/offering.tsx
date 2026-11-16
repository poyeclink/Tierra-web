import { ButtonLink } from "@/presentation/components/ui/button-link";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { MaskLines } from "@/presentation/components/ui/mask-lines";
import { Reveal } from "@/presentation/components/ui/reveal";
import { offeringContent } from "@/presentation/content/home";
import { OfferingList } from "./offering-list";

/** "Propuesta": big interactive rows instead of cards (offering-list.tsx). */
export function Offering() {
  const { eyebrow, titleLines, lead, items } = offeringContent;

  return (
    <section aria-labelledby="offering-title" className="overflow-x-clip bg-tint py-24 sm:py-36">
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <Reveal className="mask-reveal">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="offering-title" className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] tracking-[-0.04em]">
              <MaskLines lines={titleLines} />
            </h2>
          </Reveal>
          <Reveal delay={150} className="max-w-sm">
            <p className="text-lg leading-relaxed text-ink-muted">{lead}</p>
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-20">
          <OfferingList items={items} />
        </div>

        <Reveal className="mt-14 flex justify-center">
          <ButtonLink href="/menu">Ver menú completo</ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
