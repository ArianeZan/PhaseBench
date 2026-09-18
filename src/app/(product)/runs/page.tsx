import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Benchmark runs — PhaseBench",
  description: "Review PhaseBench benchmark execution history and evidence.",
};

export default function RunsPage() {
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
        Benchmark evidence
      </p>
      <h1 className="text-display mt-4 font-semibold text-balance">Runs</h1>
      <p className="text-body-lg mt-6 max-w-2xl text-text-muted">
        Trace benchmark activity, execution outcomes, and the evidence behind
        every recommendation.
      </p>
    </Container>
  );
}
