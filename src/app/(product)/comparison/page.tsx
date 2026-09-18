import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { ComparisonTable } from "@/components/comparison-table";
import { PrioritySelector } from "@/components/priority-selector";
import { loadComparisonData } from "@/data/comparison-data";
import { resolveRecommendationPriority } from "@/domain/priorities";

export const metadata: Metadata = {
  title: "Model comparison — PhaseBench",
  description: "Compare AI model performance across development phases.",
};

export default async function ComparisonPage({
  searchParams,
}: PageProps<"/comparison">) {
  const requestedPriority = (await searchParams).priority;
  const priority = resolveRecommendationPriority(
    Array.isArray(requestedPriority) ? requestedPriority[0] : requestedPriority,
  );
  const comparison = await loadComparisonData(priority);
  return (
    <Container className="py-section">
      <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
        Model intelligence
      </p>
      <section className="mt-10" aria-labelledby="comparison-priority">
        <h2 id="comparison-priority" className="text-heading font-semibold">
          Choose how models are ranked
        </h2>
        <div className="mt-4">
          <PrioritySelector
            selectedPriority={priority}
            pathname="/comparison"
          />
        </div>
      </section>
      <section className="mt-10" aria-labelledby="comparison-table-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="comparison-table-heading"
              className="text-heading font-semibold"
            >
              All models by phase
            </h2>
            <p className="text-body mt-2 text-text-muted">
              Winners and scores use the {priority} recommendation profile.
            </p>
          </div>
          <p className="text-label text-text-muted">
            Synthetic benchmark data · {comparison.date}
          </p>
        </div>
        <ComparisonTable rows={comparison.rows} />
      </section>
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
