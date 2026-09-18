import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProviderBadge } from "@/components/provider-badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  listModelIds,
  loadModelIdentity,
  loadModelProfile,
} from "@/data/model-detail-data";

export async function generateStaticParams() {
  return (await listModelIds()).map((modelId) => ({ modelId }));
}

export async function generateMetadata({
  params,
}: PageProps<"/models/[modelId]">): Promise<Metadata> {
  const identity = await loadModelIdentity((await params).modelId);
  if (!identity) return { title: "Model not found — PhaseBench" };
  return {
    title: `${identity.model.name} — PhaseBench`,
    description: `PhaseBench performance profile for ${identity.model.name} by ${identity.provider.name}.`,
  };
}

export default async function ModelPage({
  params,
}: PageProps<"/models/[modelId]">) {
  const profile = await loadModelProfile((await params).modelId);
  if (!profile) notFound();
  return (
    <Container className="py-section">
      <Link
        href="/comparison"
        className="text-label font-semibold text-accent hover:underline"
      >
        ← Back to comparison
      </Link>
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
            Model profile
          </p>
          <h1 className="text-display mt-3 font-semibold text-balance">
            {profile.model.name}
          </h1>
          <p className="text-body-lg mt-4 text-text-muted">
            Version {profile.model.version} · {profile.model.status}
          </p>
        </div>
        <ProviderBadge provider={profile.provider} />
      </div>
      <p className="text-label mt-8 text-text-muted">
        Updated {profile.updatedOn} · Synthetic benchmark data
      </p>
      <section className="mt-10" aria-labelledby="phase-profile">
        <h2 id="phase-profile" className="text-heading font-semibold">
          Performance by phase
        </h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {profile.phases.map(
            ({ phase, summary, balancedRank, qualityChange }) => (
              <Card as="article" className="p-5" key={phase.id}>
                <p className="text-label font-mono text-accent uppercase">
                  {phase.name}
                </p>
                <p className="text-heading mt-2 font-semibold">
                  {balancedRank ? `#${balancedRank} balanced` : "Not ranked"}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-label">
                  <Metric
                    label="Quality"
                    value={format(summary.metrics.qualityScore, "/100")}
                  />
                  <Metric
                    label="30-day change"
                    value={
                      qualityChange === null
                        ? "No data"
                        : `${qualityChange >= 0 ? "+" : ""}${qualityChange.toFixed(1)}`
                    }
                  />
                  <Metric
                    label="Cost / task"
                    value={format(summary.metrics.costUsd, "", "$", 4)}
                  />
                  <Metric
                    label="Latency"
                    value={format(summary.metrics.latencyMs, " ms", "", 0)}
                  />
                  <Metric
                    label="Pass rate"
                    value={format(summary.metrics.taskPassRate, "%")}
                  />
                  <Metric
                    label="Stability"
                    value={format(summary.metrics.stabilityScore, "/100")}
                  />
                </dl>
              </Card>
            ),
          )}
        </div>
      </section>
      <section className="mt-10" aria-labelledby="recent-runs">
        <h2 id="recent-runs" className="text-heading font-semibold">
          Recent benchmark runs
        </h2>
        {profile.recentRuns.length ? (
          <div className="mt-5 grid gap-3">
            {profile.recentRuns.map(
              ({
                run,
                suite,
                averageQuality,
                totalCostUsd,
                totalDurationMs,
              }) => (
                <Card
                  as="article"
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  key={run.id}
                >
                  <div>
                    <p className="font-semibold">{suite.name}</p>
                    <p className="text-label mt-1 text-text-muted">
                      {run.startedAt.slice(0, 10)} · {run.status}
                    </p>
                  </div>
                  <p className="text-label font-mono">
                    Quality{" "}
                    {averageQuality === null
                      ? "No data"
                      : averageQuality.toFixed(1)}{" "}
                    · ${totalCostUsd.toFixed(4)} ·{" "}
                    {(totalDurationMs / 1000).toFixed(1)} s
                  </p>
                </Card>
              ),
            )}
          </div>
        ) : (
          <p className="text-body mt-4 text-text-muted">
            No recent runs are available for this model.
          </p>
        )}
      </section>
    </Container>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-text-muted">{label}</dt>
      <dd className="mt-1 font-mono font-semibold">{value}</dd>
    </div>
  );
}
function format(
  value: number | null,
  suffix: string,
  prefix = "",
  decimals = 1,
) {
  return value === null
    ? "No data"
    : `${prefix}${value.toFixed(decimals)}${suffix}`;
}
