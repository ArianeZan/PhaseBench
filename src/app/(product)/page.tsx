import { PrioritySelector } from "@/components/priority-selector";
import { RecommendationCard } from "@/components/recommendation-card";
import { RecommendedStackView } from "@/components/recommended-stack";
import { Container } from "@/components/ui/container";
import { resolveRecommendationPriority } from "@/domain/priorities";
import { loadDashboardData } from "@/data/dashboard-data";

export default async function Home({ searchParams }: PageProps<"/">) {
  const requestedPriority = (await searchParams).priority;
  const selectedPriority = resolveRecommendationPriority(
    Array.isArray(requestedPriority) ? requestedPriority[0] : requestedPriority,
  );
  const dashboard = await loadDashboardData(selectedPriority);

  return (
    <Container className="py-section flex min-h-[calc(100vh-10rem)] flex-col justify-center">
      <section aria-labelledby="hero-title" className="max-w-4xl">
        <p className="text-label mb-5 font-mono font-semibold tracking-[0.22em] text-accent uppercase">
          AI model intelligence for software teams
        </p>
        <h1
          id="hero-title"
          className="text-display max-w-3xl font-semibold text-balance"
        >
          The right AI model for every phase.
        </h1>
        <p className="text-body-lg mt-7 max-w-2xl text-text-muted">
          PhaseBench turns reproducible benchmarks into daily recommendations
          for every stage of AI-assisted development.
        </p>
      </section>

      <section aria-labelledby="priority-heading" className="mt-12">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label font-mono font-semibold tracking-[0.16em] text-text-muted uppercase">
              Recommendation mode
            </p>
            <h2
              id="priority-heading"
              className="text-heading mt-1 font-semibold"
            >
              What matters most today?
            </h2>
          </div>
          <p className="text-label text-text-muted">Saved in the page URL</p>
        </div>
        <PrioritySelector selectedPriority={selectedPriority} />
        <p className="text-label mt-4 text-text-muted" role="status">
          Updated {dashboard.date} · {dashboard.recommendations.length} phase
          recommendations ·{" "}
          {dashboard.stack.status === "complete"
            ? "Complete workflow"
            : "Incomplete workflow"}
        </p>
      </section>

      <section
        aria-labelledby="recommendations-heading"
        className="mt-14 sm:mt-20"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
              Daily recommendations
            </p>
            <h2
              id="recommendations-heading"
              className="text-heading mt-1 font-semibold"
            >
              The strongest model for each phase
            </h2>
          </div>
          <p className="text-label text-text-muted">
            Synthetic benchmark data · {dashboard.date}
          </p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {dashboard.recommendationViews.map((view) => (
            <RecommendationCard key={view.phase.id} view={view} />
          ))}
        </div>
      </section>

      <div className="mt-6">
        <RecommendedStackView
          phases={dashboard.stackViews}
          stack={dashboard.stack}
        />
      </div>
    </Container>
  );
}
