# Mock Data

PhaseBench uses a deterministic synthetic dataset until real benchmark execution is introduced. Model names identify the intended comparison experience, but every score, cost, latency, token count, and result is illustrative and must not be presented as a current vendor claim.

See [Product Evidence and Limitations](PRODUCT_EVIDENCE.md) for how fixture observations propagate into recommendations and what must exist before results can be treated as real evidence.

## Catalog

The initial catalog contains four representative models from OpenAI, Anthropic, Google, and Mistral. It defines one versioned suite for each phase and five cases per suite:

- three fixed cases preserve longitudinal comparability;
- two hidden cases reduce tuning to the public benchmark;
- automated, judge, and hybrid evaluation methods reflect the kind of evidence each task can provide.

Every case includes expected input and output tokens. These assumptions provide a consistent unit of work for later cost and stack estimates; they are not provider limits.

## Fixture rules

Fixtures use stable dates and formulas, never the wall clock, random numbers, or network data. References between providers, models, suites, cases, summaries, and runs must be valid. The repository implementation validates those relationships before serving data.

The history spans 31 inclusive days from 2026-08-19 through 2026-09-18. Each model-phase pair has a deliberately different base profile plus a small deterministic wave and gradual trend. Claude leads Debate quality and reliability, GPT leads Plan and Build quality, Gemini emphasizes speed at competitive quality, and Mistral emphasizes low cost. Sparse missing judge values exercise incomplete-data behavior without making a full model or phase unavailable.

The latest day also contains one detailed run for every model and phase. Each run covers all five suite cases and records configuration, attempts, test counts, judge evidence, cost, latency, and tokens.
