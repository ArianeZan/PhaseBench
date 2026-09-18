import { describe, expect, it } from "vitest";

import type { DailyModelSummary, ModelMetrics } from "./metrics";
import { buildHistorySeries } from "./history-series";

const metrics = (qualityScore: number | null): ModelMetrics => ({
  qualityScore,
  taskPassRate: 80,
  automatedTestPassRate: 80,
  judgeScore: 80,
  costUsd: 0.1,
  latencyMs: 1000,
  inputTokens: 100,
  outputTokens: 50,
  averageAttempts: 1,
  stabilityScore: 90,
});

const summary = (
  date: string,
  modelId: DailyModelSummary["modelId"],
  phaseId: DailyModelSummary["phaseId"],
  qualityScore: number | null,
): DailyModelSummary => ({
  date,
  modelId,
  phaseId,
  completedRunCount: 5,
  metrics: metrics(qualityScore),
});

describe("buildHistorySeries", () => {
  it("keeps catalog model order and represents missing dates and values explicitly", () => {
    const result = buildHistorySeries(
      [
        summary("2026-09-18", "model-b", "debate", 88),
        summary("2026-09-16", "model-a", "debate", 91),
        summary("2026-09-18", "model-a", "debate", null),
      ],
      {
        phaseId: "debate",
        metric: "qualityScore",
        rangeDays: 7,
        to: "2026-09-18",
        modelIds: ["model-a", "model-b"],
      },
    );

    expect(result.unit).toBe("score");
    expect(result.from).toBe("2026-09-12");
    expect(result.dates).toHaveLength(7);
    expect(result.models.map((series) => series.modelId)).toEqual([
      "model-a",
      "model-b",
    ]);
    expect(result.models[0]?.points.at(-3)).toEqual({
      date: "2026-09-16",
      value: 91,
    });
    expect(result.models[0]?.points.at(-2)?.value).toBeNull();
    expect(result.models[0]?.points.at(-1)?.value).toBeNull();
    expect(result.models[1]?.points.at(-1)?.value).toBe(88);
  });

  it("filters other phases, models, and dates from the requested range", () => {
    const result = buildHistorySeries(
      [
        summary("2026-09-18", "model-a", "plan", 99),
        summary("2026-09-11", "model-a", "debate", 97),
        summary("2026-09-18", "model-c", "debate", 95),
        summary("2026-09-18", "model-a", "debate", 90),
      ],
      {
        phaseId: "debate",
        metric: "qualityScore",
        rangeDays: 7,
        to: "2026-09-18",
        modelIds: ["model-a"],
      },
    );

    expect(result.models).toHaveLength(1);
    expect(
      result.models[0]?.points.filter((point) => point.value !== null),
    ).toEqual([{ date: "2026-09-18", value: 90 }]);
  });

  it("rejects duplicate model and date summaries", () => {
    const duplicate = summary("2026-09-18", "model-a", "debate", 90);

    expect(() =>
      buildHistorySeries([duplicate, duplicate], {
        phaseId: "debate",
        metric: "qualityScore",
        rangeDays: 7,
        to: "2026-09-18",
        modelIds: ["model-a"],
      }),
    ).toThrow("Duplicate history summary");
  });
});
