import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { listRunIds, loadRunDetail } from "@/data/run-detail-data";

export async function generateStaticParams() {
  return (await listRunIds()).map((runId) => ({ runId }));
}
export async function generateMetadata({
  params,
}: PageProps<"/runs/[runId]">): Promise<Metadata> {
  const detail = await loadRunDetail((await params).runId);
  return {
    title: detail
      ? `${detail.suite.name} run — PhaseBench`
      : "Run not found — PhaseBench",
    description: detail
      ? `Evidence for ${detail.model.name} on ${detail.suite.name}.`
      : undefined,
  };
}

export default async function RunDetailPage({
  params,
}: PageProps<"/runs/[runId]">) {
  const detail = await loadRunDetail((await params).runId);
  if (!detail) notFound();
  const { run, suite, model, cases, totals } = detail;
  return (
    <Container className="py-section">
      <Link
        href="/runs"
        className="text-label font-semibold text-accent hover:underline"
      >
        ← Back to runs
      </Link>
      <p className="text-label mt-8 font-mono font-semibold tracking-[0.16em] text-accent uppercase">
        Run evidence
      </p>
      <h1 className="text-display mt-3 font-semibold text-balance">
        {suite.name}
      </h1>
      <p className="text-body-lg mt-4 text-text-muted">
        {model.name} · {run.startedAt.replace("T", " ").slice(0, 19)} UTC ·{" "}
        {run.status}
      </p>
      <p className="text-label mt-3 text-text-muted">
        Synthetic benchmark data · Run ID: {run.id}
      </p>
      <section
        className="mt-10 grid gap-4 lg:grid-cols-2"
        aria-label="Run configuration and totals"
      >
        <Card as="section" className="p-5">
          <h2 className="text-heading font-semibold">Configuration</h2>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <Metric label="Runner" value={run.configuration.runnerVersion} />
            <Metric label="Prompt" value={run.configuration.promptVersion} />
            <Metric
              label="Temperature"
              value={String(run.configuration.modelConfiguration.temperature)}
            />
            <Metric
              label="Max output"
              value={`${run.configuration.modelConfiguration.maxOutputTokens.toLocaleString("en-US")} tokens`}
            />
          </dl>
        </Card>
        <Card as="section" className="p-5">
          <h2 className="text-heading font-semibold">Totals</h2>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <Metric label="Cost" value={`$${totals.costUsd.toFixed(4)}`} />
            <Metric
              label="Latency"
              value={`${(totals.latencyMs / 1000).toFixed(1)} s`}
            />
            <Metric
              label="Input"
              value={`${totals.inputTokens.toLocaleString("en-US")} tokens`}
            />
            <Metric
              label="Output"
              value={`${totals.outputTokens.toLocaleString("en-US")} tokens`}
            />
          </dl>
        </Card>
      </section>
      <section className="mt-10" aria-labelledby="case-evidence">
        <h2 id="case-evidence" className="text-heading font-semibold">
          Case evidence
        </h2>
        <div className="mt-5 grid gap-4">
          {cases.map(({ benchmarkCase, result }) => (
            <Card as="article" className="p-5" key={result.caseId}>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div>
                  <h3 className="font-semibold">{benchmarkCase.name}</h3>
                  <p className="text-label mt-1 text-text-muted">
                    {benchmarkCase.evaluationMethod} ·{" "}
                    {benchmarkCase.benchmarkSet} set
                  </p>
                </div>
                <span className="text-label font-semibold uppercase">
                  {result.status}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric
                  label="Quality"
                  value={`${result.qualityScore.toFixed(1)}/100`}
                />
                <Metric
                  label="Attempts"
                  value={`${result.attemptCount}/${benchmarkCase.maxAttempts}`}
                />
                <Metric
                  label="Automated tests"
                  value={`${result.automatedTestsPassed}/${result.automatedTestsTotal}`}
                />
                <Metric
                  label="AI judge"
                  value={
                    result.judgeScore === undefined
                      ? "Not used"
                      : `${result.judgeScore.toFixed(1)}/100`
                  }
                />
                <Metric label="Cost" value={`$${result.costUsd.toFixed(4)}`} />
                <Metric label="Latency" value={`${result.latencyMs} ms`} />
                <Metric label="Input" value={`${result.inputTokens} tokens`} />
                <Metric
                  label="Output"
                  value={`${result.outputTokens} tokens`}
                />
              </dl>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className="mt-1 break-words font-mono font-semibold">{value}</dd>
    </div>
  );
}
