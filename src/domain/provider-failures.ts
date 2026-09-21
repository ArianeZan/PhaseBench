import type { ModelExecutionUsage } from "./provider-execution";

export type ProviderFailureKind =
  | "authentication"
  | "invalid-request"
  | "rate-limit"
  | "timeout"
  | "cancelled"
  | "unavailable"
  | "content-filter"
  | "unknown";
export type ProviderFailure = Readonly<{
  kind: ProviderFailureKind;
  message: string;
  retryable: boolean;
  attemptCount: number;
  retryAfterMs?: number;
  providerRequestId?: string;
  partialUsage?: ModelExecutionUsage;
  providerCode?: string;
}>;
export type RetryPolicy = Readonly<{
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}>;
export type RetryDecision = Readonly<{
  retry: boolean;
  nextAttempt: number;
  delayMs: number;
  reason: "eligible" | "attempt-limit" | "not-retryable";
}>;

export function decideRetry(
  failure: ProviderFailure,
  policy: RetryPolicy,
): RetryDecision {
  const nextAttempt = failure.attemptCount + 1;
  if (!failure.retryable)
    return { retry: false, nextAttempt, delayMs: 0, reason: "not-retryable" };
  if (nextAttempt > policy.maxAttempts)
    return { retry: false, nextAttempt, delayMs: 0, reason: "attempt-limit" };
  const delayMs = Math.min(
    policy.maxDelayMs,
    policy.baseDelayMs * 2 ** Math.max(0, failure.attemptCount - 1),
  );
  return {
    retry: true,
    nextAttempt,
    delayMs: failure.retryAfterMs ?? delayMs,
    reason: "eligible",
  };
}

export function createProviderFailure(
  kind: ProviderFailureKind,
  details: Omit<ProviderFailure, "kind" | "retryable"> &
    Partial<Pick<ProviderFailure, "retryable">>,
): ProviderFailure {
  const retryable =
    details.retryable ??
    (kind === "rate-limit" || kind === "timeout" || kind === "unavailable");
  return { ...details, kind, retryable };
}
