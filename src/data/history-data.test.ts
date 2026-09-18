import { describe, expect, it } from "vitest";

import { loadHistoryData } from "./history-data";

describe("loadHistoryData", () => {
  it("prepares repository history in catalog order for the requested range", async () => {
    const result = await loadHistoryData({
      phaseId: "build",
      metric: "latencyMs",
      rangeDays: 30,
      to: "2026-09-18",
    });

    expect(result.series.from).toBe("2026-08-20");
    expect(result.series.to).toBe("2026-09-18");
    expect(result.series.unit).toBe("milliseconds");
    expect(result.series.dates).toHaveLength(30);
    expect(result.series.models.map((series) => series.modelId)).toEqual(
      result.models.map((model) => model.id),
    );
    expect(
      result.series.models.every((series) => series.points.length === 30),
    ).toBe(true);
  });
});
