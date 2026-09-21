# Provider-neutral model execution

PB-030A defines the boundary used by benchmark runners to execute a model without depending on an SDK or provider payload shape.

`ModelExecutor` accepts a model identity, development phase, ordered messages, generation configuration, timeout, cancellation signal, and safe request metadata. It returns content, a normalized finish reason, token and cost usage, latency, attempt count, and optional safe provider metadata.

Adapters translate provider-specific requests and responses at this boundary. Benchmark orchestration must not import provider SDKs, inspect provider response JSON, or infer units from provider-specific names. Costs are USD estimates, latency is milliseconds, and token counts are integers.

Cancellation is represented by `finishReason: "cancelled"` and zero attempts when no provider request started. Retry policy, typed infrastructure failures, rate-limit handling, and partial-attempt accounting are deliberately defined in PB-030B.

PB-030B classifies authentication, invalid request, rate limit, timeout, cancellation, provider unavailability, content filtering, and unknown failures. Each failure preserves attempt count, provider request ID, retry-after information, and partial usage when available. `decideRetry` applies an explicit maximum-attempt policy and bounded exponential backoff; cancellation and invalid requests are never retried.

The current tests use provider-shaped fake adapters only. No production credentials or provider API calls are required.
