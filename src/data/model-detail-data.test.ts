import { describe, expect, it } from "vitest";
import { listModelIds, loadModelIdentity } from "./model-detail-data";

describe("model detail data", () => {
  it("resolves known identities and rejects unknown IDs", async () => {
    expect((await loadModelIdentity("openai-gpt-5-2"))?.provider.name).toBe(
      "OpenAI",
    );
    expect(await loadModelIdentity("unknown-model")).toBeNull();
    expect(await listModelIds()).toHaveLength(4);
  });
});
