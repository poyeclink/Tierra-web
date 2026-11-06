import Link from "next/link";
import { Logo } from "@/presentation/components/brand/logo";
import { Container } from "@/presentation/components/ui/container";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      {/* Blur lives on a background layer: backdrop-filter on the header itself
          would trap the fixed mobile menu inside it. */}
      <div aria-hidden className="absolute inset-0 -z-10 border-b border-line bg-canvas/85 backdrop-blur-md" />
      <Container size="wide" className="flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Tierra Coffee, inicio" className="shrink-0">
          <Logo variant="secundario" width={110} priority />
        </Link>
        <SiteNav />
      </Container>
    </header>
  );
}
