import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { loadRunHistory, runStatuses } from "@/data/run-history-data";
import type { BenchmarkRunStatus } from "@/domain/benchmarks";
import { developmentPhases, phaseIds, type PhaseId } from "@/domain/phases";

export const metadata: Metadata = {
  title: "Benchmark runs — PhaseBench",
  description: "Review PhaseBench benchmark execution history and evidence.",
};

export default async function RunsPage({ searchParams }: PageProps<"/runs">) {
  const params = await searchParams;
  const phaseId =
    typeof params.phase === "string" &&
    phaseIds.includes(params.phase as PhaseId)
      ? (params.phase as PhaseId)
      : undefined;
  const modelId = typeof params.model === "string" ? params.model : undefined;
  const status =
    typeof params.status === "string" &&
    runStatuses.includes(params.status as BenchmarkRunStatus)
      ? (params.status as BenchmarkRunStatus)
      : undefined;
  const data = await loadRunHistory({ phaseId, modelId, status });
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
      <form
        action="/runs"
        className="mt-10 grid gap-4 rounded-card border border-border bg-surface-muted p-4 sm:grid-cols-3"
      >
        <Select label="Phase" name="phase" value={phaseId ?? ""}>
          <option value="">All phases</option>
          {developmentPhases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.name}
            </option>
          ))}
        </Select>
        <Select label="Model" name="model" value={modelId ?? ""}>
          <option value="">All models</option>
          {data.models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
        <Select label="Status" name="status" value={status ?? ""}>
          <option value="">All statuses</option>
          {runStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <button
          type="submit"
          className="rounded-control bg-accent px-4 py-3 font-semibold text-accent-foreground sm:col-span-3"
        >
          Apply filters
        </button>
      </form>
      <section className="mt-10" aria-labelledby="run-list-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="run-list-heading" className="text-heading font-semibold">
            Benchmark activity
          </h2>
          <p className="text-label text-text-muted">
            {data.items.length} runs · Synthetic data
          </p>
        </div>
        {data.items.length ? (
          <div className="mt-5 grid gap-4">
            {data.items.map((item) => (
              <Card as="article" className="p-5" key={item.run.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-label font-mono text-accent uppercase">
                      {item.suite.name}
                    </p>
                    <h3 className="text-body-lg mt-2 font-semibold">
                      <Link
                        href={`/runs/${item.run.id}`}
                        className="hover:text-accent hover:underline"
                      >
                        {item.model.name}
                      </Link>
                    </h3>
                    <p className="text-label mt-1 text-text-muted">
                      {item.run.startedAt.replace("T", " ").slice(0, 16)} UTC ·{" "}
                      {item.run.status}
                    </p>
                  </div>
                  <span className="text-label rounded-control border border-border px-3 py-2">
                    {item.suite.phaseId}
                  </span>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Metric
                    label="Quality"
                    value={
                      item.quality === null
                        ? "No data"
                        : `${item.quality.toFixed(1)}/100`
                    }
                  />
                  <Metric label="Cost" value={`$${item.costUsd.toFixed(4)}`} />
                  <Metric
                    label="Duration"
                    value={`${(item.durationMs / 1000).toFixed(1)} s`}
                  />
                </dl>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-5 p-6">
            <p className="text-body text-text-muted">
              No benchmark runs match these filters.
            </p>
          </Card>
        )}
      </section>
    </Container>
  );
}

function Select({
  label,
  name,
  value,
  children,
}: Readonly<{
  label: string;
  name: string;
  value: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="text-label font-semibold">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3 py-3 text-foreground"
      >
        {children}
      </select>
    </label>
  );
}
function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className="mt-1 font-mono font-semibold">{value}</dd>
    </div>
  );
}
