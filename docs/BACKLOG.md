# PhaseBench — Initial Backlog

Status: initial MVP draft  
Goal: ship a responsive dashboard with mock data that recommends the best AI model for Debate, Plan, and Build.

## Project language

English is the sole project language. Source code, identifiers, documentation, commit messages, tests, fixtures, UI copy, and developer comments must be written in English.

## Scope principles

- The MVP uses mock data behind contracts that can later support real data.
- Recommendations depend on the phase and selected priority; there is no universal winner.
- Scores must be explainable, reproducible, and deterministic where possible.
- Desktop is the initial priority without compromising mobile usability.
- Review/Debug, authentication, billing, and real benchmark execution are outside the MVP.

## Definition of done

A task is done when it meets its acceptance criteria, works in light and dark themes and on desktop and mobile, covers relevant loading/empty/error states, passes lint/type checks/tests, and introduces no browser console errors.

## Priorities

- **P0:** required for the MVP demo.
- **P1:** important for a convincing and usable product.
- **P2:** later improvement that does not block the first demo.

## Milestones

| Milestone                | Outcome                                         | Tasks         |
| ------------------------ | ----------------------------------------------- | ------------- |
| M0 — Foundation          | Runnable project with agreed conventions        | PB-001–PB-005 |
| M1 — Core                | Data and recommendation engine                  | PB-006–PB-012 |
| M2 — Dashboard           | Complete MVP experience                         | PB-013–PB-021 |
| M3 — Quality             | Verified, accessible, deployable product        | PB-022–PB-027 |
| M4 — Real-data readiness | Boundaries ready for SQLite and real benchmarks | PB-028–PB-032 |

## M0 — Foundation

M0 is decomposed into branch-sized subtasks in [`docs/M0_PLAN.md`](M0_PLAN.md). Every subtask includes documentation and `AGENTS.md` review before completion.

### PB-001 · Initialize the application

- **Priority:** P0 · **Dependencies:** none
- Create a Next.js application with TypeScript strict mode, Tailwind CSS, App Router, and scripts for development, build, lint, and type checking.
- **Done when:** the documented development command starts an error-free home page and every validation script passes.

### PB-002 · Define conventions and structure

- **Priority:** P0 · **Dependencies:** PB-001
- Separate UI, domain, data access, utilities, and tests; configure import aliases and document the structure in the README.

### PB-003 · Configure code quality

- **Priority:** P0 · **Dependencies:** PB-001
- Configure ESLint and consistent formatting. Document validation commands and require justification for disabled rules.

### PB-004 · Create visual foundations and tokens

- **Priority:** P0 · **Dependencies:** PB-001
- Define reusable colors, typography, spacing, radii, shadows, and provider identities. Ensure accessible contrast and do not rely on color alone.

### PB-005 · Implement light and dark themes

- **Priority:** P0 · **Dependencies:** PB-004
- Add system theme detection, a user control, local persistence, and prevention of incorrect-theme flashing.

## M1 — Domain, data, and recommendations

### PB-006 · Model the domain

- **Priority:** P0 · **Dependencies:** PB-002
- Define extensible types for providers, models, phases, suites, runs, priorities, recommendations, and all specified metrics.

### PB-007 · Design the data repository contract

- **Priority:** P0 · **Dependencies:** PB-006
- Create an asynchronous interface for daily summaries, history, models, and runs. The UI must not import fixtures directly, and SQLite must be replaceable without component redesign.

### PB-008 · Create a coherent mock dataset

- **Priority:** P0 · **Dependencies:** PB-006, PB-007
- Provide reproducible data for 3–5 models, three phases, about five tests per phase, and at least 30 days of history. Values must have explicit units and produce different winners by priority.

### PB-009 · Define normalization formulas

- **Priority:** P0 · **Dependencies:** PB-006
- Normalize quality, cost, speed, and reliability. Document bounds and direction, handle missing/outlier values and division by zero, and add unit tests.

### PB-010 · Implement the recommendation engine

- **Priority:** P0 · **Dependencies:** PB-009
- Rank models per phase for quality, value, speed, reliability, and balanced modes. Centralize weights, define stable tie-breaking, and test every mode and relevant edge case.

### PB-011 · Generate recommendation explanations

- **Priority:** P1 · **Dependencies:** PB-010
- Produce two or three concise, verifiable, metric-based reasons for each winner that reflect the selected priority.

### PB-012 · Calculate the recommended stack

- **Priority:** P0 · **Dependencies:** PB-010
- Select one model per phase and aggregate cost, duration, and token estimates. Totals must equal phase sums and expose units and workload assumptions.

## M2 — Dashboard experience

### PB-013 · Build the application shell and navigation

- **Priority:** P0 · **Dependencies:** PB-004, PB-005
- Build the header, active navigation, responsive layout, and footer for Dashboard, Comparison, and Runs, supporting widths from 360 px upward.

### PB-014 · Build the priority selector

- **Priority:** P0 · **Dependencies:** PB-010, PB-013
- Support Quality, Value, Speed, Reliability, and Balanced. The control must be keyboard accessible, update all recommendations, and persist through the URL or reloads.

### PB-015 · Display phase recommendations

- **Priority:** P0 · **Dependencies:** PB-011, PB-013, PB-014
- Create cards for Debate, Plan, and Build showing winner, provider, score, rationale, essential metrics, and change from the previous day.

### PB-016 · Display the recommended stack

- **Priority:** P0 · **Dependencies:** PB-012, PB-014
- Visualize Debate → Plan → Build with the chosen model and total cost, duration, and tokens in a mobile-readable layout.

### PB-017 · Build the performance history chart

- **Priority:** P0 · **Dependencies:** PB-008, PB-013
- Use Recharts with phase, metric, and date-range controls; clear axes, units, legends, and tooltips; responsive sizing; and an accessible text alternative.

### PB-018 · Build the comparison table

- **Priority:** P0 · **Dependencies:** PB-008, PB-010, PB-013
- Build a responsive table sortable by each metric and filterable by phase/provider, with the current winner clearly identified.

### PB-019 · Build the model detail page

- **Priority:** P1 · **Dependencies:** PB-008, PB-013
- Add a stable URL showing phase strengths, metrics, trends, recent runs, update time, and a clear mock-data label.

### PB-020 · Build the benchmark run history

- **Priority:** P1 · **Dependencies:** PB-008, PB-013
- List date, suite, model, status, cost, duration, and score; filter by phase/model/status; and provide run details with test results and attempts.

### PB-021 · Add states and microinteractions

- **Priority:** P1 · **Dependencies:** PB-014–PB-020
- Add skeletons, empty/error states, tooltips, and restrained transitions without significant layout shift; respect `prefers-reduced-motion`.

## M3 — Quality and delivery

M3 is decomposed into branch-sized subtasks in [`docs/M3_PLAN.md`](M3_PLAN.md). Provider-neutral quality and release preparation can proceed before a hosting provider is selected.

### PB-022 · Add domain unit tests

- **Priority:** P0 · **Dependencies:** PB-009, PB-010, PB-012
- Cover normalization, ranking, tie-breaking, deltas, and aggregates with deterministic normal, extreme, and incomplete inputs.

### PB-023 · Add component and flow tests

- **Priority:** P1 · **Dependencies:** PB-014–PB-020
- Test priority changes, winner updates, comparison filtering/sorting, and navigation to model and run details.

### PB-024 · Perform an accessibility audit

- **Priority:** P0 · **Dependencies:** PB-013–PB-021
- Verify semantics, keyboard flows, logical visible focus, contrast, accessible names, and chart alternatives; leave no critical automated violations.

### PB-025 · Optimize performance

- **Priority:** P1 · **Dependencies:** PB-013–PB-021
- Minimize client components, bundle weight, redundant data, font/image cost, and layout shift; keep the dashboard responsive on a mid-range phone.

### PB-026 · Document the MVP

- **Priority:** P0 · **Dependencies:** PB-001–PB-025
- Document installation, development, testing, builds, technical decisions, scoring, mock data, limitations, and next steps.

### PB-027 · Prepare deployment and CI

- **Priority:** P0 · **Dependencies:** PB-003, PB-022, PB-024, PB-026
- Run lint, type checks, tests, and production builds for proposed changes; document environment variables and reproducible deployment steps.

## M4 — Real data and benchmark readiness

These tasks may follow the first demo.

M4 is decomposed into branch-sized subtasks in [`docs/M4_PLAN.md`](M4_PLAN.md). The milestone proves real-data and benchmark boundaries without authorizing paid provider calls or production scheduling.

### PB-028 · Design the SQLite schema

- **Priority:** P1 · **Dependencies:** PB-006, PB-007
- Define versioned tables and migrations for models, suites, cases, runs, results, metrics, and recommendations, including constraints and indexes needed for reproducibility.

### PB-029 · Implement the SQLite repository

- **Priority:** P2 · **Dependencies:** PB-028
- Implement the PB-007 contract and development seeds. Configuration must switch between fixtures and SQLite, and local database recreation must be documented.

### PB-030 · Define provider adapters

- **Priority:** P1 · **Dependencies:** PB-006
- Define a provider-neutral interface for responses, tokens, cost, latency, errors, attempts, timeouts, retries, rate limits, and cancellation. Never store credentials in the repository.

### PB-031 · Design the isolated benchmark runner

- **Priority:** P1 · **Dependencies:** PB-028, PB-030
- Prototype load suite → execute → evaluate → persist. Record model/prompt/suite/configuration versions, separate fixed and hidden sets, and define time, cost, concurrency, and retry limits.

### PB-032 · Define automated validation and AI judges

- **Priority:** P1 · **Dependencies:** PB-031
- Prioritize deterministic tests, version judge rubrics with structured reasoning, and document bias, judge/candidate conflicts, and calibration.

## Recommended order for the first demo

1. PB-001–PB-005: technical and visual foundation.
2. PB-006–PB-010: domain, fixtures, and recommendation engine.
3. PB-013–PB-018: dashboard and comparison.
4. PB-011–PB-012 and PB-019–PB-021: explanations, stack, and detail views.
5. PB-022–PB-027: verification, documentation, and deployment.

## Initially out of scope

- Real provider integrations and scheduled production runs.
- User accounts, billing, alerts, notifications, and team collaboration.
- Review and Debug phases.
- Public exposure of sensitive prompts or outputs.
- A complete administration panel.

## Open product decisions

- Which 3–5 models should the initial dataset represent?
- What exact weights should each recommendation mode use?
- What unit of work should estimate full-stack cost?
- Which history period and time ranges should the demo offer?
- Which deployment provider should host the MVP?
