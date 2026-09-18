import { getBenchmarkRepository } from "./repository";
import type {
  BenchmarkCase,
  BenchmarkCaseResult,
  BenchmarkRun,
  BenchmarkRunId,
  BenchmarkSuite,
} from "@/domain/benchmarks";
import type { AiModel } from "@/domain/models";

export type RunCaseEvidence = Readonly<{
  benchmarkCase: BenchmarkCase;
  result: BenchmarkCaseResult;
}>;
export type RunDetailData = Readonly<{
  run: BenchmarkRun;
  suite: BenchmarkSuite;
  model: AiModel;
  cases: readonly RunCaseEvidence[];
  totals: Readonly<{
    costUsd: number;
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
  }>;
}>;

export async function loadRunDetail(
  runId: BenchmarkRunId,
): Promise<RunDetailData | null> {
  const repository = getBenchmarkRepository();
  const [run, catalog] = await Promise.all([
    repository.getBenchmarkRunById(runId),
    repository.getCatalog(),
  ]);
  if (!run) return null;
  const suite = catalog.suites.find((item) => item.id === run.suiteId);
  const model = catalog.models.find((item) => item.id === run.modelId);
  if (!suite || !model) return null;
  const cases = run.results.flatMap((result) => {
    const benchmarkCase = catalog.cases.find(
      (item) => item.id === result.caseId,
    );
    return benchmarkCase ? [{ benchmarkCase, result }] : [];
  });
  return {
    run,
    suite,
    model,
    cases,
    totals: {
      costUsd: sum(run.results.map((item) => item.costUsd)),
      latencyMs: sum(run.results.map((item) => item.latencyMs)),
      inputTokens: sum(run.results.map((item) => item.inputTokens)),
      outputTokens: sum(run.results.map((item) => item.outputTokens)),
    },
  };
}

export async function listRunIds(): Promise<readonly BenchmarkRunId[]> {
  return (await getBenchmarkRepository().getBenchmarkRuns()).map(
    (run) => run.id,
  );
}
function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
