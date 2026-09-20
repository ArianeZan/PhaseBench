# Product Evidence and Limitations

## What PhaseBench currently shows

PhaseBench is an MVP decision experience powered by deterministic synthetic fixtures. Provider and model names make the workflow realistic, but every displayed score, rank, cost, latency, token count, trend, run, and recommendation is illustrative. Nothing in the current application is a measurement of a live provider service or a current vendor claim.

The UI labels dashboard snapshots, comparisons, model profiles, run history, and run details as synthetic. That label applies to derived values too: rankings, explanations, daily changes, and recommended-stack estimates all originate from the same synthetic evidence.

## How recommendations are produced

1. A fixture repository returns a versioned catalog and daily model-phase summaries.
2. Raw metrics are normalized against fixed product bounds rather than the current candidates.
3. Quality, value, speed, and reliability dimensions combine the available normalized metrics.
4. The selected recommendation mode weights those four dimensions.
5. Deterministic tie-breaking orders equal scores by quality, reliability, and stable model ID.
6. Explanations quote raw winner metrics; they do not invent competitive margins.
7. The recommended workflow applies the same mode to Debate, Plan, and Build and totals the declared standard workload.

Exact bounds, weights, missing-data behavior, tie-breaking, explanation rules, and workload assumptions live in [Scoring and Normalization](SCORING.md). The implementation is framework-neutral under `src/domain/` and is protected by boundary and integration tests.

## Synthetic dataset assumptions

The fixture dataset contains four representative models, one five-case suite per phase, 31 fixed dates, and one detailed latest-day run for every model-phase pair. Stable formulas deliberately create different strengths and winners so every product state can be exercised reproducibly.

The model profiles are designed scenarios, not sampled behavior. The fixed/hidden case split demonstrates the intended benchmark structure but does not provide secrecy while the fixtures remain in the repository. Full generation rules and deliberate profiles are documented in [Mock Data](MOCK_DATA.md).

## Current limitations

- No provider API is called and no model response is collected.
- No benchmark runner, scheduler, isolation boundary, retry policy, or rate-limit handling exists.
- SQLite is planned but the active repository is in-memory fixture data.
- Costs do not track current provider pricing.
- Latency does not represent a network, region, load level, or service tier.
- AI-judge values are fixtures; no live judge model, versioned rubric, calibration, or conflict policy is running.
- The hidden benchmark set is conceptual, not secret from repository readers.
- Stability is a synthetic score, not repeated live-run variance.
- Dates stop at 2026-09-18 and do not advance automatically.
- Recommendation weights and normalization bounds are initial product defaults and have not been calibrated against user outcomes.
- Local accessibility and performance audits are controlled checks, not production field telemetry.
- Review/Debug phases, accounts, billing, alerts, and administration remain outside the MVP.

## Path to real evidence

Real-data readiness is intentionally separated into M4 so the dashboard does not become coupled to a provider or storage implementation:

1. **Persist reproducible evidence:** PB-028 defines a versioned SQLite schema and migrations; PB-029 implements the existing repository contract. See [Architecture](ARCHITECTURE.md), the [data boundary](../src/data/README.md), and [Domain Model](DOMAIN_MODEL.md).
2. **Call providers consistently:** PB-030 defines adapters that capture responses, token usage, cost, latency, errors, retries, rate limits, and cancellation without storing credentials.
3. **Execute safely:** PB-031 designs an isolated runner with fixed configuration, budgets, concurrency limits, timeouts, and complete version provenance.
4. **Evaluate reproducibly:** PB-032 prioritizes automated validation and adds versioned judge rubrics, calibration, structured evidence, and candidate/judge conflict rules.
5. **Operate daily:** after those boundaries are proven, a scheduler can execute suites, persist results, publish a complete snapshot, and retain previous snapshots for change calculations.

These tasks are defined in the [product backlog](BACKLOG.md). Until they are complete and validated, PhaseBench must continue to describe its output as synthetic.

## Evidence-reading checklist

Before treating a future recommendation as real, verify that it identifies:

- model, provider, and API version;
- benchmark suite, case set, prompt, runner, and evaluation versions;
- execution time, region or environment, model configuration, retries, and status;
- raw outputs or protected evidence references;
- automated-test results and any judge rubric/version;
- observed tokens, cost, latency, attempts, and repeated-run stability;
- the snapshot date and completeness state;
- the scoring profile, bounds, workload, and missing-data treatment used to derive the recommendation.
