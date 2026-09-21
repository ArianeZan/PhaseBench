import { describe, expect, it } from "vitest";
import {
  validateBenchmarkJourney,
  type BenchmarkJourneyPlan,
} from "./benchmark-journey";

const plan: BenchmarkJourneyPlan = {
  modelId: "model-v1",
  versions: {
    suiteVersion: "suite-1",
    modelVersion: "model-1",
    runnerVersion: "runner-1",
    promptVersion: "prompt-1",
    evaluatorVersion: "evaluator-1",
  },
  cases: [
    { caseVersion: "fixed-1", benchmarkSet: "fixed" },
    { caseVersion: "hidden-1", benchmarkSet: "hidden" },
  ],
  budgets: {
    maxDurationMs: 60_000,
    maxCostUsd: 1,
    maxConcurrency: 2,
    maxAttemptsPerCase: 2,
    cancellationGraceMs: 1_000,
  },
};

describe("controlled benchmark journey", () => {
  it("accepts versioned fixed and hidden cases with bounded budgets", () =>
    expect(() => validateBenchmarkJourney(plan)).not.toThrow());
  it("rejects an unbounded or untraceable journey", () => {
    expect(() => validateBenchmarkJourney({ ...plan, cases: [] })).toThrow(
      /at least one/,
    );
    expect(() =>
      validateBenchmarkJourney({
        ...plan,
        budgets: { ...plan.budgets, maxConcurrency: 0 },
      }),
    ).toThrow(/budgets/);
    expect(() =>
      validateBenchmarkJourney({
        ...plan,
        cases: [{ caseVersion: "x", benchmarkSet: "hidden" }],
      }),
    ).toThrow(/fixed/);
  });
  it("rejects duplicate case versions", () =>
    expect(() =>
      validateBenchmarkJourney({
        ...plan,
        cases: [
          { caseVersion: "fixed-1", benchmarkSet: "fixed" },
          { caseVersion: "fixed-1", benchmarkSet: "fixed" },
        ],
      }),
    ).toThrow(/unique/));
});
