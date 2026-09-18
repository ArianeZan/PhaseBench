import type { DashboardRecommendation } from "@/data/dashboard-data";
import { ProviderBadge } from "@/components/provider-badge";
import { Card } from "@/components/ui/card";

type RecommendationCardProps = Readonly<{
  view: DashboardRecommendation;
}>;

export function RecommendationCard({ view }: RecommendationCardProps) {
  const { metrics } = view.summary;

  return (
    <Card as="article" className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label font-mono font-semibold tracking-[0.14em] text-accent uppercase">
            {view.phase.name}
          </p>
          <h3 className="text-heading mt-2 font-semibold">{view.model.name}</h3>
        </div>
        <div className="text-right">
          <span className="text-label block text-text-muted">Score</span>
          <strong className="text-heading">
            {view.recommendation.winner.score.toFixed(1)}
          </strong>
          <RecommendationChange change={view.change} />
        </div>
      </div>

      <div className="mt-4">
        <ProviderBadge provider={view.provider} />
      </div>

      <ul className="text-body mt-6 space-y-2 text-text-muted">
        {view.recommendation.reasons.map((reason) => (
          <li className="flex gap-2" key={reason.metric}>
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
            />
            <span>{reason.message}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
        <Metric label="Quality" value={formatScore(metrics.qualityScore)} />
        <Metric label="Stability" value={formatScore(metrics.stabilityScore)} />
        <Metric label="Cost / task" value={formatCost(metrics.costUsd)} />
        <Metric label="Latency" value={formatLatency(metrics.latencyMs)} />
      </dl>
    </Card>
  );
}

function RecommendationChange({
  change,
}: Readonly<{ change: DashboardRecommendation["change"] }>) {
  if (change.status === "unavailable") {
    return (
      <span className="text-label mt-1 block text-text-muted">
        No previous-day comparison
      </span>
    );
  }

  const direction =
    change.scoreDelta > 0 ? "Up" : change.scoreDelta < 0 ? "Down" : "Unchanged";
  const signedScore =
    change.scoreDelta > 0
      ? `+${change.scoreDelta.toFixed(1)}`
      : change.scoreDelta.toFixed(1);
  const rankText =
    change.rankDelta > 0
      ? `up ${change.rankDelta} rank`
      : change.rankDelta < 0
        ? `down ${Math.abs(change.rankDelta)} rank`
        : "same rank";

  return (
    <span className="text-label mt-1 block text-text-muted">
      {direction} {signedScore} points · {rankText}
    </span>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className="text-body mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function formatScore(value: number | null): string {
  return value === null ? "Not available" : `${value.toFixed(1)} / 100`;
}

function formatCost(value: number | null): string {
  return value === null ? "Not available" : `$${value.toFixed(3)}`;
}

function formatLatency(value: number | null): string {
  return value === null
    ? "Not available"
    : `${Math.round(value).toLocaleString("en-US")} ms`;
}
