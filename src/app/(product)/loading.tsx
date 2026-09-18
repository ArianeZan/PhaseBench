import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function ProductLoading() {
  return (
    <Container className="py-section" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading PhaseBench data</span>
      <div className="h-4 w-40 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="mt-5 h-16 max-w-2xl animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="min-h-52 animate-pulse bg-surface-muted motion-reduce:animate-none"
          />
        ))}
      </div>
    </Container>
  );
}
