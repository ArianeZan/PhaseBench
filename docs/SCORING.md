# Scoring and Normalization

PhaseBench converts raw benchmark metrics into stable 0–100 scores before applying recommendation priorities. The formulas use documented absolute bounds rather than the minimum and maximum in the current candidate list, so adding or removing a model does not silently change every existing score.

Current inputs are synthetic. [Product Evidence and Limitations](PRODUCT_EVIDENCE.md) explains the evidence boundary and real-data path; this document is the source of truth for calculation behavior.

## Base normalization

For a metric where a higher value is better:

```text
score = 100 × (clamp(value, minimum, maximum) - minimum) / (maximum - minimum)
```

For a metric where a lower value is better:

```text
score = 100 × (maximum - clamp(value, minimum, maximum)) / (maximum - minimum)
```

Results are rounded to two decimal places. Values outside the expected range are clamped, so an outlier cannot produce a negative score or one above 100. A `null` metric stays missing. If a configured minimum equals its maximum, every non-null value receives the neutral score 50 because that range contains no discriminatory information.

## Initial bounds

These are product defaults for the synthetic MVP dataset, not claims about universal model limits.

| Metric                   |  Minimum |  Maximum | Direction        |
| ------------------------ | -------: | -------: | ---------------- |
| Quality score            |        0 |      100 | Higher is better |
| Task pass rate           |       0% |     100% | Higher is better |
| Automated-test pass rate |       0% |     100% | Higher is better |
| Judge score              |        0 |      100 | Higher is better |
| Cost per task            |    $0.05 |    $0.75 | Lower is better  |
| End-to-end latency       | 1,500 ms | 8,000 ms | Lower is better  |
| Average attempts         |        1 |        2 | Lower is better  |
| Stability score          |        0 |      100 | Higher is better |

Token counts remain visible workload measurements but do not receive an independent recommendation score. Their cost impact is already represented by `costUsd`.

## Composite dimensions

Normalized metrics form four business dimensions:

| Dimension   | Components                                                                           |
| ----------- | ------------------------------------------------------------------------------------ |
| Quality     | 45% quality score, 20% task pass rate, 20% automated-test pass rate, 15% judge score |
| Value       | 70% quality dimension, 30% normalized cost                                           |
| Speed       | 100% normalized latency                                                              |
| Reliability | 50% stability, 30% task pass rate, 20% normalized attempts                           |

When one component is missing, its weight is removed and the remaining available weights are proportionally renormalized. A dimension with no available components is missing. A model is eligible for ranking only when every dimension required by the selected priority can be calculated; missing evidence is never converted to zero because zero is a real observed value.

## Design consequences

- Normalization is deterministic and independent of input order.
- Raw values remain available for explanations and auditability.
- Bounds and composite weights are centralized constants, not embedded in UI code.
- Recommendation-mode weights are a separate concern defined by PB-010A.

## Recommendation priorities

Each mode applies a second set of weights to the four normalized dimensions:

| Priority      | Quality | Value | Speed | Reliability |
| ------------- | ------: | ----: | ----: | ----------: |
| Best quality  |     70% |   10% |    5% |         15% |
| Best value    |     25% |   60% |    5% |         10% |
| Fastest       |     15% |   10% |   65% |         10% |
| Most reliable |     15% |   10% |    5% |         70% |
| Balanced      |     25% |   25% |   25% |         25% |

Every profile totals 100%. The non-primary weights prevent a model with a severe weakness from winning solely on one dimension, while the dominant weight keeps each mode aligned with its user-facing promise. These initial defaults are exported from one domain module and covered by tests.

## Ranking and ties

Rankings accept summaries from exactly one date and phase. Candidates without every dimension required by the selected profile are excluded rather than assigned an invented score. Eligible candidates are ordered by:

1. weighted recommendation score, descending;
2. normalized quality, descending;
3. normalized reliability, descending;
4. stable model ID, ascending.

Ranks are one-based. This sequence makes tied results independent of repository or input order and keeps the strongest evidence ahead before the final lexical fallback.

Daily change compares today's winning model with that same model's position and score in an earlier ranking under the same phase and priority. Rank delta is positive when the model moved upward. Winner change is reported separately from score movement; same-day, future, missing, or otherwise non-comparable history produces an explicit unavailable result.

Non-finite numeric inputs are treated as missing evidence before normalization. Rankings require at most one summary per model for a single date and phase; ambiguous duplicates are rejected rather than silently ranked twice.

## Winner explanations

Explanations select two or three non-missing metrics from the winner according to the chosen priority. Quality begins with quality and pass evidence, Value with cost, Speed with latency, Reliability with stability, and Balanced with quality, cost, and latency. Every reason carries its raw value and explicit unit alongside concise English copy.

The generator describes observed winner values without claiming an unsupported margin over another model. If fewer than two relevant metrics are available, it returns an explicit error instead of inventing a persuasive explanation.

## Recommended stack

The standard workload contains one Debate task (2,800 input and 960 output tokens), one Plan task (3,300 input and 1,320 output tokens), and one Build task (5,400 input and 2,230 output tokens). For each phase, the selected priority chooses the winner. Cost and duration multiply the winner's per-task observations by task count; token estimates multiply the declared workload assumptions.

Complete totals are the exact sum of the three phase estimates. If a phase, workload, cost, or latency is unavailable, the result lists missing phases and exposes `totals: null` so a partial figure cannot be mistaken for the complete workflow.
