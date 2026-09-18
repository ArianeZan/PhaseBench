import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function ModelNotFound() {
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold text-accent uppercase">
        Model not found
      </p>
      <h1 className="text-display mt-4 font-semibold">
        That model is not in the catalog.
      </h1>
      <p className="text-body-lg mt-5 text-text-muted">
        It may have been removed or the address may be incorrect.
      </p>
      <Link
        href="/comparison"
        className="mt-8 inline-block rounded-control bg-accent px-5 py-3 font-semibold text-accent-foreground"
      >
        View model comparison
      </Link>
    </Container>
  );
}
