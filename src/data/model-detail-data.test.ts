import { describe, expect, it } from "vitest";
import {
  listModelIds,
  loadModelIdentity,
  loadModelProfile,
} from "./model-detail-data";

describe("model detail data", () => {
  it("resolves known identities and rejects unknown IDs", async () => {
    expect((await loadModelIdentity("openai-gpt-5-2"))?.provider.name).toBe(
      "OpenAI",
    );
    expect(await loadModelIdentity("unknown-model")).toBeNull();
    expect(await listModelIds()).toHaveLength(4);
  });
  it("assembles phase strengths, trends, and recent runs", async () => {
    const profile = await loadModelProfile("openai-gpt-5-2");
    expect(profile?.phases).toHaveLength(3);
    expect(profile?.phases.every((phase) => phase.qualityChange !== null)).toBe(
      true,
    );
    expect(profile?.recentRuns).toHaveLength(3);
    expect(profile?.updatedOn).toBe("2026-09-18");
  });
});
