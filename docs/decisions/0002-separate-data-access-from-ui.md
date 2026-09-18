# 0002 — Separate data access from UI

- **Status:** Accepted
- **Date:** 2026-09-18
- **Owners:** PhaseBench maintainers

## Context

The MVP will use simulated benchmark data, while later versions will read historical results from SQLite and execute real provider benchmarks. Allowing UI components to import fixtures directly would make the mock source part of the presentation architecture and increase the cost of replacing it.

## Decision

UI code will request application data through asynchronous repository contracts owned by the data boundary. Mock fixtures and the future SQLite implementation will satisfy the same contracts. Data implementations translate stored or external representations into domain concepts before returning them.

`BenchmarkRepository` defines product-oriented queries for the catalog, daily snapshot, history, models, and runs. The active adapter is constructed behind a lazy repository accessor owned by the data boundary. Routes receive the configured repository through that entry point; components receive domain data as props.

## Consequences

### Positive

- Mock data can be replaced without redesigning components.
- Provider and database details remain outside presentation code.
- Repository contracts provide clear seams for deterministic tests.

### Negative

- Data access requires an explicit mapping layer.
- Poorly designed contracts could mirror either the UI or database too closely.

### Follow-up

- Product-oriented contracts and the composition pattern were defined in PB-007.
- Keep fixtures behind the mock repository implementation in PB-008.
