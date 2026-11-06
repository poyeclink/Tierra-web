import { ButtonLink } from "@/presentation/components/ui/button-link";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { heroContent } from "@/presentation/content/home";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container
        size="wide"
        className="grid min-h-[calc(100svh-5rem)] items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
      >
        <div className="max-w-2xl">
          <div className="animate-rise">
            <Eyebrow>{heroContent.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-7 animate-rise text-[clamp(3rem,6.4vw,5.5rem)] leading-[1.02] tracking-[-0.035em] text-balance [animation-delay:100ms]">
            {heroContent.titleStart} <span className="text-aqua">{heroContent.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-lg animate-rise text-lg leading-relaxed text-ink-muted [animation-delay:200ms] sm:text-xl">
            {heroContent.lead}
          </p>
          <div className="mt-10 flex animate-rise flex-wrap items-center gap-4 [animation-delay:300ms]">
            <ButtonLink href="/menu">Ver menú</ButtonLink>
            <ButtonLink href="/nosotros" variant="ghost">
              Nuestra historia
            </ButtonLink>
          </div>
        </div>

        <HeroVisual />
      </Container>

      <a
        href="#frases"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-medium tracking-[0.3em] text-ink-muted uppercase [@media(min-height:760px)]:lg:flex"
      >
        Descubre
        <span aria-hidden className="block h-10 w-px animate-scroll-cue bg-aqua" />
      </a>
    </section>
  );
}
