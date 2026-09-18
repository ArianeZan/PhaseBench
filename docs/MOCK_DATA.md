# Mock Data

PhaseBench uses a deterministic synthetic dataset until real benchmark execution is introduced. Model names identify the intended comparison experience, but every score, cost, latency, token count, and result is illustrative and must not be presented as a current vendor claim.

## Catalog

The initial catalog contains four representative models from OpenAI, Anthropic, Google, and Mistral. It defines one versioned suite for each phase and five cases per suite:

- three fixed cases preserve longitudinal comparability;
- two hidden cases reduce tuning to the public benchmark;
- automated, judge, and hybrid evaluation methods reflect the kind of evidence each task can provide.

Every case includes expected input and output tokens. These assumptions provide a consistent unit of work for later cost and stack estimates; they are not provider limits.

## Fixture rules

Fixtures use stable dates and formulas, never the wall clock, random numbers, or network data. References between providers, models, suites, cases, summaries, and runs must be valid. The repository implementation validates those relationships before serving data.
