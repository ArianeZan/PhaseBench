# Reproducible Benchmark Data Design

## Purpose

The PhaseBench SQLite store must answer two different needs without weakening either one:

1. maintain a current catalog that the product can browse; and
2. preserve immutable evidence that explains exactly how a benchmark and recommendation were produced.

This document defines the logical schema for PB-028B. It intentionally precedes executable migrations so table ownership, identities, constraints, and query requirements are reviewable before they become storage behavior.

## Design rules

- SQLite is an adapter behind `BenchmarkRepository`; domain and UI code never depend on SQL rows.
- Stable business identities and immutable versions are separate records.
- Completed execution evidence is append-only. Corrections create new runs or aggregates instead of rewriting history.
- Every stored measurement names its unit through the column name.
- UTC timestamps use ISO 8601 text with millisecond precision. Calendar dates use `YYYY-MM-DD` text.
- Enumeration values are constrained to the corresponding domain vocabulary.
- Foreign-key enforcement is enabled for every connection.
- Hidden case definitions and provider credentials are never stored in product-facing query results or logs.
- JSON is reserved for provider or configuration detail that is not queried relationally. Canonical JSON is paired with a SHA-256 hash whenever it contributes to reproducibility.

## Identity and mutability

| Record                    | Identity                                                | Mutability policy                                                        |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Provider                  | `provider_id`                                           | Display metadata may change                                              |
| Model                     | `model_id`                                              | Display metadata and lifecycle status may change                         |
| Model version             | `model_version_id`                                      | Immutable after use by a run                                             |
| Suite                     | `suite_id`                                              | Display metadata may change                                              |
| Suite version             | `suite_version_id`; unique `(suite_id, version)`        | Immutable                                                                |
| Case version              | `case_version_id`; unique `(suite_version_id, case_id)` | Immutable; no secret prompt body required in the web database            |
| Runner, prompt, evaluator | their version IDs                                       | Immutable definitions identified by hashes                               |
| Run                       | `run_id`                                                | State transitions until terminal; execution inputs then become immutable |
| Case result and attempts  | generated IDs within a run                              | Append during execution; immutable after the run is terminal             |
| Daily summary             | `(summary_date, phase_id, model_version_id)`            | Replaced only by a newer derivation version with recorded provenance     |
| Recommendation            | `(date, phase_id, priority_id, derivation_version)`     | Immutable calculated evidence                                            |

Opaque text IDs remain application-assigned so fixtures and SQLite can expose the same domain identities. Internal integer row IDs may be added only as an implementation optimization; they must not escape the adapter.

## Logical tables

### Catalog

`providers`

- `provider_id` primary key, `name`, optional `website_url`
- `created_at`, `updated_at`

`models`

- `model_id` primary key and `provider_id` foreign key
- `name`, `status` constrained to `active | preview | retired`, optional `released_on`
- `created_at`, `updated_at`

`model_versions`

- `model_version_id` primary key and `model_id` foreign key
- `version`, provider-facing immutable `provider_model_key`
- optional `knowledge_cutoff_on`, `created_at`
- unique `(model_id, version)`

`benchmark_suites`

- `suite_id` primary key
- current display `name`, `description`, and `created_at`, `updated_at`

`benchmark_suite_versions`

- `suite_version_id` primary key and `suite_id` foreign key
- `phase_id` constrained to `debate | plan | build`
- `version`, frozen `name`, `description`, `definition_sha256`, `created_at`
- unique `(suite_id, version)` and unique `definition_sha256`

`benchmark_case_versions`

- `case_version_id` primary key, stable `case_id`, and `suite_version_id` foreign key
- frozen `name`, safe `description`, `benchmark_set`, and `evaluation_method`
- `position`, `max_attempts`, `expected_input_tokens`, `expected_output_tokens`
- `definition_sha256`; optional `protected_definition_ref` points to access-controlled runner storage rather than containing hidden material
- unique `(suite_version_id, case_id)` and `(suite_version_id, position)`

### Versioned execution inputs

`runner_versions`, `prompt_versions`, and `evaluator_versions` each store:

- an opaque primary version ID and human-readable version
- a `definition_sha256`
- `created_at`
- optional safe metadata JSON

Prompt and evaluator bodies may live in a protected runner package or secret-capable artifact store. The database requires their immutable hash and version identity, not public content.

### Runs and raw evidence

`benchmark_runs`

- `run_id` primary key
- foreign keys to `suite_version_id`, `model_version_id`, `runner_version_id`, and `prompt_version_id`
- `status` constrained to `queued | running | completed | failed | cancelled`
- `queued_at`, optional `started_at`, optional `completed_at`
- canonical `model_configuration_json`, `configuration_sha256`
- optional failure classification and safe diagnostic summary
- checks enforce chronological timestamps and terminal completion timestamps

`benchmark_case_results`

- `result_id` primary key; `run_id` and `case_version_id` foreign keys
- `status` constrained to `passed | failed | error`
- `attempt_count`, optional `evaluator_version_id`
- safe diagnostic summary and `created_at`
- unique `(run_id, case_version_id)`; the referenced case must belong to the run's suite version, enforced by a composite relationship in the physical schema

`benchmark_attempts`

- `attempt_id` primary key; `result_id` foreign key; one-based `attempt_number`
- terminal outcome, start and completion timestamps, optional provider request ID
- input/output token counts, `cost_usd`, `latency_ms`, and safe error classification
- unique `(result_id, attempt_number)`

`benchmark_result_metrics`

- one row per `result_id`
- `quality_score`, `automated_tests_passed`, `automated_tests_total`, optional `judge_score`
- `cost_usd`, `latency_ms`, `input_tokens`, `output_tokens`
- scores constrained to 0–100; counts, duration, tokens, and cost are non-negative; passed tests cannot exceed total tests

Attempts retain operational evidence. Result metrics retain the normalized case outcome used by product queries. The result totals must be derived from recorded attempts or evaluator output, never silently estimated by the read adapter.

### Derived evidence

`daily_model_summaries`

- `summary_date`, `phase_id`, `model_version_id`, and `derivation_version` form the primary identity
- `completed_run_count` and every nullable metric currently defined by `DailyModelSummary`
- `source_cutoff_at`, `created_at`, and `input_evidence_sha256`
- metric constraints match domain invariants

`recommendations`

- `recommendation_id` primary key
- `recommendation_date`, `phase_id`, `priority_id`, `derivation_version`
- `source_summary_sha256`, `created_at`
- unique `(recommendation_date, phase_id, priority_id, derivation_version)`

`recommendation_entries`

- `recommendation_id` and `model_version_id` foreign keys
- one-based `rank`, total score and normalized quality, value, speed, and reliability scores
- structured, safe explanation JSON
- primary key `(recommendation_id, model_version_id)` and unique `(recommendation_id, rank)`

Recommendations remain derivable, but storing their versioned inputs and output makes the daily published decision auditable even after scoring rules change.

## Required query indexes

PB-028B should create indexes that support the existing repository without speculative indexing:

- models by provider and lifecycle status;
- suite versions by phase and suite version;
- case versions by suite and position;
- runs by start time descending, model version, suite version, and status;
- results by run and case;
- summaries by date, phase, and model version;
- recommendations by date, phase, and priority.

Index names use `idx_<table>_<columns>`. Uniqueness that protects an invariant uses a named unique constraint or `uq_<table>_<meaning>` index.

## Repository mapping

| `BenchmarkRepository` operation | SQLite read model                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `getCatalog`                    | current providers/models plus the selected current suite versions and ordered cases |
| `getModels`, `getModelById`     | model catalog joined to its selected current version                                |
| `getDailySnapshot`              | latest derivation per requested date/phase/model, mapped to stable model IDs        |
| `getHistory`                    | inclusive date range over latest derivations, ordered chronologically               |
| `getBenchmarkRuns`              | runs joined to version identities and ordered results, newest run first             |
| `getBenchmarkRunById`           | one run with ordered case results, mapped back to the existing domain contract      |

The current read contract deliberately exposes stable IDs and safe product evidence. Runner-specific writes, raw attempts, and protected definitions will use separate command-side interfaces rather than expanding a UI-oriented repository into an unrestricted persistence API.

## Migration and retention contract

- `schema_migrations` records a monotonically increasing migration ID, immutable name, SHA-256 checksum, and application timestamp.
- A migration runs once inside a transaction and fails if an already-applied checksum differs.
- Migrations are forward-only. Development databases may be recreated; released evidence requires backup and a compatible forward fix.
- Destructive column or table changes require an explicit copy-and-verify migration and release-specific rollback analysis.
- Foreign-key checks and an integrity check run after development migration and in automated tests.
- Catalog retirement never cascades into runs. Evidence relationships use restrictive deletion; temporary operational rows may cascade only when their parent run has never reached a terminal state.
- No default time-based deletion applies to completed runs, results, metrics, summaries, or recommendations. A future retention decision must preserve aggregate provenance and compliance requirements.

## Deliberate boundaries

PB-028B uses the `better-sqlite3` Node adapter for the executable migration foundation because it supports the pinned Node 20 runtime without adding an ORM. This design does not choose a production volume, scheduler, provider SDK, or protected-content store. Production persistence and paid provider access remain separate decisions.
