# Domain Model

PhaseBench domain code lives in `src/domain` and represents product concepts without depending on React, Next.js, storage, or network clients.

## Identity and labels

Provider and model identifiers are opaque strings because the catalog will grow as vendors and versions change. Consumers must display the accompanying name rather than deriving copy from an identifier. Unknown providers receive the generic visual identity, so adding a catalog entry does not require redesigning existing components.

The three initial phase identifiers are deliberately closed: `debate`, `plan`, and `build`. Expanding the workflow is a product decision because it affects benchmarks, recommendations, and navigation.

## Recommendation priorities

The supported priority identifiers are:

| Identifier    | User-facing name | Intent                                 |
| ------------- | ---------------- | -------------------------------------- |
| `quality`     | Best quality     | Strongest task outcomes                |
| `value`       | Best value       | Quality delivered for estimated cost   |
| `speed`       | Fastest          | Shortest end-to-end response time      |
| `reliability` | Most reliable    | Repeatable results and successful runs |
| `balanced`    | Balanced         | A mix of all four outcomes             |

Priority labels and descriptions are presentation-ready catalog data. Scoring weights are defined separately so copy changes cannot alter recommendation behavior.

## Model lifecycle

Models have stable IDs, provider ownership, a display name, a version, and an `active`, `preview`, or `retired` status. An optional ISO release date supports historical context without making catalog inclusion depend on a known release date.

## Benchmark vocabulary

A benchmark suite belongs to one development phase and carries an explicit version. Its cases declare whether they belong to the longitudinal `fixed` set or the rotating `hidden` set, plus one of three evaluation methods: automated tests, an AI judge, or a hybrid of both.

Every run records the suite and model IDs, timestamps, status, runner and prompt versions, and the model configuration needed for reproduction. Case results record status and attempt count alongside quality, automated-test, judge, cost, latency, and token values. Units appear in field names (`costUsd`, `latencyMs`, `inputTokens`, and `outputTokens`) rather than relying on caller knowledge.

Scores are stored on the 0–100 scale. Counts and monetary or timing measurements are non-negative. These constraints are domain invariants; data-source implementations must validate external or fixture data before returning it.

## Daily metrics

Each daily model summary belongs to one model and phase and records how many completed runs support it. Metrics are nullable so incomplete upstream data remains distinguishable from a real zero.

| Metric                  | Unit         | Meaning                           |
| ----------------------- | ------------ | --------------------------------- |
| `qualityScore`          | 0–100 score  | Aggregate task quality            |
| `taskPassRate`          | percent      | Tasks completed successfully      |
| `automatedTestPassRate` | percent      | Deterministic tests passed        |
| `judgeScore`            | 0–100 score  | Versioned AI-judge assessment     |
| `costUsd`               | USD          | Estimated cost per benchmark task |
| `latencyMs`             | milliseconds | End-to-end response time          |
| `inputTokens`           | tokens       | Input tokens per task             |
| `outputTokens`          | tokens       | Output tokens per task            |
| `averageAttempts`       | attempts     | Mean attempts per completed task  |
| `stabilityScore`        | 0–100 score  | Consistency between repeated runs |

Raw metrics remain separate from the normalized quality, value, speed, and reliability dimensions used for ranking.

## Recommendation results

A phase recommendation contains the dated, priority-specific ranking, its winner, normalized dimensions, and metric-backed reasons. Scores use a 0–100 scale and ranks are one-based. An optional score delta represents change from the previous daily recommendation under the same phase and priority.

A recommended stack combines one phase estimate for Debate, Plan, and Build under an explicit workload. A complete stack exposes totals for USD cost, milliseconds, input tokens, and output tokens. If any phase is unavailable, the result is `incomplete`, lists the missing phases, and deliberately exposes no partial total as though it represented the full workflow.
