# Data Boundary

Repository contracts, fixture implementations, SQLite access, and provider adapters belong here. UI components must not import fixtures or storage clients directly.

`BenchmarkRepository` is the product's read gateway. It exposes asynchronous queries for the benchmark catalog, filtered models, the latest or dated daily snapshot, date-ranged history, and benchmark runs. Route-level composition may request this contract; reusable components receive serializable domain values instead.

## Query behavior

- Dates use ISO `YYYY-MM-DD` strings and date ranges are inclusive.
- Omitting the snapshot date asks for the latest available complete date.
- Empty filter arrays match no records; omitted filters do not restrict records.
- Single-entity lookups return `null` when the ID does not exist.
- Implementations return chronological history and newest-first runs.
- Returned arrays and values are treated as immutable snapshots.

The interface deliberately contains no fixture, SQL, React, or Next.js types. A later SQLite implementation must preserve these semantics.

## Composition

`createRepositoryAccessor` turns a repository factory into a lazy, process-local singleton accessor. The data boundary owns both the factory selection and accessor. Routes import only `getBenchmarkRepository` from `src/data/repository`; they do not instantiate adapters. Reusable components never import either entry point or repository contract.

Keeping factory selection out of the contract lets mock and SQLite implementations use different construction details while preserving the same consumer API. The accessor itself has no environment or framework dependency and can be constructed independently in tests.

The current entry point selects `createMockBenchmarkRepository`. That adapter validates every fixture relationship on first access, implements documented filters, returns history in chronological order and runs newest first, and returns `null` for missing single records. A future SQLite adapter replaces only the factory selection.

`loadHistoryData` prepares chart-ready history without coupling visualization code to the repository. It supports 7, 14, and 30-day inclusive ranges and a curated set of quality, pass-rate, cost, latency, and stability metrics. Every series follows catalog model order, declares its unit, and contains one point per requested date; absent summaries and missing metric values remain explicit `null` gaps.
