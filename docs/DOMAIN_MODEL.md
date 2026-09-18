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
