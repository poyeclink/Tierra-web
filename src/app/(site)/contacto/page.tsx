import type { Metadata } from "next";
import { OpeningHours } from "@/presentation/components/establishment/opening-hours";
import { Container } from "@/presentation/components/ui/container";
import { PageHeader } from "@/presentation/components/ui/page-header";
import { Todo } from "@/presentation/components/ui/todo";
import { getEstablishment } from "@/presentation/data/establishment";

export const metadata: Metadata = {
  title: "Contacto",
};

export default async function ContactPage() {
  const { address, contact, openingHours, social } = await getEstablishment();
  const socialLinks = Object.entries(social ?? {}).filter(([, url]) => Boolean(url));

  return (
    <>
      <PageHeader title="Contacto" />
      <Container className="grid gap-12 py-16 sm:grid-cols-2">
        <section>
          <h2>Ubicación</h2>
          <div className="mt-6 text-sm">
            {address ? (
              <address className="space-y-1 not-italic text-ink-muted">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
                {address.mapUrl && (
                  <a href={address.mapUrl} className="inline-block pt-2 underline underline-offset-4">
                    Ver en el mapa
                  </a>
                )}
              </address>
            ) : (
              <Todo>dirección pendiente del cliente</Todo>
            )}
          </div>

          <h2 className="mt-12">Contacto</h2>
          <div className="mt-6 text-sm">
            {contact?.phone || contact?.email || socialLinks.length > 0 ? (
              <ul className="space-y-1">
                {contact?.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                  </li>
                )}
                {contact?.email && (
                  <li>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {socialLinks.map(([network, url]) => (
                  <li key={network} className="capitalize">
                    <a href={url}>{network}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <Todo>teléfono, email y redes pendientes del cliente</Todo>
            )}
          </div>
        </section>

        <section>
          <h2>Horario</h2>
          <div className="mt-6">
            <OpeningHours hours={openingHours} />
          </div>
        </section>
      </Container>
    </>
  );
}
