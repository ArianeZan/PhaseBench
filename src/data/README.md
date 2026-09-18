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
