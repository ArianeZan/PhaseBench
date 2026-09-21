import { describe, expect, it, vi } from "vitest";
import { runBenchmarkJourney } from "./benchmark-runner";
import type { BenchmarkJourneyPlan } from "./benchmark-journey";

const plan: BenchmarkJourneyPlan = {
  modelId: "model",
  versions: {
    suiteVersion: "suite-1",
    modelVersion: "model-1",
    runnerVersion: "runner-1",
    promptVersion: "prompt-1",
    evaluatorVersion: "eval-1",
  },
  cases: [
    { caseVersion: "fixed-1", benchmarkSet: "fixed" },
    { caseVersion: "hidden-1", benchmarkSet: "hidden" },
  ],
  budgets: {
    maxDurationMs: 10_000,
    maxCostUsd: 1,
    maxConcurrency: 1,
    maxAttemptsPerCase: 1,
    cancellationGraceMs: 100,
  },
};
const executor = {
  execute: async () => ({
    content: "ok",
    finishReason: "completed" as const,
    usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.1 },
    latencyMs: 1,
    attemptCount: 1,
  }),
};

describe("isolated benchmark runner", () => {
  it("runs, evaluates, and persists a complete journey", async () => {
    const persist = vi.fn(async () => undefined);
    const result = await runBenchmarkJourney(plan, "build", {
      executor,
      evaluate: async () => ({ passed: true }),
      persist,
    });
    expect(result.status).toBe("completed");
    expect(result.stages.map((item) => item.stage)).toEqual([
      "load",
      "execute",
      "evaluate",
      "persist",
    ]);
    expect(persist).toHaveBeenCalledWith(result);
  });
  it("preserves cancellation and cost budget outcomes", async () => {
    const controller = new AbortController();
    controller.abort();
    const persist = vi.fn(async () => undefined);
    await expect(
      runBenchmarkJourney(
        plan,
        "build",
        { executor: { execute: vi.fn() }, evaluate: vi.fn(), persist },
        controller.signal,
      ),
    ).resolves.toMatchObject({ status: "cancelled" });
    const partial = await runBenchmarkJourney(
      { ...plan, budgets: { ...plan.budgets, maxCostUsd: 0 } },
      "build",
      { executor, evaluate: async () => ({ passed: true }), persist },
    );
    expect(partial.status).toBe("partial");
  });
});
