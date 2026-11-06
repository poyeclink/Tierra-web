import type { Establishment } from "@/core/establishment/domain/establishment";
import { Logo } from "@/presentation/components/brand/logo";
import { Container } from "@/presentation/components/ui/container";
import { Todo } from "@/presentation/components/ui/todo";

export function SiteFooter({ establishment }: { establishment: Establishment }) {
  const { address, contact } = establishment;
  return (
    <footer className="mt-auto border-t border-line bg-tint py-12 text-sm text-ink-muted">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Logo variant="isotipo" color="aqua" width={76} />
          <p className="font-medium">Grounded by Tierra. Fueled by Sunrise.</p>
        </div>
        <address className="space-y-1 not-italic">
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
      </Container>
    </footer>
  );
}
