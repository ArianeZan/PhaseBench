# Deterministic evaluation

PB-032A defines versioned evaluator contracts that prefer reproducible verdicts before an AI judge is considered.

The current primitives are exact-match, JSON-shape, and domain-rule evaluators. Each returns a 0–100 score, a passed/failed/evaluator-error verdict, the evaluator version, and structured evidence with stable codes. Invalid evaluator input is an `evaluator-error`; a valid candidate that does not satisfy the task is `failed`.

Evaluator definitions must be deterministic, versioned, and independent of rendering, provider SDKs, clocks, network calls, and random sampling. PB-032B defines the constrained AI-judge fallback and its calibration requirements.
