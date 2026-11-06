import type { Metadata } from "next";
import { Container } from "@/presentation/components/ui/container";
import { PageHeader } from "@/presentation/components/ui/page-header";
import { getEstablishment } from "@/presentation/data/establishment";

export const metadata: Metadata = {
  title: "Nosotros",
};

export default async function AboutPage() {
  const { name, description, mission, vision, principles, sisterBrand } = await getEstablishment();

  return (
    <>
      <PageHeader title="Nosotros" description={description} />
      <Container className="space-y-20 py-16">
        <div className="grid gap-12 sm:grid-cols-2">
          <section>
            <h2>Misión</h2>
            <p className="mt-4 text-ink-muted">{mission}</p>
          </section>
          <section>
            <h2>Visión</h2>
            <p className="mt-4 text-ink-muted">{vision}</p>
          </section>
        </div>

        <section>
          <h2>Principios</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <li key={principle.title} className="border-t-2 border-aqua pt-4">
                <h3 className="font-medium">{principle.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{principle.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {sisterBrand && (
          <p className="text-sm text-ink-muted">
            {name} nace del ADN de{" "}
            {sisterBrand.url ? (
              <a href={sisterBrand.url} className="underline underline-offset-4">
                {sisterBrand.name}
              </a>
            ) : (
              sisterBrand.name
            )}
            .
          </p>
        )}
      </Container>
    </>
  );
}
