import Image from "next/image";
import type { Establishment } from "@/core/establishment/domain/establishment";
import { OpeningHours } from "@/presentation/components/establishment/opening-hours";
import { ButtonLink } from "@/presentation/components/ui/button-link";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { Reveal } from "@/presentation/components/ui/reveal";
import { Todo } from "@/presentation/components/ui/todo";
import { icon, ICON_RATIO, manifestoContent, visitPhoto, visitStatement } from "@/presentation/content/home";
import { ManifestoText } from "./manifesto";
import { Principles } from "./principles";

export function PrinciplesSection({ principles }: { principles: Establishment["principles"] }) {
  return (
    <section aria-labelledby="principles-title" className="py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="max-w-2xl">
          <Eyebrow>Principios</Eyebrow>
          <h2 id="principles-title" className="mt-6">
            Cada detalle, con intención
          </h2>
        </Reveal>
        <Reveal delay={150} className="mt-14">
          <Principles principles={principles} />
        </Reveal>
      </Container>
    </section>
  );
}

export function ManifestoSection() {
  return (
    <section aria-labelledby="manifesto-title" className="border-y border-line py-24 sm:py-36">
      <Container>
        <div className="flex items-center gap-4">
          <Image
            src={icon("taza-humeante")}
            alt=""
            width={Math.round(56 * ICON_RATIO)}
            height={56}
            unoptimized
            className="-ml-3 h-14 w-auto"
          />
          <h2 id="manifesto-title" className="text-xs font-medium tracking-[0.28em] text-crimson uppercase">
            {manifestoContent.eyebrow}
          </h2>
        </div>
        <div className="mt-10">
          <ManifestoText />
        </div>
        <Reveal className="mt-12">
          <p className="max-w-3xl text-[clamp(1.5rem,3vw,2.25rem)] leading-snug font-black text-aqua">
            {manifestoContent.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

export function VisitSection({ establishment }: { establishment: Establishment }) {
  const { address, openingHours } = establishment;

  return (
    <section aria-labelledby="visit-title" className="py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="grid overflow-hidden rounded-[2.5rem] lg:grid-cols-2">
          {/* Aqua panel: lettering + large white heading (large text: 3.06:1 allowed) */}
          <div className="flex flex-col justify-between gap-12 bg-aqua p-10 [--focus-ring:var(--brand-white)] sm:p-14">
            <Image
              src={visitStatement.src}
              alt={visitStatement.alt}
              width={Math.round(200 * visitStatement.ratio)}
              height={200}
              unoptimized
              className="h-auto w-full max-w-sm"
            />
            <h2 id="visit-title" className="text-paper">
              Visítanos
            </h2>
          </div>

          {/* Photograph with the information card */}
          <div className="group relative overflow-hidden bg-tint p-6 sm:p-10 lg:pt-40">
            <Image
              src={visitPhoto.src}
              alt={visitPhoto.alt}
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="object-cover transition-[scale] duration-[2s] ease-calm group-hover:scale-105"
            />
            <div className="relative rounded-[1.75rem] bg-canvas p-8 shadow-[0_30px_70px_-40px_var(--color-text)] sm:p-10">
              <h3 className="text-xs font-medium tracking-[0.28em] text-crimson uppercase">Horario</h3>
              <div className="mt-5">
                <OpeningHours hours={openingHours} />
              </div>

              <h3 className="mt-10 text-xs font-medium tracking-[0.28em] text-crimson uppercase">Ubicación</h3>
              <div className="mt-5 text-sm">
                {address ? (
                  <address className="not-italic">
                    <p>{address.line1}</p>
                    <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
                  </address>
                ) : (
                  <Todo>ubicación pendiente del cliente</Todo>
                )}
              </div>

              <ButtonLink href="/contacto" className="mt-10">
                Contacto
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
