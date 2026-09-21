import { describe, expect, it } from "vitest";

import type {
  ModelExecutionRequest,
  ModelExecutor,
} from "./provider-execution";

const request: ModelExecutionRequest = {
  modelId: "provider-model-v1",
  phaseId: "build",
  messages: [
    { role: "system", content: "You are a careful coding assistant." },
    { role: "user", content: "Explain the safest implementation." },
  ],
  configuration: { temperature: 0.2, maxOutputTokens: 300 },
  timeoutMs: 10_000,
};

describe("provider-neutral model execution", () => {
  it("allows provider-shaped adapters to expose one stable response", async () => {
    const adapter = createFakeExecutor();

    await expect(adapter.execute(request)).resolves.toEqual({
      content: "A deterministic answer.",
      finishReason: "completed",
      usage: { inputTokens: 20, outputTokens: 5, costUsd: 0.01 },
      latencyMs: 120,
      attemptCount: 1,
      providerRequestId: "provider-request-1",
      providerMetadata: { region: "test" },
    });
  });

  it("keeps cancellation explicit in the shared contract", async () => {
    const controller = new AbortController();
    controller.abort();
    const adapter = createFakeExecutor();

    await expect(
      adapter.execute({ ...request, signal: controller.signal }),
    ).resolves.toMatchObject({ finishReason: "cancelled", attemptCount: 0 });
  });
});

function createFakeExecutor(): ModelExecutor {
  return {
    async execute(modelRequest) {
      if (modelRequest.signal?.aborted) {
        return {
          content: "",
          finishReason: "cancelled",
          usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 },
          latencyMs: 0,
          attemptCount: 0,
        };
      }

      return {
        content: "A deterministic answer.",
        finishReason: "completed",
        usage: { inputTokens: 20, outputTokens: 5, costUsd: 0.01 },
        latencyMs: 120,
        attemptCount: 1,
        providerRequestId: "provider-request-1",
        providerMetadata: { region: "test" },
      };
    },
  };
}
