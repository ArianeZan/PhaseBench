import { describe, expect, it } from "vitest";
import { listRunIds, loadRunDetail } from "./run-detail-data";

describe("run detail data", () => {
  it("joins configuration and case evidence for a known run", async () => {
    const id = "2026-09-18-build-openai-gpt-5-2";
    const detail = await loadRunDetail(id);
    expect(detail?.cases).toHaveLength(5);
    expect(detail?.totals.costUsd).toBeGreaterThan(0);
    expect(detail?.run.configuration.modelConfiguration.temperature).toBe(0);
    expect(await listRunIds()).toHaveLength(12);
    expect(await loadRunDetail("unknown")).toBeNull();
  });
});
