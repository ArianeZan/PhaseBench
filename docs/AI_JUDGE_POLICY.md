# Auditable AI-judge policy

PB-032B treats an AI judge as a constrained fallback after deterministic evaluation, not as an unquestioned source of truth.

Every judgment records the judge model version, rubric version, prompt version, sampling configuration, pair order, verdict, score, conflict flag, and bounded evidence. Hidden benchmark content must remain protected; retained evidence is concise and safe for diagnostics.

Candidate/judge conflicts are explicit and do not silently become passes. Calibration compares judge verdicts with deterministic or human reference decisions and records agreement rate by case set. A low or unmeasured agreement rate is a limitation of the evidence, not a score adjustment hidden from users.

Pair ordering is recorded to expose position bias. Rubrics and prompts are immutable versions. Self-preference, candidate leakage, nondeterministic sampling, and judge/candidate model overlap must be reported before using judge scores in recommendations.
