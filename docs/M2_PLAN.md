# M2 — Dashboard Execution Plan

## Outcome

M2 turns the trusted recommendation core into a responsive product experience. Users can choose a priority, understand the best model for each phase, inspect the full recommended stack, explore history, compare models, and review model and run details.

Every subtask uses one short-lived branch, updates its GitHub issue and this plan together, runs `npm run verify`, and reviews documentation plus applicable `AGENTS.md` guidance.

## PB-013 — Build the application shell and navigation

### PB-013A · Give every product screen a shared home

- **Branch:** `codex/pb-013a-shared-product-shell`
- **GitHub:** [#33](https://github.com/ArianeZan/PhaseBench/issues/33)
- **Status:** Completed on 2026-09-18
- **Dependencies:** M1
- Create the responsive header, content frame, and footer shared by product routes.
- **Acceptance:** 360 px and desktop layouts remain readable; theme control and product identity are consistently available.

### PB-013B · Make product areas easy to reach

- **Branch:** `codex/pb-013b-clear-product-navigation`
- **GitHub:** [#34](https://github.com/ArianeZan/PhaseBench/issues/34)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-013A
- Add accessible navigation for Dashboard, Comparison, and Runs with a reliable active state.
- **Acceptance:** native links work without JavaScript, keyboard focus is visible, and the current area is announced.

## PB-014 — Build the priority selector

### PB-014A · Let users preserve their recommendation priority

- **Branch:** `codex/pb-014a-persistent-priority-choice`
- **GitHub:** [#35](https://github.com/ArianeZan/PhaseBench/issues/35)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-010B, PB-013A
- Add a keyboard-accessible control for all five modes and persist the choice in the URL.
- **Acceptance:** invalid or absent values fall back to Balanced; reload and shared URLs preserve valid choices.

### PB-014B · Keep every dashboard recommendation in sync

- **Branch:** `codex/pb-014b-synchronized-recommendations`
- **GitHub:** [#36](https://github.com/ArianeZan/PhaseBench/issues/36)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-014A
- Resolve the selected priority on the server and feed one snapshot into phase and stack calculations.
- **Acceptance:** one priority change updates all recommendation outputs without duplicating scoring in components.

## PB-015 — Display phase recommendations

### PB-015A · Show the best model for every phase

- **Branch:** `codex/pb-015a-phase-winner-cards`
- **GitHub:** [#37](https://github.com/ArianeZan/PhaseBench/issues/37)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-014B, PB-011A
- Build responsive Debate, Plan, and Build cards with winner, provider, score, reasons, and essential metrics.
- **Acceptance:** cards consume prepared view data and clearly label synthetic results.

### PB-015B · Show how recommendations changed

- **Branch:** `codex/pb-015b-daily-recommendation-change`
- **GitHub:** [#38](https://github.com/ArianeZan/PhaseBench/issues/38)
- **Dependencies:** PB-015A
- Compare the current and previous daily ranking under the same priority.
- **Acceptance:** score and rank movement are deterministic, unit-tested, and expressed without color-only meaning.

## PB-016 — Display the recommended stack

### PB-016A · Summarize the complete AI workflow

- **Branch:** `codex/pb-016a-recommended-workflow-summary`
- **GitHub:** [#39](https://github.com/ArianeZan/PhaseBench/issues/39)
- **Dependencies:** PB-014B, PB-012A
- Visualize Debate → Plan → Build and show total cost, duration, and tokens.
- **Acceptance:** phase order and totals remain clear on mobile, and workload assumptions are visible.

## PB-017 — Build the performance history chart

### PB-017A · Prepare trustworthy history series

- **Branch:** `codex/pb-017a-trustworthy-history-series`
- **GitHub:** [#40](https://github.com/ArianeZan/PhaseBench/issues/40)
- **Dependencies:** PB-008C
- Transform repository history into dated, unit-aware series for supported phase, metric, and range choices.
- **Acceptance:** gaps remain explicit, ordering is stable, and transformation tests cover filters and ranges.

### PB-017B · Make model trends understandable

- **Branch:** `codex/pb-017b-accessible-performance-trends`
- **GitHub:** [#41](https://github.com/ArianeZan/PhaseBench/issues/41)
- **Dependencies:** PB-017A, PB-013A
- Add Recharts visualization, controls, legends, tooltips, units, and a text/table alternative.
- **Acceptance:** chart resizes without overflow and the same values remain available without vision or pointer use.

## PB-018 — Build the comparison table

### PB-018A · Compare every model at a glance

- **Branch:** `codex/pb-018a-model-comparison-table`
- **GitHub:** [#42](https://github.com/ArianeZan/PhaseBench/issues/42)
- **Dependencies:** PB-014B
- Build a responsive comparison with provider, score, quality, cost, latency, and reliability.
- **Acceptance:** the current winner is identified in text and narrow screens retain all information.

### PB-018B · Help users find the right comparison

- **Branch:** `codex/pb-018b-focused-model-comparisons`
- **GitHub:** [#43](https://github.com/ArianeZan/PhaseBench/issues/43)
- **Dependencies:** PB-018A
- Add URL-backed phase/provider filters and sortable columns.
- **Acceptance:** filters and sort are keyboard accessible, deterministic, shareable, and resilient to invalid values.

## PB-019 — Build the model detail page

### PB-019A · Give every model a stable destination

- **Branch:** `codex/pb-019a-stable-model-destinations`
- **GitHub:** [#44](https://github.com/ArianeZan/PhaseBench/issues/44)
- **Dependencies:** PB-008C, PB-013B
- Add model detail routes with stable IDs, metadata, not-found handling, and links from recommendations/comparison.
- **Acceptance:** known models render at stable URLs and unknown IDs return the framework not-found experience.

### PB-019B · Explain each model's performance profile

- **Branch:** `codex/pb-019b-model-performance-profile`
- **GitHub:** [#45](https://github.com/ArianeZan/PhaseBench/issues/45)
- **Dependencies:** PB-019A, PB-017A
- Show phase strengths, latest metrics, trends, recent runs, update time, and synthetic-data notice.
- **Acceptance:** all sections use repository data and remain useful with missing metrics or runs.

## PB-020 — Build the benchmark run history

### PB-020A · Make benchmark activity traceable

- **Branch:** `codex/pb-020a-traceable-benchmark-history`
- **GitHub:** [#46](https://github.com/ArianeZan/PhaseBench/issues/46)
- **Dependencies:** PB-008C, PB-013B
- List run date, suite, model, status, cost, duration, and quality with URL-backed filters.
- **Acceptance:** phase/model/status filters are shareable and the list is usable at 360 px.

### PB-020B · Show the evidence behind a run

- **Branch:** `codex/pb-020b-benchmark-run-evidence`
- **GitHub:** [#47](https://github.com/ArianeZan/PhaseBench/issues/47)
- **Dependencies:** PB-020A
- Add run detail routes with configuration, case results, attempts, tests, judge evidence, cost, and latency.
- **Acceptance:** unknown IDs return not-found and every displayed value has context and units.

## PB-021 — Add states and microinteractions

### PB-021A · Keep every screen informative in unusual states

- **Branch:** `codex/pb-021a-resilient-screen-states`
- **GitHub:** [#48](https://github.com/ArianeZan/PhaseBench/issues/48)
- **Dependencies:** PB-014–PB-020
- Add route loading, empty, error, and missing-data states without layout collapse.
- **Acceptance:** states use clear English actions and preserve page structure.

### PB-021B · Add calm, accessible feedback

- **Branch:** `codex/pb-021b-accessible-interface-feedback`
- **GitHub:** [#49](https://github.com/ArianeZan/PhaseBench/issues/49)
- **Dependencies:** PB-021A
- Add restrained hover, focus, selection, and tooltip behavior that respects reduced motion.
- **Acceptance:** interactions work with keyboard/touch and introduce no essential motion or layout shift.

### PB-021C · Validate the complete dashboard experience

- **Branch:** `codex/pb-021c-trusted-dashboard-experience`
- **GitHub:** [#50](https://github.com/ArianeZan/PhaseBench/issues/50)
- **Dependencies:** PB-021B
- Validate routes, URLs, themes, keyboard flows, 360 px and desktop layouts, console output, and documentation.
- **Acceptance:** `npm run verify` passes, browser flows are clean, M2 docs match implementation, and all M2 issues are closed.

## M2 completion checklist

- [ ] PB-013A–PB-013B merged
- [ ] PB-014A–PB-014B merged
- [ ] PB-015A–PB-015B merged
- [ ] PB-016A merged
- [ ] PB-017A–PB-017B merged
- [ ] PB-018A–PB-018B merged
- [ ] PB-019A–PB-019B merged
- [ ] PB-020A–PB-020B merged
- [ ] PB-021A–PB-021C merged
- [ ] Dashboard routes verified in both themes at 360 px and desktop width
- [ ] Unit/integration tests and production build pass
- [ ] Documentation and applicable `AGENTS.md` files reviewed
- [ ] All M2 issues closed and `master` synchronized with GitHub
