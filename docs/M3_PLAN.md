# M3 — Quality and Delivery Execution Plan

## Outcome

M3 ends with a tested, accessible, measured, documented, and continuously verified MVP that can be deployed reproducibly. Work remains split into business-readable, independently reviewable branches. Documentation and applicable `AGENTS.md` guidance are reviewed before every task closes.

The hosting provider remains an explicit product decision. Provider-neutral deployment preparation and CI can complete before that choice; the final public deployment must not be inferred without approval.

## PB-022 — Strengthen domain confidence

### PB-022A · Protect recommendations at the boundaries

- **Status:** Completed
- **Branch:** `codex/pb-022a-protected-recommendation-boundaries`
- **GitHub:** [#51](https://github.com/ArianeZan/PhaseBench/issues/51)
- Cover normalization and ranking with zeroes, limits, missing dimensions, ties, and input-order changes.
- **Acceptance:** deterministic tests demonstrate defined behavior for normal, extreme, incomplete, and tied inputs.

### PB-022B · Protect changes and workflow estimates

- **Status:** Completed
- **Branch:** `codex/pb-022b-trusted-changes-and-estimates`
- **GitHub:** [#52](https://github.com/ArianeZan/PhaseBench/issues/52)
- Extend delta, explanation, and stack aggregate coverage across missing history, changed winners, incomplete phases, and scaled workloads.
- **Acceptance:** every public recommendation aggregate has normal and incomplete-path coverage with explicit units.

## PB-023 — Protect user journeys

### PB-023A · Keep decision screens accurate

- **Status:** Completed
- **Branch:** `codex/pb-023a-accurate-decision-screens`
- **GitHub:** [#53](https://github.com/ArianeZan/PhaseBench/issues/53)
- Add component tests for priority selection, recommendations, workflow totals, history alternatives, comparison winners, and empty states.
- **Acceptance:** accessible names and user-visible values are asserted without coupling tests to styling internals.

### PB-023B · Keep exploration journeys connected

- **Status:** Completed
- **Branch:** `codex/pb-023b-connected-exploration-journeys`
- **GitHub:** [#54](https://github.com/ArianeZan/PhaseBench/issues/54)
- Test URL state, filtering, sorting, and navigation through model and run details, including not-found routes.
- **Acceptance:** core dashboard → comparison/model → run journeys are covered by deterministic integration or browser tests.

## PB-024 — Prove accessibility

### PB-024A · Eliminate automated accessibility blockers

- **Status:** Completed
- **Branch:** `codex/pb-024a-no-accessibility-blockers`
- **GitHub:** [#55](https://github.com/ArianeZan/PhaseBench/issues/55)
- Run automated accessibility checks across primary and detail routes in both themes.
- **Acceptance:** no critical or serious automated violations remain, and exceptions are documented with evidence.

### PB-024B · Verify inclusive keyboard and visual use

- **Status:** Completed
- **Branch:** `codex/pb-024b-inclusive-keyboard-and-visual-use`
- **GitHub:** [#56](https://github.com/ArianeZan/PhaseBench/issues/56)
- Audit landmarks, heading order, names, focus order, touch targets, contrast, reduced motion, and chart alternatives.
- **Acceptance:** keyboard-only flows work at 360 px and desktop width, with results recorded in an audit report.

## PB-025 — Keep the experience fast

### PB-025A · Establish a performance baseline

- **Status:** Completed
- **Branch:** `codex/pb-025a-measured-performance-baseline`
- **GitHub:** [#57](https://github.com/ArianeZan/PhaseBench/issues/57)
- Measure route output, client boundaries, bundle weight, layout stability, and data duplication.
- **Acceptance:** a reproducible baseline identifies the largest costs and defines explicit MVP budgets.

### PB-025B · Make the dashboard lightweight

- **Status:** Completed
- **Branch:** `codex/pb-025b-lightweight-dashboard-delivery`
- **GitHub:** [#58](https://github.com/ArianeZan/PhaseBench/issues/58)
- Address measured high-value costs without weakening accessibility or product behavior.
- **Acceptance:** budgets pass on a production build and changes are supported by before/after evidence.

## PB-026 — Make the MVP understandable

### PB-026A · Make local development reproducible

- **Status:** Completed
- **Branch:** `codex/pb-026a-reproducible-local-development`
- **GitHub:** [#59](https://github.com/ArianeZan/PhaseBench/issues/59)
- Document prerequisites, installation, commands, project structure, testing, builds, and troubleshooting.
- **Acceptance:** a new contributor can run and verify the MVP from the repository documentation alone.

### PB-026B · Explain product evidence and limitations

- **Status:** Completed
- **Branch:** `codex/pb-026b-clear-product-evidence`
- **GitHub:** [#60](https://github.com/ArianeZan/PhaseBench/issues/60)
- Consolidate scoring, synthetic data, recommendation assumptions, current limitations, and real-data next steps.
- **Acceptance:** documentation never presents synthetic results as real provider evidence and links to the relevant technical sources.

## PB-027 — Make delivery repeatable

### PB-027A · Guard every proposed change

- **Status:** Completed
- **Branch:** `codex/pb-027a-guarded-proposed-changes`
- **GitHub:** [#61](https://github.com/ArianeZan/PhaseBench/issues/61)
- Add CI that installs deterministically and runs the repository verification command for proposed changes.
- **Acceptance:** CI uses the declared Node version, caches safely, and fails on formatting, lint, type, test, or build errors.

### PB-027B · Prepare a provider-neutral release

- **Status:** Completed
- **Branch:** `codex/pb-027b-repeatable-release-preparation`
- **GitHub:** [#62](https://github.com/ArianeZan/PhaseBench/issues/62)
- Document environment variables, build/start commands, health checks, rollback expectations, and hosting-provider decision criteria.
- **Acceptance:** a release can be reproduced without secrets in Git; publishing waits for the explicit hosting choice.

## M3 completion checklist

- [x] PB-022A–PB-022B merged
- [x] PB-023A–PB-023B merged
- [x] PB-024A–PB-024B merged
- [x] PB-025A–PB-025B merged
- [x] PB-026A–PB-026B merged
- [x] PB-027A–PB-027B merged
- [x] Automated verification and accessibility checks pass
- [x] Performance budgets and audit evidence are documented
- [x] Contributor and release documentation are complete
- [x] All M3 issues are closed and `master` is synchronized with GitHub
