import Link from "next/link";
import { Container } from "@/presentation/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <h1>Página no encontrada</h1>
        <p className="mt-4 text-ink-muted">Esta página no existe. Volvamos al inicio.</p>
        <Link href="/" className="mt-8 inline-block font-medium underline underline-offset-4">
          Ir al inicio
        </Link>
      </Container>
    </main>
  );
}
