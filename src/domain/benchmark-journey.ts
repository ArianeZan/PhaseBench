import type { BenchmarkSet } from "./benchmarks";
import type { ModelId } from "./models";

export type BenchmarkJourneyStage = "load" | "execute" | "evaluate" | "persist";
export type BenchmarkJourneyStatus =
  "queued" | "running" | "completed" | "partial" | "failed" | "cancelled";

export type BenchmarkJourneyVersions = Readonly<{
  suiteVersion: string;
  modelVersion: string;
  runnerVersion: string;
  promptVersion: string;
  evaluatorVersion: string;
}>;

export type BenchmarkJourneyCase = Readonly<{
  caseVersion: string;
  benchmarkSet: BenchmarkSet;
}>;

export type BenchmarkJourneyBudgets = Readonly<{
  maxDurationMs: number;
  maxCostUsd: number;
  maxConcurrency: number;
  maxAttemptsPerCase: number;
  cancellationGraceMs: number;
}>;

export type BenchmarkJourneyPlan = Readonly<{
  modelId: ModelId;
  versions: BenchmarkJourneyVersions;
  cases: readonly BenchmarkJourneyCase[];
  budgets: BenchmarkJourneyBudgets;
}>;

export type BenchmarkJourneyStageResult = Readonly<{
  stage: BenchmarkJourneyStage;
  status: "completed" | "partial" | "failed" | "cancelled";
  startedAt: string;
  completedAt?: string;
  diagnostic?: string;
}>;

export type BenchmarkJourneyResult = Readonly<{
  status: BenchmarkJourneyStatus;
  stages: readonly BenchmarkJourneyStageResult[];
}>;

export function validateBenchmarkJourney(plan: BenchmarkJourneyPlan): void {
  const { budgets } = plan;
  if (plan.cases.length === 0)
    throw new Error("A benchmark journey requires at least one case");
  if (!plan.cases.some((item) => item.benchmarkSet === "fixed"))
    throw new Error("A benchmark journey requires a fixed case");
  if (
    budgets.maxDurationMs <= 0 ||
    budgets.maxCostUsd < 0 ||
    budgets.maxConcurrency <= 0 ||
    budgets.maxAttemptsPerCase <= 0 ||
    budgets.cancellationGraceMs < 0
  ) {
    throw new Error(
      "Benchmark journey budgets must be non-negative and bounded",
    );
  }
  if (
    new Set(plan.cases.map((item) => item.caseVersion)).size !==
    plan.cases.length
  )
    throw new Error("Benchmark journey cases must be unique");
}
