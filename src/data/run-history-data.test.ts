import { describe, expect, it } from "vitest";
import { loadRunHistory } from "./run-history-data";

describe("loadRunHistory", () => {
  it("filters repository runs and enriches their evidence", async () => {
    const data = await loadRunHistory({
      phaseId: "build",
      modelId: "openai-gpt-5-2",
      status: "completed",
    });
    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.suite.phaseId).toBe("build");
    expect(data.items[0]?.quality).not.toBeNull();
    expect(data.items[0]?.costUsd).toBeGreaterThan(0);
  });
});
