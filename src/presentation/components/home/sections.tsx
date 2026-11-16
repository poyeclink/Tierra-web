import Image from "next/image";
import type { CSSProperties } from "react";
import type { Establishment } from "@/core/establishment/domain/establishment";
import { OpeningHours } from "@/presentation/components/establishment/opening-hours";
import { ButtonLink } from "@/presentation/components/ui/button-link";
import { Container } from "@/presentation/components/ui/container";
import { Reveal } from "@/presentation/components/ui/reveal";
import { ScrollScene } from "@/presentation/components/ui/scroll-scene";
import { Todo } from "@/presentation/components/ui/todo";
import {
  icon,
  ICON_RATIO,
  manifestoContent,
  manifestoPhotos,
  visitContent,
  visitPhoto,
  visitStatement,
} from "@/presentation/content/home";
import { ManifestoText } from "./manifesto";

export { PrinciplesSection } from "./principles";

/** Photos floating in the side margins of the manifesto, each at its own speed and tilt. */
const FLOATS = [
  { className: "top-[10%] -left-12 w-52 aspect-[3/4] rounded-t-full", speed: "55vh", tilt: "-5deg" },
  { className: "top-[34%] -right-10 w-44 aspect-square rounded-full", speed: "90vh", tilt: "4deg" },
  { className: "bottom-[8%] left-[4%] w-36 aspect-[4/5] rounded-[1.5rem]", speed: "35vh", tilt: "3deg" },
];

/** Manifesto on a deep teal field: words light up with the scroll, photos drift around it. */
export function ManifestoSection() {
  return (
    <ScrollScene
      as="section"
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden bg-deep py-32 text-paper [--focus-ring:var(--brand-white)] sm:py-48"
    >
      {/* Official torii texture, barely there */}
      <div
        aria-hidden
        className="manifesto-texture absolute inset-x-0 -inset-y-[15%] opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      >
        <Image src="/brand/texturas/textura-aqua.svg" alt="" fill unoptimized className="object-cover" />
      </div>

      {manifestoPhotos.map((photo, index) => {
        const float = FLOATS[index];
        return (
          float && (
            <div
              key={photo.src}
              aria-hidden
              className={`manifesto-float absolute hidden overflow-hidden bg-tint/10 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)] xl:block ${float.className}`}
              style={{ "--speed": float.speed, "--tilt": float.tilt } as CSSProperties}
            >
              <Image src={photo.src} alt="" fill sizes="13rem" className="object-cover" />
            </div>
          )
        );
      })}

      <Container className="relative">
        <div className="flex items-center gap-4">
          <span className="relative size-14 shrink-0 rounded-full bg-canvas">
            <Image
              src={icon("taza-humeante")}
              alt=""
              width={Math.round(84 * ICON_RATIO)}
              height={84}
              unoptimized
              className="absolute top-1/2 left-1/2 h-auto w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </span>
          <h2 id="manifesto-title" className="text-xs font-medium tracking-[0.28em] text-aqua-soft uppercase">
            {manifestoContent.eyebrow}
          </h2>
        </div>
        <div className="mt-12">
          <ManifestoText />
        </div>
        <Reveal className="mt-16 flex flex-col gap-6 border-t border-paper/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[clamp(1.5rem,3vw,2.25rem)] leading-snug font-black text-aqua-soft">
            {manifestoContent.closing}
          </p>
          <ButtonLink href="/nosotros" variant="inverse" className="shrink-0">
            Nuestra historia
          </ButtonLink>
        </Reveal>
      </Container>
    </ScrollScene>
  );
}

const label = "text-xs font-medium tracking-[0.28em] text-crimson uppercase";

/**
 * "Visítanos": with motion the photo opens from an inset frame to full screen while the
 * lettering and the information card rise into place (.visit in scenes.css).
 */
export function VisitSection({ establishment }: { establishment: Establishment }) {
  const { address, openingHours } = establishment;

  return (
    <ScrollScene as="section" pinned aria-labelledby="visit-title" className="visit relative py-16 sm:py-24 motion-js:h-[190svh] motion-js:py-0">
      <div
        data-stage
        className="relative mx-5 overflow-hidden rounded-[2.5rem] sm:mx-8 motion-js:sticky motion-js:top-20 motion-js:mx-0 motion-js:h-[calc(100svh-5rem)] motion-js:rounded-none"
      >
        <div className="visit-media absolute inset-0 bg-deep">
          <Image src={visitPhoto.src} alt={visitPhoto.alt} fill sizes="100vw" className="object-cover" />
          <div
            aria-hidden
            className="visit-shade absolute inset-0 bg-deep/80 lg:bg-transparent lg:bg-linear-to-r lg:from-deep/95 lg:via-deep/75 lg:to-deep/20"
          />
        </div>

        <Container
          size="wide"
          className="relative grid min-h-[40rem] content-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 motion-js:h-full motion-js:min-h-0 motion-js:py-8"
        >
          <div className="visit-copy text-paper">
            <Image
              src={visitStatement.src}
              alt={visitStatement.alt}
              width={Math.round(200 * visitStatement.ratio)}
              height={200}
              unoptimized
              className="h-auto w-[min(100%,26rem)] lg:w-[min(100%,32rem)]"
            />
            <h2 id="visit-title" className="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.035em] text-paper sm:mt-12">
              Visítanos
            </h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-paper/85">{visitContent.lead}</p>
          </div>

          <div className="visit-card rounded-[2rem] bg-canvas p-7 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.55)] sm:p-10 lg:justify-self-end lg:w-full lg:max-w-md">
            <h3 className={label}>Horario</h3>
            <div className="mt-4">
              <OpeningHours hours={openingHours} />
            </div>

            <h3 className={`${label} mt-8`}>Ubicación</h3>
            <div className="mt-4 text-sm">
              {address ? (
                <address className="not-italic">
                  <p>{address.line1}</p>
                  <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
                </address>
              ) : (
                <Todo>ubicación pendiente del cliente</Todo>
              )}
            </div>

            <ButtonLink href="/contacto" className="mt-8">
              Contacto
            </ButtonLink>
          </div>
        </Container>
      </div>
    </ScrollScene>
  );
}
