import type {
  BenchmarkJourneyPlan,
  BenchmarkJourneyResult,
  BenchmarkJourneyStageResult,
} from "./benchmark-journey";
import { validateBenchmarkJourney } from "./benchmark-journey";
import type { ModelExecutor } from "./provider-execution";
import type { PhaseId } from "./phases";

export type BenchmarkCaseEvaluation = Readonly<{
  passed: boolean;
  diagnostic?: string;
}>;
export type BenchmarkRunnerDependencies = Readonly<{
  executor: ModelExecutor;
  evaluate: (
    caseVersion: string,
    content: string,
  ) => Promise<BenchmarkCaseEvaluation>;
  persist: (result: BenchmarkJourneyResult) => Promise<void>;
}>;

export async function runBenchmarkJourney(
  plan: BenchmarkJourneyPlan,
  phaseId: PhaseId,
  dependencies: BenchmarkRunnerDependencies,
  signal?: AbortSignal,
): Promise<BenchmarkJourneyResult> {
  validateBenchmarkJourney(plan);
  const startedAt = new Date().toISOString();
  const stages: BenchmarkJourneyStageResult[] = [
    { stage: "load", status: "completed", startedAt, completedAt: startedAt },
  ];
  if (signal?.aborted)
    return finish(
      {
        status: "cancelled",
        stages: [...stages, stage("execute", "cancelled", startedAt)],
      },
      dependencies,
    );
  let spent = 0;
  for (const benchmarkCase of plan.cases) {
    if (signal?.aborted)
      return finish(
        {
          status: "cancelled",
          stages: [...stages, stage("execute", "cancelled", startedAt)],
        },
        dependencies,
      );
    const response = await dependencies.executor.execute({
      modelId: plan.modelId,
      phaseId,
      messages: [{ role: "user", content: benchmarkCase.caseVersion }],
      configuration: { temperature: 0, maxOutputTokens: 1_000 },
      timeoutMs: plan.budgets.maxDurationMs,
      signal,
    });
    spent += response.usage.costUsd;
    if (response.finishReason === "cancelled")
      return finish(
        {
          status: "cancelled",
          stages: [...stages, stage("execute", "cancelled", startedAt)],
        },
        dependencies,
      );
    if (spent > plan.budgets.maxCostUsd)
      return finish(
        {
          status: "partial",
          stages: [
            ...stages,
            stage("execute", "partial", startedAt, "Cost budget exceeded"),
          ],
        },
        dependencies,
      );
    const evaluation = await dependencies.evaluate(
      benchmarkCase.caseVersion,
      response.content,
    );
    if (!evaluation.passed)
      return finish(
        {
          status: "partial",
          stages: [
            ...stages,
            stage("execute", "completed", startedAt),
            stage("evaluate", "partial", startedAt, evaluation.diagnostic),
            stage("persist", "completed", startedAt),
          ],
        },
        dependencies,
      );
  }
  return finish(
    {
      status: "completed",
      stages: [
        ...stages,
        stage("execute", "completed", startedAt),
        stage("evaluate", "completed", startedAt),
        stage("persist", "completed", startedAt),
      ],
    },
    dependencies,
  );
}

async function finish(
  result: BenchmarkJourneyResult,
  dependencies: BenchmarkRunnerDependencies,
) {
  await dependencies.persist(result);
  return result;
}
function stage(
  stageName: "execute" | "evaluate" | "persist",
  status: "completed" | "partial" | "cancelled",
  startedAt: string,
  diagnostic?: string,
): BenchmarkJourneyStageResult {
  return {
    stage: stageName,
    status,
    startedAt,
    completedAt: new Date().toISOString(),
    ...(diagnostic ? { diagnostic } : {}),
  };
}
