# M1 — Core Execution Plan

## Outcome

M1 ends with a typed, deterministic core that can answer which model to use for Debate, Plan, and Build under each supported priority. All data is exposed through an asynchronous repository contract, and the recommendation, explanation, and stack calculations are independent from React and storage.

Each subtask below is intended for one short-lived branch and one focused merge. Documentation and applicable `AGENTS.md` guidance are reviewed before every task closes.

## Product assumptions

- The initial catalog contains OpenAI, Anthropic, Google, and one independent provider, with one representative model from each.
- Scores and fixtures are synthetic, reproducible demonstration data rather than claims about current real-world model performance.
- A stack estimate represents one standard Debate task, one standard Plan task, and one standard Build task.
- Recommendation weights are initial product defaults and remain centralized so later benchmark evidence can change them without redesigning consumers.

## PB-006 — Model the domain

### PB-006A · Establish the recommendation vocabulary

- **Branch:** `codex/pb-006a-recommendation-vocabulary`
- **GitHub:** [#18](https://github.com/ArianeZan/PhaseBench/issues/18)
- **Dependencies:** M0, PB-002
- Define providers, models, phases, and recommendation priorities as explicit domain concepts.
- **Acceptance:** identifiers are stable, values have business-readable labels, and adding a provider or model does not require changing existing consumers.

### PB-006B · Describe benchmark work consistently

- **Branch:** `codex/pb-006b-benchmark-vocabulary`
- **GitHub:** [#19](https://github.com/ArianeZan/PhaseBench/issues/19)
- **Dependencies:** PB-006A
- Define suites, benchmark cases, runs, results, statuses, attempts, and evaluation methods.
- **Acceptance:** fixed and hidden cases are distinguishable, run provenance is representable, and numeric fields include units.

### PB-006C · Define recommendation-ready metrics

- **Branch:** `codex/pb-006c-recommendation-contracts`
- **GitHub:** [#20](https://github.com/ArianeZan/PhaseBench/issues/20)
- **Dependencies:** PB-006A, PB-006B
- Define daily model summaries, metric samples, recommendations, explanations, and stack estimates.
- **Acceptance:** all requested quality, pass-rate, automated-test, judge, cost, latency, token, attempt, and stability measures are represented without UI or storage dependencies.

## PB-007 — Design the data repository contract

### PB-007A · Give the product one data gateway

- **Branch:** `codex/pb-007a-product-data-gateway`
- **GitHub:** [#21](https://github.com/ArianeZan/PhaseBench/issues/21)
- **Dependencies:** PB-006C
- Define an asynchronous repository interface for catalog, daily summaries, history, and benchmark runs.
- **Acceptance:** consumers can query by stable filters and never need to know whether data comes from fixtures or SQLite.

### PB-007B · Make data sources replaceable

- **Branch:** `codex/pb-007b-replaceable-data-source`
- **GitHub:** [#22](https://github.com/ArianeZan/PhaseBench/issues/22)
- **Dependencies:** PB-007A
- Add the composition boundary used to select the current repository implementation and document its lifetime and responsibilities.
- **Acceptance:** routes can request the repository through one entry point; components cannot import it; no framework dependency enters the domain layer.

## PB-008 — Create a coherent mock dataset

### PB-008A · Create a representative benchmark catalog

- **Branch:** `codex/pb-008a-representative-benchmark-catalog`
- **GitHub:** [#23](https://github.com/ArianeZan/PhaseBench/issues/23)
- **Dependencies:** PB-006C, PB-007A
- Add four models, three suites, and five benchmark cases per phase with explicit fixed/hidden membership and workload assumptions.
- **Acceptance:** every fixture references valid catalog entities and is clearly marked as synthetic.

### PB-008B · Provide a believable month of results

- **Branch:** `codex/pb-008b-month-of-benchmark-results`
- **GitHub:** [#24](https://github.com/ArianeZan/PhaseBench/issues/24)
- **Dependencies:** PB-008A
- Generate at least 30 days of deterministic summaries and representative runs, including controlled variation and occasional incomplete metrics.
- **Acceptance:** identical inputs produce identical data, dates are stable, and the dataset creates meaningful trade-offs between quality, value, speed, and reliability.

### PB-008C · Serve mock data through the product gateway

- **Branch:** `codex/pb-008c-queryable-mock-data`
- **GitHub:** [#25](https://github.com/ArianeZan/PhaseBench/issues/25)
- **Dependencies:** PB-007B, PB-008B
- Implement the repository contract over the fixtures and validate references at its boundary.
- **Acceptance:** filters return immutable, chronologically ordered results; missing entities have documented behavior; UI code does not import fixtures.

## PB-009 — Define normalization formulas

### PB-009A · Make metric comparisons fair

- **Branch:** `codex/pb-009a-fair-metric-comparisons`
- **GitHub:** [#26](https://github.com/ArianeZan/PhaseBench/issues/26)
- **Dependencies:** PB-006C
- Document normalization bounds, direction, missing-value behavior, outlier clamping, and zero-range behavior.
- **Acceptance:** every recommendation input maps predictably to a 0–100 score and formulas can be explained to a product stakeholder.

### PB-009B · Turn raw metrics into comparable scores

- **Branch:** `codex/pb-009b-comparable-metric-scores`
- **GitHub:** [#27](https://github.com/ArianeZan/PhaseBench/issues/27)
- **Dependencies:** PB-009A
- Implement pure normalization functions and introduce the minimal unit-test setup needed to verify them.
- **Acceptance:** tests cover normal, boundary, missing, outlier, reversed-direction, and zero-range cases.

## PB-010 — Implement the recommendation engine

### PB-010A · Encode recommendation priorities

- **Branch:** `codex/pb-010a-recommendation-priorities`
- **GitHub:** [#28](https://github.com/ArianeZan/PhaseBench/issues/28)
- **Dependencies:** PB-009B
- Centralize the Quality, Value, Speed, Reliability, and Balanced weighting profiles.
- **Acceptance:** every profile totals 100%, emphasizes its named outcome, and documents which normalized dimensions it uses.

### PB-010B · Rank models deterministically

- **Branch:** `codex/pb-010b-deterministic-model-ranking`
- **GitHub:** [#29](https://github.com/ArianeZan/PhaseBench/issues/29)
- **Dependencies:** PB-010A
- Score and rank eligible models per phase with explicit missing-data handling and stable tie-breaking.
- **Acceptance:** tests cover every priority, different winners, ties, incomplete inputs, and input-order independence.

## PB-011 — Generate recommendation explanations

### PB-011A · Explain why each model wins

- **Branch:** `codex/pb-011a-verifiable-winner-explanations`
- **GitHub:** [#30](https://github.com/ArianeZan/PhaseBench/issues/30)
- **Dependencies:** PB-010B
- Produce two or three concise, metric-based reasons aligned with the selected priority.
- **Acceptance:** every reason is derived from winner data, includes a value and unit where relevant, and never makes an unsupported comparative claim.

## PB-012 — Calculate the recommended stack

### PB-012A · Estimate the complete recommended workflow

- **Branch:** `codex/pb-012a-complete-workflow-estimate`
- **GitHub:** [#31](https://github.com/ArianeZan/PhaseBench/issues/31)
- **Dependencies:** PB-010B, PB-011A
- Select one recommendation per phase and aggregate estimated cost, duration, input tokens, and output tokens for the standard workload.
- **Acceptance:** totals equal phase sums, assumptions and units are exposed, and incomplete phases produce an explicit result rather than a misleading total.

### PB-012B · Validate the recommendation core

- **Branch:** `codex/pb-012b-trusted-recommendation-core`
- **GitHub:** [#32](https://github.com/ArianeZan/PhaseBench/issues/32)
- **Dependencies:** PB-008C, PB-012A
- Exercise the repository, rankings, explanations, and stack calculation together for all priorities; reconcile documentation and durable development rules.
- **Acceptance:** the complete verification suite passes, integration tests prove different priority outcomes, and M1 documentation matches the implementation.

## M1 completion checklist

- [ ] PB-006A–PB-006C merged
- [ ] PB-007A–PB-007B merged
- [ ] PB-008A–PB-008C merged
- [ ] PB-009A–PB-009B merged
- [ ] PB-010A–PB-010B merged
- [ ] PB-011A merged
- [ ] PB-012A–PB-012B merged
- [ ] Domain, repository, fixture, scoring, explanation, and stack documentation reviewed
- [ ] Unit and integration tests included in `npm run verify`
- [ ] All M1 issues closed and `master` synchronized with GitHub
