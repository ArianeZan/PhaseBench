import type { ModelId } from "./models";
import type { PhaseId } from "./phases";

export type BenchmarkSuiteId = string;
export type BenchmarkCaseId = string;
export type BenchmarkRunId = string;

export type BenchmarkSet = "fixed" | "hidden";
export type EvaluationMethod = "automated-tests" | "ai-judge" | "hybrid";
export type BenchmarkRunStatus =
  "queued" | "running" | "completed" | "failed" | "cancelled";
export type BenchmarkCaseStatus = "passed" | "failed" | "error";

export type BenchmarkSuite = Readonly<{
  id: BenchmarkSuiteId;
  phaseId: PhaseId;
  name: string;
  description: string;
  version: string;
  caseIds: readonly BenchmarkCaseId[];
}>;

export type BenchmarkCase = Readonly<{
  id: BenchmarkCaseId;
  suiteId: BenchmarkSuiteId;
  name: string;
  description: string;
  benchmarkSet: BenchmarkSet;
  evaluationMethod: EvaluationMethod;
  maxAttempts: number;
  workload: Readonly<{
    expectedInputTokens: number;
    expectedOutputTokens: number;
  }>;
}>;

export type RunConfiguration = Readonly<{
  runnerVersion: string;
  promptVersion: string;
  modelConfiguration: Readonly<{
    temperature: number;
    maxOutputTokens: number;
  }>;
}>;

export type BenchmarkCaseResult = Readonly<{
  caseId: BenchmarkCaseId;
  status: BenchmarkCaseStatus;
  attemptCount: number;
  qualityScore: number;
  automatedTestsPassed: number;
  automatedTestsTotal: number;
  judgeScore?: number;
  costUsd: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}>;

export type BenchmarkRun = Readonly<{
  id: BenchmarkRunId;
  suiteId: BenchmarkSuiteId;
  modelId: ModelId;
  status: BenchmarkRunStatus;
  startedAt: string;
  completedAt?: string;
  configuration: RunConfiguration;
  results: readonly BenchmarkCaseResult[];
}>;
