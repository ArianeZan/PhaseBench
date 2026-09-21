# Controlled benchmark journey

PB-031A defines every benchmark as an isolated journey with four explicit stages:

1. **Load** resolves the immutable suite, case, model, prompt, runner, and evaluator versions. It fails before provider execution when a version or case is unavailable.
2. **Execute** runs only the selected fixed or hidden cases through `ModelExecutor`, enforcing duration, estimated cost, concurrency, attempts, timeout, and cancellation budgets.
3. **Evaluate** converts candidate outputs into versioned evaluator results. A candidate failure and an evaluator failure remain separate outcomes.
4. **Persist** appends the run, attempts, results, metrics, and stage diagnostics using the exact version identities. A completed run is never overwritten by a retry.

`BenchmarkJourneyPlan` requires at least one fixed case, allows a protected hidden set, rejects duplicate case versions, and requires explicit operational budgets. `BenchmarkJourneyResult` records ordered stage outcomes so partial and cancelled journeys remain traceable.

The plan describes the lifecycle and safety boundary; PB-031B implements a deterministic test-adapter journey without real provider calls.

PB-031B provides that prototype. It persists every terminal outcome, stops before another case when cancellation or cost limits apply, and never makes a real provider call. The prototype intentionally keeps case prompts and metrics minimal; production persistence and evaluation detail remain explicit follow-up boundaries.
