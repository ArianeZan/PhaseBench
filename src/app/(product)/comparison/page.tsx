import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Model comparison — PhaseBench",
  description: "Compare AI model performance across development phases.",
};

export default function ComparisonPage() {
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
        Model intelligence
      </p>
      <h1 className="text-display mt-4 font-semibold text-balance">
        Comparison
      </h1>
      <p className="text-body-lg mt-6 max-w-2xl text-text-muted">
        Compare model strengths, trade-offs, and recommendation scores across
        every development phase.
      </p>
    </Container>
  );
}
