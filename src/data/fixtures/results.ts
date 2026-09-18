import type { BenchmarkCaseResult, BenchmarkRun } from "@/domain/benchmarks";
import type { DailyModelSummary, ModelMetrics } from "@/domain/metrics";
import type { ModelId } from "@/domain/models";
import { phaseIds, type PhaseId } from "@/domain/phases";

import { mockCases, mockModels, mockSuites } from "./catalog";

const historyStart = "2026-08-19";
export const mockLatestDate = "2026-09-18";
const historyDayCount = 31;

type MetricProfile = Readonly<{
  qualityScore: number;
  taskPassRate: number;
  automatedTestPassRate: number;
  judgeScore: number;
  costUsd: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  averageAttempts: number;
  stabilityScore: number;
}>;

const profiles: Record<ModelId, Record<PhaseId, MetricProfile>> = {
  "openai-gpt-5-2": {
    debate: profile(91, 92, 89, 93, 0.42, 4600, 2850, 980, 1.12, 92),
    plan: profile(94, 95, 93, 95, 0.46, 4900, 3600, 1420, 1.08, 94),
    build: profile(96, 97, 98, 94, 0.52, 5300, 5900, 2350, 1.05, 96),
  },
  "anthropic-claude-opus-4-6": {
    debate: profile(96, 96, 91, 97, 0.51, 5700, 3000, 1250, 1.06, 97),
    plan: profile(95, 96, 92, 96, 0.54, 6000, 3800, 1680, 1.07, 96),
    build: profile(92, 93, 94, 91, 0.58, 6400, 6100, 2700, 1.14, 92),
  },
  "google-gemini-3-1-pro": {
    debate: profile(88, 90, 87, 89, 0.28, 3100, 2750, 920, 1.15, 89),
    plan: profile(92, 94, 91, 93, 0.3, 3300, 3450, 1300, 1.1, 93),
    build: profile(91, 92, 93, 89, 0.34, 3500, 5700, 2200, 1.12, 91),
  },
  "mistral-large-3": {
    debate: profile(83, 86, 84, 82, 0.12, 2500, 2600, 840, 1.22, 85),
    plan: profile(84, 87, 85, 84, 0.13, 2600, 3300, 1150, 1.2, 86),
    build: profile(86, 89, 90, 83, 0.15, 2800, 5400, 2050, 1.18, 87),
  },
};

export const mockDailySummaries: readonly DailyModelSummary[] = Array.from(
  { length: historyDayCount },
  (_, dayIndex) => {
    const date = addUtcDays(historyStart, dayIndex);

    return mockModels.flatMap((model, modelIndex) =>
      phaseIds.map((phaseId, phaseIndex) => ({
        date,
        modelId: model.id,
        phaseId,
        completedRunCount: 5,
        metrics: varyMetrics(
          profiles[model.id][phaseId],
          dayIndex,
          modelIndex,
          phaseIndex,
        ),
      })),
    );
  },
).flat();

export const mockBenchmarkRuns: readonly BenchmarkRun[] = mockModels.flatMap(
  (model, modelIndex) =>
    mockSuites.map((suite, phaseIndex) => {
      const summary = mockDailySummaries.find(
        (item) =>
          item.date === mockLatestDate &&
          item.modelId === model.id &&
          item.phaseId === suite.phaseId,
      );

      if (!summary) {
        throw new Error("The mock run has no matching daily summary.");
      }

      const startedHour = 8 + modelIndex * 3 + phaseIndex;
      const startedAt = `${mockLatestDate}T${String(startedHour).padStart(2, "0")}:00:00.000Z`;
      const completedAt = new Date(
        Date.parse(startedAt) + (summary.metrics.latencyMs ?? 0) * 5,
      ).toISOString();

      return {
        id: `${mockLatestDate}-${suite.phaseId}-${model.id}`,
        suiteId: suite.id,
        modelId: model.id,
        status: "completed",
        startedAt,
        completedAt,
        configuration: {
          runnerVersion: "mock-runner-1.0.0",
          promptVersion: `${suite.id}-prompt-1.0.0`,
          modelConfiguration: { temperature: 0, maxOutputTokens: 4096 },
        },
        results: suite.caseIds.map((caseId, caseIndex) =>
          createCaseResult(summary.metrics, caseId, caseIndex),
        ),
      } satisfies BenchmarkRun;
    }),
);

function profile(
  qualityScore: number,
  taskPassRate: number,
  automatedTestPassRate: number,
  judgeScore: number,
  costUsd: number,
  latencyMs: number,
  inputTokens: number,
  outputTokens: number,
  averageAttempts: number,
  stabilityScore: number,
): MetricProfile {
  return {
    qualityScore,
    taskPassRate,
    automatedTestPassRate,
    judgeScore,
    costUsd,
    latencyMs,
    inputTokens,
    outputTokens,
    averageAttempts,
    stabilityScore,
  };
}

function varyMetrics(
  base: MetricProfile,
  dayIndex: number,
  modelIndex: number,
  phaseIndex: number,
): ModelMetrics {
  const wave = ((dayIndex * 7 + modelIndex * 3 + phaseIndex * 5) % 9) - 4;
  const scoreDelta = wave * 0.35 + dayIndex * 0.03;
  const incompleteJudge = (dayIndex + modelIndex + phaseIndex) % 23 === 0;

  return {
    qualityScore: clamp(base.qualityScore + scoreDelta, 0, 100),
    taskPassRate: clamp(base.taskPassRate + wave * 0.25, 0, 100),
    automatedTestPassRate: clamp(
      base.automatedTestPassRate + wave * 0.3,
      0,
      100,
    ),
    judgeScore: incompleteJudge
      ? null
      : clamp(base.judgeScore + scoreDelta * 0.8, 0, 100),
    costUsd: round(base.costUsd * (1 + wave * 0.006), 4),
    latencyMs: Math.round(base.latencyMs * (1 + wave * 0.012)),
    inputTokens: Math.round(base.inputTokens * (1 + wave * 0.004)),
    outputTokens: Math.round(base.outputTokens * (1 + wave * 0.008)),
    averageAttempts: round(base.averageAttempts + Math.max(0, -wave) * 0.01, 2),
    stabilityScore: clamp(base.stabilityScore - Math.abs(wave) * 0.25, 0, 100),
  };
}

function createCaseResult(
  metrics: ModelMetrics,
  caseId: string,
  caseIndex: number,
): BenchmarkCaseResult {
  const qualityScore = clamp(
    (metrics.qualityScore ?? 0) + caseIndex - 2,
    0,
    100,
  );
  const passed = qualityScore >= 80;
  const benchmarkCase = mockCases.find((item) => item.id === caseId);

  if (!benchmarkCase) {
    throw new Error(`Unknown mock benchmark case: ${caseId}`);
  }

  return {
    caseId,
    status: passed ? "passed" : "failed",
    attemptCount: passed ? 1 : benchmarkCase.maxAttempts,
    qualityScore,
    automatedTestsPassed: Math.round((metrics.automatedTestPassRate ?? 0) / 10),
    automatedTestsTotal: 10,
    judgeScore: metrics.judgeScore ?? undefined,
    costUsd: round((metrics.costUsd ?? 0) / 5, 4),
    latencyMs: Math.round((metrics.latencyMs ?? 0) / 5),
    inputTokens: Math.round((metrics.inputTokens ?? 0) / 5),
    outputTokens: Math.round((metrics.outputTokens ?? 0) / 5),
  };
}

function addUtcDays(date: string, days: number): string {
  const timestamp = Date.parse(`${date}T00:00:00.000Z`) + days * 86_400_000;
  return new Date(timestamp).toISOString().slice(0, 10);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return round(Math.min(maximum, Math.max(minimum, value)), 2);
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
