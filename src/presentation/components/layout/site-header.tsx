import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/presentation/components/brand/logo";
import { Container } from "@/presentation/components/ui/container";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" aria-label="Tierra Coffee, inicio">
          <Logo variant="secundario" width={120} priority />
        </Link>
        <nav aria-label="Principal">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
