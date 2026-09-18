# M1 Validation Record

M1 was validated on 2026-09-18 against the acceptance criteria in `docs/M1_PLAN.md`.

## Delivered core

- Domain contracts cover providers, models, phases, priorities, benchmark suites and cases, runs, metrics, recommendations, explanations, and stack estimates.
- The asynchronous `BenchmarkRepository` hides the active storage implementation from consumers.
- Synthetic fixtures provide four models, three suites, fifteen cases, 31 days of summaries, and twelve detailed recent runs.
- Absolute normalization, five recommendation profiles, deterministic ranking, metric-backed explanations, and complete-workflow aggregation are pure domain operations.

## Verification

- `npm run verify` passes formatting, ESLint, TypeScript, Vitest, and the production build.
- Unit tests cover normalization boundaries, outliers, missing values, zero ranges, weights, all priority modes, tie-breaking, explanations, stack totals, and incomplete phases.
- Integration tests query the configured repository and produce three explainable recommendations plus a complete stack for every priority.
- The fixture integration demonstrates that changing priority produces more than one winner across the recommendation set.

## Known scope

The values are deterministic synthetic demonstration data, not current vendor performance claims. M1 exposes no final dashboard; M2 will consume these contracts and results in the product interface. SQLite and real benchmark execution remain later milestones.
