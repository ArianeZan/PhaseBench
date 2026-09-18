import { describe, expect, it } from "vitest";

import type { ModelMetrics } from "./metrics";
import { explainRecommendation } from "./explanations";

const metrics: ModelMetrics = {
  qualityScore: 96.25,
  taskPassRate: 97,
  automatedTestPassRate: 98,
  judgeScore: 94,
  costUsd: 0.1234,
  latencyMs: 2450,
  inputTokens: 3000,
  outputTokens: 1000,
  averageAttempts: 1.04,
  stabilityScore: 99,
};

describe("explainRecommendation", () => {
  it("uses priority-specific evidence", () => {
    expect(
      explainRecommendation(metrics, "quality").map((reason) => reason.metric),
    ).toEqual(["qualityScore", "taskPassRate", "judgeScore"]);
    expect(explainRecommendation(metrics, "speed")[0]?.metric).toBe(
      "latencyMs",
    );
    expect(explainRecommendation(metrics, "value")[0]?.metric).toBe("costUsd");
    expect(explainRecommendation(metrics, "reliability")[0]?.metric).toBe(
      "stabilityScore",
    );
  });

  it("includes exact values and units", () => {
    expect(explainRecommendation(metrics, "balanced")).toEqual([
      {
        metric: "qualityScore",
        value: 96.25,
        unit: "score",
        message: "Quality score: 96.25/100.",
      },
      {
        metric: "costUsd",
        value: 0.1234,
        unit: "USD",
        message: "Estimated cost per task: $0.1234.",
      },
      {
        metric: "latencyMs",
        value: 2450,
        unit: "milliseconds",
        message: "End-to-end latency: 2450 ms.",
      },
    ]);
  });

  it("skips missing evidence and uses the next relevant metric", () => {
    const reasons = explainRecommendation(
      { ...metrics, judgeScore: null },
      "quality",
    );
    expect(reasons.map((reason) => reason.metric)).toEqual([
      "qualityScore",
      "taskPassRate",
      "automatedTestPassRate",
    ]);
  });

  it("rejects explanations with fewer than two verified metrics", () => {
    const empty = Object.fromEntries(
      Object.keys(metrics).map((key) => [key, null]),
    ) as ModelMetrics;
    expect(() => explainRecommendation(empty, "balanced")).toThrow(
      "at least two",
    );
  });
});
