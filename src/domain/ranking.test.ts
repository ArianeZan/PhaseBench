import { describe, expect, it } from "vitest";

import type { DailyModelSummary, ModelMetrics } from "./metrics";
import { priorityIds } from "./priorities";
import { rankModels } from "./ranking";

const candidates = [
  summary("quality-model", metrics(98, 0.7, 7600, 1.15, 94)),
  summary("value-model", metrics(88, 0.08, 4300, 1.2, 88)),
  summary("speed-model", metrics(84, 0.35, 1600, 1.25, 84)),
  summary("reliable-model", metrics(90, 0.4, 4500, 1, 100)),
];

describe("rankModels", () => {
  it.each([
    ["quality", "quality-model"],
    ["value", "value-model"],
    ["speed", "speed-model"],
    ["reliability", "reliable-model"],
  ] as const)("selects the expected %s winner", (priority, winner) => {
    expect(rankModels(candidates, priority)[0]?.modelId).toBe(winner);
  });

  it("ranks every supported mode", () => {
    for (const priority of priorityIds) {
      expect(rankModels(candidates, priority)).toHaveLength(4);
    }
  });

  it("uses stable tie-breaking independent of input order", () => {
    const first = summary("alpha", metrics(90, 0.3, 4000, 1.1, 90));
    const second = summary("beta", metrics(90, 0.3, 4000, 1.1, 90));
    expect(
      rankModels([second, first], "balanced").map((item) => item.modelId),
    ).toEqual(["alpha", "beta"]);
  });

  it("excludes candidates without a required dimension", () => {
    const incomplete = summary("incomplete", {
      ...metrics(100, 0.05, 1500, 1, 100),
      latencyMs: null,
    });
    expect(rankModels([...candidates, incomplete], "quality")).toHaveLength(4);
  });

  it("rejects mixed dates or phases", () => {
    expect(() =>
      rankModels(
        [candidates[0], { ...candidates[1], phaseId: "plan" }],
        "balanced",
      ),
    ).toThrow("one date and phase");
  });
});

function summary(
  modelId: string,
  modelMetrics: ModelMetrics,
): DailyModelSummary {
  return {
    date: "2026-09-18",
    modelId,
    phaseId: "debate",
    completedRunCount: 5,
    metrics: modelMetrics,
  };
}

function metrics(
  qualityScore: number,
  costUsd: number,
  latencyMs: number,
  averageAttempts: number,
  stabilityScore: number,
): ModelMetrics {
  return {
    qualityScore,
    taskPassRate: qualityScore,
    automatedTestPassRate: qualityScore,
    judgeScore: qualityScore,
    costUsd,
    latencyMs,
    inputTokens: 3000,
    outputTokens: 1000,
    averageAttempts,
    stabilityScore,
  };
}
