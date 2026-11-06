import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Establishment } from "@/core/establishment/domain/establishment";
import { Logo } from "@/presentation/components/brand/logo";
import { Container } from "@/presentation/components/ui/container";
import { Todo } from "@/presentation/components/ui/todo";

const headingClass = "text-xs font-medium tracking-[0.28em] text-crimson uppercase";

export function SiteFooter({ establishment }: { establishment: Establishment }) {
  const { name, address, contact } = establishment;
  return (
    <footer className="mt-auto bg-tint text-sm">
      <Container size="wide" className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <Logo variant="principal" width={110} />
          <p className="max-w-xs text-ink-muted">Grounded by Tierra. Fueled by Sunrise.</p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className={headingClass}>Explora</h2>
          <ul className="mt-5 space-y-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Visítanos</h2>
          <address className="mt-5 space-y-2 text-ink-muted not-italic">
            {address ? (
              <>
                <p>{address.line1}</p>
                <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
              </>
            ) : (
              <Todo>dirección</Todo>
            )}
            {contact?.phone && <p>{contact.phone}</p>}
            {contact?.email && <p>{contact.email}</p>}
          </address>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container size="wide" className="flex flex-col gap-2 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>{name}</p>
          <p>Café japonés-latino</p>
        </Container>
      </div>
    </footer>
  );
}
