import { describe, expect, it } from "vitest";
import {
  exactEvaluator,
  jsonShapeEvaluator,
  ruleEvaluator,
} from "./deterministic-evaluation";

describe("deterministic evaluators", () => {
  it("produces reproducible exact-match evidence", () => {
    const evaluator = exactEvaluator("exact-v1", "approved");
    expect(evaluator.evaluate("approved")).toEqual(
      evaluator.evaluate("approved"),
    );
    expect(evaluator.evaluate("different")).toMatchObject({
      verdict: "failed",
      score: 0,
      evaluatorVersion: "exact-v1",
    });
  });
  it("distinguishes invalid candidates from missing required keys", () => {
    const evaluator = jsonShapeEvaluator("shape-v1", ["answer", "risks"]);
    expect(evaluator.evaluate("not-json")).toMatchObject({
      verdict: "evaluator-error",
    });
    expect(evaluator.evaluate({ answer: "ok" })).toMatchObject({
      verdict: "failed",
      score: 50,
    });
    expect(evaluator.evaluate({ answer: "ok", risks: [] })).toMatchObject({
      verdict: "passed",
      score: 100,
    });
  });
  it("supports domain rules with structured evidence", () => {
    const evaluator = ruleEvaluator(
      "rule-v1",
      (value: number) => value >= 3,
      (value) => ({
        code: "minimum",
        message: `Value is ${value}`,
        actual: String(value),
        expected: ">= 3",
      }),
    );
    expect(evaluator.evaluate(4)).toMatchObject({
      verdict: "passed",
      evidence: [{ code: "minimum" }],
    });
    expect(evaluator.evaluate(2)).toMatchObject({
      verdict: "failed",
      evidence: [{ actual: "2" }],
    });
  });
});
