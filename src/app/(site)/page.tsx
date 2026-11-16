import { Hero } from "@/presentation/components/home/hero";
import { Jatina } from "@/presentation/components/home/jatina";
import { Offering } from "@/presentation/components/home/offering";
import { ManifestoSection, PrinciplesSection, VisitSection } from "@/presentation/components/home/sections";
import { RitualSequence } from "@/presentation/components/home/ritual-sequence";
import { RitualGallery } from "@/presentation/components/home/ritual-gallery";
import { StatementsMarquee } from "@/presentation/components/home/statements-marquee";
import { getEstablishment } from "@/presentation/data/establishment";

export default async function HomePage() {
  const establishment = await getEstablishment();

  return (
    <>
      <Hero />
      <RitualSequence />
      <StatementsMarquee />
      <Jatina />
      <Offering />
      <PrinciplesSection principles={establishment.principles} />
      <ManifestoSection />
      <RitualGallery />
      <VisitSection establishment={establishment} />
    </>
  );
}
