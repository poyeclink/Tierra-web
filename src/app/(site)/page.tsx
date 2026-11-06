import Link from "next/link";
import { Logo } from "@/presentation/components/brand/logo";
import { OpeningHours } from "@/presentation/components/establishment/opening-hours";
import { Container } from "@/presentation/components/ui/container";
import { Todo } from "@/presentation/components/ui/todo";
import { getEstablishment } from "@/presentation/data/establishment";

export default async function HomePage() {
  const { name, tagline, description, address, openingHours } = await getEstablishment();

  return (
    <>
      <section className="border-b border-line py-20 sm:py-28">
        <Container className="flex flex-col items-start gap-8">
          <Logo width={180} priority />
          <h1 className="sr-only">{name}</h1>
          <p className="text-sm font-medium uppercase tracking-widest text-ink-muted">
            {tagline ?? <Todo>tagline por confirmar</Todo>}
          </p>
          <p className="max-w-xl text-lg">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu" className="rounded-full bg-crimson px-6 py-2.5 text-sm font-medium text-on-crimson">
              Ver menú
            </Link>
            <Link
              href="/nosotros"
              className="rounded-full border border-aqua px-6 py-2.5 text-sm font-medium transition-colors hover:bg-tint"
            >
              Conócenos
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2>Horario</h2>
            <div className="mt-6">
              <OpeningHours hours={openingHours} />
            </div>
          </div>
          <div>
            <h2>Visítanos</h2>
            <div className="mt-6 text-sm">
              {address ? (
                <address className="not-italic text-ink-muted">
                  <p>{address.line1}</p>
                  <p>{address.city}</p>
                </address>
              ) : (
                <Todo>ubicación pendiente del cliente</Todo>
              )}
            </div>
            <Link href="/contacto" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
              Contacto
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
