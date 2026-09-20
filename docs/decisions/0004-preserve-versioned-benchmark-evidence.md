# ADR 0004: Preserve versioned benchmark evidence

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

PhaseBench currently serves coherent synthetic fixtures through an asynchronous repository contract. Real benchmark runs will introduce catalog changes, model aliases, prompt revisions, suite revisions, evaluator changes, retries, and recalculated recommendations. Storing only the latest representation would make earlier results impossible to explain or reproduce.

SQLite is the agreed MVP persistence target, but storage details must not leak into domain rules or product components. Hidden benchmark material also cannot become public merely because execution metadata is queryable by the dashboard.

## Decision

Use SQLite behind the existing data boundary and separate stable catalog identities from immutable version records. Runs reference exact model, suite, runner, prompt, and configuration versions. Completed run evidence, derived daily summaries, and published recommendations are append-only and retain input hashes and derivation versions.

Keep the existing `BenchmarkRepository` as a read-oriented product contract. Add future command-side persistence interfaces for runner writes rather than exposing raw attempts, protected case definitions, or mutation operations to UI consumers.

Store only safe metadata and immutable hashes for protected prompts, rubrics, and hidden case definitions. Their bodies remain in access-controlled runner storage.

Use ordered, checksummed, forward-only migrations. Local development databases may be recreated; released evidence requires backup and forward-compatible migration planning.

## Consequences

### Positive

- Historical results remain attributable to exact execution inputs.
- Catalog copy can evolve without rewriting completed evidence.
- Fixture and SQLite repositories can satisfy the same product read contract.
- Hidden benchmark content stays outside normal product reads.
- Recommendation changes can be audited across scoring versions.

### Negative

- More tables and joins are required than a latest-state-only schema.
- Version creation and retention rules must be enforced by write workflows.
- Corrections consume new records rather than editing historical rows.
- Protected definition storage needs a separate operational decision.

## Follow-up

PB-028B will implement the initial migrations and constraint tests. PB-029 will implement repository reads and safe local source selection. PB-031 will define the command-side runner persistence lifecycle.
