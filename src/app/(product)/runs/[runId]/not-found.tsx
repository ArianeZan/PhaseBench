import Link from "next/link";
import { Container } from "@/components/ui/container";
export default function RunNotFound() {
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold text-accent uppercase">
        Run not found
      </p>
      <h1 className="text-display mt-4 font-semibold">
        That benchmark run is unavailable.
      </h1>
      <p className="text-body-lg mt-5 text-text-muted">
        The run ID may be incorrect or no longer present in the repository.
      </p>
      <Link
        href="/runs"
        className="mt-8 inline-block rounded-control bg-accent px-5 py-3 font-semibold text-accent-foreground"
      >
        View benchmark history
      </Link>
    </Container>
  );
}
