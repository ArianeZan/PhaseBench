"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function ProductError({
  retry,
}: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold text-danger uppercase">
        Unable to load data
      </p>
      <h1 className="text-display mt-4 font-semibold">
        PhaseBench hit an unexpected problem.
      </h1>
      <p className="text-body-lg mt-5 max-w-2xl text-text-muted">
        Your selection is safe. Try loading this screen again or return to the
        dashboard.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-control bg-accent px-5 py-3 font-semibold text-accent-foreground"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-control border border-border bg-surface px-5 py-3 font-semibold"
        >
          Return to dashboard
        </Link>
      </div>
    </Container>
  );
}
