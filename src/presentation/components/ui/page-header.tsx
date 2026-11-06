import { Container } from "./container";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b border-line py-16 sm:py-20">
      <Container>
        <h1>{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-ink-muted">{description}</p>}
      </Container>
    </header>
  );
}
