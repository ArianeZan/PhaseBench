import { Card } from "@/components/ui/card";
import type { DashboardStackPhase } from "@/data/dashboard-data";
import type { RecommendedStack } from "@/domain/recommendations";

type RecommendedStackProps = Readonly<{
  stack: RecommendedStack;
  phases: readonly DashboardStackPhase[];
}>;

export function RecommendedStackView({ stack, phases }: RecommendedStackProps) {
  return (
    <Card as="section" className="p-5 sm:p-7" aria-labelledby="stack-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
            Recommended workflow
          </p>
          <h2 id="stack-heading" className="text-heading mt-1 font-semibold">
            One model for every phase
          </h2>
        </div>
        <p className="text-label text-text-muted">Debate → Plan → Build</p>
      </div>

      <ol className="mt-6 grid gap-3 lg:grid-cols-3">
        {phases.map(({ phase, model, provider, estimate }, index) => (
          <li
            key={phase.id}
            className="rounded-card border border-border bg-surface-muted p-4"
          >
            <p className="text-label font-mono text-text-muted uppercase">
              {index + 1}. {phase.name}
            </p>
            <p className="text-body-lg mt-2 font-semibold">{model.name}</p>
            <p className="text-label text-text-muted">{provider.name}</p>
            <dl className="text-label mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-text-muted">Cost</dt>
                <dd className="mt-1 font-mono">
                  ${estimate.estimatedCostUsd.toFixed(3)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Duration</dt>
                <dd className="mt-1 font-mono">
                  {formatDuration(estimate.estimatedDurationMs)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      {stack.status === "complete" ? (
        <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-4">
          <StackTotal
            label="Total cost"
            value={`$${stack.totals.estimatedCostUsd.toFixed(3)}`}
          />
          <StackTotal
            label="Total duration"
            value={formatDuration(stack.totals.estimatedDurationMs)}
          />
          <StackTotal
            label="Input tokens"
            value={formatTokens(stack.totals.estimatedInputTokens)}
          />
          <StackTotal
            label="Output tokens"
            value={formatTokens(stack.totals.estimatedOutputTokens)}
          />
        </dl>
      ) : (
        <p className="text-body mt-5 border-t border-border pt-5 text-warning">
          A complete estimate is unavailable because data is missing for:{" "}
          {stack.missingPhaseIds.join(", ")}.
        </p>
      )}

      <p className="text-label mt-5 text-text-muted">
        Estimate assumes one task per phase. Token totals use the standard
        PhaseBench workload; cost and duration use today&apos;s benchmark
        metrics.
      </p>
    </Card>
  );
}

function StackTotal({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className="text-body-lg mt-1 font-mono font-semibold">{value}</dd>
    </div>
  );
}

function formatDuration(milliseconds: number): string {
  return `${(milliseconds / 1000).toFixed(1)} s`;
}

function formatTokens(tokens: number): string {
  return tokens.toLocaleString("en-US");
}
