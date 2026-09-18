# Architecture

PhaseBench uses explicit source boundaries so product rules can evolve independently from rendering and storage choices.

## Source map

| Path             | Responsibility                                                               | May depend on                         |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| `src/app`        | Next.js routes, layouts, metadata, and route-level composition               | `components`, `domain`, `data`, `lib` |
| `src/components` | Reusable presentation and interaction components                             | `domain`, `lib`                       |
| `src/domain`     | PhaseBench concepts, types, and deterministic business rules                 | other domain modules only             |
| `src/data`       | Repository implementations, fixtures, database access, and provider adapters | `domain`, `lib`                       |
| `src/lib`        | Small framework-neutral technical utilities                                  | other `lib` modules only              |

## Dependency direction

```text
app ───────────────→ components ───→ domain
 │                        │
 ├───────────────→ data ──┘
 │                  │
 └────────────────→ lib
```

Dependencies should point toward stable concepts:

- Domain code must not import React, Next.js, UI components, or data-source implementations.
- Components may use domain types but must not access fixtures, databases, or provider SDKs directly.
- Route modules compose the UI and request data through the data boundary.
- Data modules translate external or persisted representations into domain concepts.
- Shared utilities must remain free of product rules.

## Current implementation

The product introduction uses `developmentPhases` from the domain boundary and renders each phase with a reusable component. M1 domain contracts describe the benchmark and recommendation vocabulary. The data boundary exposes `BenchmarkRepository`, an asynchronous read contract that keeps fixture and future SQLite details out of routes and components.

The active adapter is selected in `src/data/repository.ts`. Routes call `getBenchmarkRepository`; components receive its serializable results through props. The current mock adapter validates fixture relationships before serving data.

The recommendation flow remains framework-neutral: repository summaries enter domain normalization, ranking, explanation, and stack functions. `recommendByPhase` is the orchestration entry point for the three phase recommendations; `calculateRecommendedStack` applies the same priority to the complete workflow.

`loadDashboardData` is the route-facing application query for the dashboard. It reads one catalog and one daily snapshot, then derives phase recommendations and the stack under one validated priority. Components receive this prepared data and never invoke repositories or scoring rules.

The `@/*` alias resolves to `src/*` and should be used for imports that cross these top-level boundaries. Relative imports remain appropriate within a tightly related directory.

Implementation and naming conventions for these boundaries are maintained in [`src/AGENTS.md`](../src/AGENTS.md).
