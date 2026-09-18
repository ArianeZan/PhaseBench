# Architecture

PhaseBench uses explicit source boundaries so product rules can evolve independently from rendering and storage choices.

## Source map

| Path | Responsibility | May depend on |
| --- | --- | --- |
| `src/app` | Next.js routes, layouts, metadata, and route-level composition | `components`, `domain`, `data`, `lib` |
| `src/components` | Reusable presentation and interaction components | `domain`, `lib` |
| `src/domain` | PhaseBench concepts, types, and deterministic business rules | other domain modules only |
| `src/data` | Repository implementations, fixtures, database access, and provider adapters | `domain`, `lib` |
| `src/lib` | Small framework-neutral technical utilities | other `lib` modules only |

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

The product introduction uses `developmentPhases` from the domain boundary and renders each phase with a reusable component. Data and shared-utility boundaries contain no speculative implementation; they document where concrete M1 capabilities will live when those capabilities are introduced.

The `@/*` alias resolves to `src/*` and should be used for imports that cross these top-level boundaries. Relative imports remain appropriate within a tightly related directory.
