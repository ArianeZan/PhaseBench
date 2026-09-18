import { describe, expect, it } from "vitest";

import type { DailyModelSummary, ModelMetrics } from "./metrics";
import { calculateRecommendedStack, standardWorkflow } from "./stack";

const summaries = (["debate", "plan", "build"] as const).flatMap(
  (phaseId, phaseIndex) => [
    summary(
      `${phaseId}-quality`,
      phaseId,
      metrics(96, 0.5 + phaseIndex * 0.1, 4000),
    ),
    summary(`${phaseId}-fast`, phaseId, metrics(82, 0.15, 1800)),
  ],
);

describe("calculateRecommendedStack", () => {
  it("selects one winner per phase and totals phase estimates", () => {
    const stack = calculateRecommendedStack(summaries, "quality");
    expect(stack.status).toBe("complete");
    if (stack.status !== "complete") return;

    expect(stack.phases.map((phase) => phase.modelId)).toEqual([
      "debate-quality",
      "plan-quality",
      "build-quality",
    ]);
    expect(stack.totals.estimatedCostUsd).toBe(
      stack.phases.reduce((total, phase) => total + phase.estimatedCostUsd, 0),
    );
    expect(stack.totals.estimatedDurationMs).toBe(
      stack.phases.reduce(
        (total, phase) => total + phase.estimatedDurationMs,
        0,
      ),
    );
    expect(stack.totals.estimatedInputTokens).toBe(11_500);
    expect(stack.totals.estimatedOutputTokens).toBe(4510);
  });

  it("changes the stack with the selected priority", () => {
    const stack = calculateRecommendedStack(summaries, "speed");
    expect(stack.phases.every((phase) => phase.modelId.endsWith("-fast"))).toBe(
      true,
    );
  });

  it("scales estimates using explicit workload counts", () => {
    const doubled = standardWorkflow.map((item) => ({ ...item, taskCount: 2 }));
    const stack = calculateRecommendedStack(summaries, "quality", doubled);
    expect(stack.status).toBe("complete");
    if (stack.status !== "complete") return;
    expect(stack.totals.estimatedInputTokens).toBe(23_000);
    expect(stack.totals.estimatedOutputTokens).toBe(9020);
  });

  it("returns no total when a phase is unavailable", () => {
    const stack = calculateRecommendedStack(
      summaries.filter((summary) => summary.phaseId !== "build"),
      "balanced",
    );
    expect(stack).toMatchObject({
      status: "incomplete",
      missingPhaseIds: ["build"],
      totals: null,
    });
  });
});

function summary(
  modelId: string,
  phaseId: DailyModelSummary["phaseId"],
  modelMetrics: ModelMetrics,
): DailyModelSummary {
  return {
    date: "2026-09-18",
    modelId,
    phaseId,
    completedRunCount: 5,
    metrics: modelMetrics,
  };
}

function metrics(
  quality: number,
  costUsd: number,
  latencyMs: number,
): ModelMetrics {
  return {
    qualityScore: quality,
    taskPassRate: quality,
    automatedTestPassRate: quality,
    judgeScore: quality,
    costUsd,
    latencyMs,
    inputTokens: 3000,
    outputTokens: 1000,
    averageAttempts: 1.1,
    stabilityScore: quality,
  };
}
