# M4 — Real Data and Benchmark Readiness Execution Plan

## Outcome

M4 ends with boundaries that can preserve real benchmark evidence, execute models through provider-neutral contracts, run benchmarks within explicit limits, and evaluate results reproducibly. Work remains split into business-readable, independently reviewable branches. Documentation and applicable `AGENTS.md` guidance are reviewed before every task closes.

M4 prepares and proves these capabilities without authorizing production provider credentials, paid model calls, scheduled production runs, or publication of protected benchmark content.

## PB-028 — Preserve reproducible benchmark evidence

### PB-028A · Preserve reproducible data history

- **Status:** Completed
- **Branch:** `codex/pb-028a-reproducible-data-history`
- **GitHub:** [#63](https://github.com/ArianeZan/PhaseBench/issues/63)
- Define the SQLite records, relationships, ownership boundaries, and immutable version identifiers needed to reproduce benchmark evidence.
- **Acceptance:** the documented design maps to the existing domain and repository contracts while making constraints, timestamps, versions, and retention assumptions explicit.

### PB-028B · Create versioned benchmark storage

- **Status:** Completed
- **Branch:** `codex/pb-028b-versioned-benchmark-storage`
- **GitHub:** [#64](https://github.com/ArianeZan/PhaseBench/issues/64)
- Create executable, ordered SQLite migrations with the required tables, constraints, foreign keys, and query indexes.
- **Acceptance:** migrations are repeatable against an empty database and tests reject invalid relationships or duplicate immutable evidence.

## PB-029 — Make stored evidence usable

### PB-029A · Make stored evidence available

- **Status:** Completed
- **Branch:** `codex/pb-029a-available-stored-evidence`
- **GitHub:** [#65](https://github.com/ArianeZan/PhaseBench/issues/65)
- Implement the existing asynchronous repository contract over SQLite without changing product-facing consumers.
- **Acceptance:** contract tests demonstrate equivalent observable behavior for fixtures and SQLite, including units, evidence labels, ordering, and missing records.

### PB-029B · Switch data sources safely

- **Branch:** `codex/pb-029b-safe-data-source-switching`
- **GitHub:** [#66](https://github.com/ArianeZan/PhaseBench/issues/66)
- Add validated server-only repository selection and a deterministic development seed and recreation workflow.
- **Acceptance:** developers can switch, create, recreate, and inspect local data without exposing secrets or committing generated databases.

## PB-030 — Standardize provider execution

### PB-030A · Standardize model execution

- **Branch:** `codex/pb-030a-standard-model-execution`
- **GitHub:** [#67](https://github.com/ArianeZan/PhaseBench/issues/67)
- Define one provider-neutral request and response contract for prompts, model configuration, results, usage, latency, attempts, and cancellation.
- **Acceptance:** representative provider-shaped test doubles conform without leaking provider-specific payloads into benchmark orchestration.

### PB-030B · Make provider failures predictable

- **Branch:** `codex/pb-030b-predictable-provider-failures`
- **GitHub:** [#68](https://github.com/ArianeZan/PhaseBench/issues/68)
- Define typed errors and policies for rate limits, retry eligibility, timeouts, cancellation, and partial usage or cost.
- **Acceptance:** orchestration can distinguish every terminal outcome and cannot mistake infrastructure failure for model failure.

## PB-031 — Run benchmarks within controlled boundaries

### PB-031A · Define controlled benchmark journeys

- **Branch:** `codex/pb-031a-controlled-benchmark-journeys`
- **GitHub:** [#69](https://github.com/ArianeZan/PhaseBench/issues/69)
- Define the isolated load → execute → evaluate → persist lifecycle, including version identities, fixed and hidden sets, and operational limits.
- **Acceptance:** every stage has explicit inputs, outputs, failure behavior, and time, cost, concurrency, retry, and cancellation budgets.

### PB-031B · Prove an isolated benchmark run

- **Branch:** `codex/pb-031b-proven-isolated-benchmark-run`
- **GitHub:** [#70](https://github.com/ArianeZan/PhaseBench/issues/70)
- Implement a deterministic runner prototype using a test adapter and a small suite without making real provider calls.
- **Acceptance:** success, partial failure, cancellation, limits, and immutable persistence are demonstrated end to end.

## PB-032 — Produce trustworthy verdicts

### PB-032A · Prefer deterministic verdicts

- **Branch:** `codex/pb-032a-deterministic-verdicts-first`
- **GitHub:** [#71](https://github.com/ArianeZan/PhaseBench/issues/71)
- Define versioned automated evaluator contracts and implement representative exact, schema, test, and rule-based checks.
- **Acceptance:** results are reproducible, diagnostic evidence is structured, and evaluator errors remain distinct from candidate failures.

### PB-032B · Make AI judgments auditable

- **Branch:** `codex/pb-032b-auditable-ai-judgments`
- **GitHub:** [#72](https://github.com/ArianeZan/PhaseBench/issues/72)
- Define a constrained AI-judge fallback with versioned rubrics, structured evidence, conflict controls, and calibration.
- **Acceptance:** judge configuration and limitations are traceable, common bias risks are addressed, and calibration compares judgments with reference decisions.

## M4 completion checklist

- [x] PB-028A–PB-028B merged
- [ ] PB-029A–PB-029B merged
- [ ] PB-030A–PB-030B merged
- [ ] PB-031A–PB-031B merged
- [ ] PB-032A–PB-032B merged
- [ ] SQLite migrations and repository contract checks pass
- [ ] Provider and runner boundaries are tested without production credentials
- [ ] Evaluation policy and AI-judge limitations are documented
- [ ] All M4 issues are closed and `master` is synchronized with GitHub
