import { describe, expect, it } from "vitest";
import { createProviderFailure, decideRetry } from "./provider-failures";

describe("provider failure policy", () => {
  const policy = { maxAttempts: 3, baseDelayMs: 100, maxDelayMs: 500 };
  it("retries transient failures with bounded exponential backoff", () => {
    const failure = createProviderFailure("unavailable", {
      message: "temporary",
      attemptCount: 2,
      partialUsage: { inputTokens: 10, outputTokens: 0, costUsd: 0.001 },
    });
    expect(decideRetry(failure, policy)).toEqual({
      retry: true,
      nextAttempt: 3,
      delayMs: 200,
      reason: "eligible",
    });
    expect(failure.partialUsage?.costUsd).toBe(0.001);
  });
  it("honors rate-limit delay and stops at the attempt limit", () => {
    const failure = createProviderFailure("rate-limit", {
      message: "429",
      attemptCount: 1,
      retryAfterMs: 4000,
    });
    expect(decideRetry(failure, policy).delayMs).toBe(4000);
    expect(decideRetry({ ...failure, attemptCount: 3 }, policy)).toMatchObject({
      retry: false,
      reason: "attempt-limit",
    });
  });
  it("never retries cancellation or invalid requests", () => {
    for (const kind of ["cancelled", "invalid-request"] as const)
      expect(
        decideRetry(
          createProviderFailure(kind, { message: kind, attemptCount: 1 }),
          policy,
        ),
      ).toMatchObject({ retry: false, reason: "not-retryable" });
  });
});
