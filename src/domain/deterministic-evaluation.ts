export type EvaluationVerdict = "passed" | "failed" | "evaluator-error";
export type EvaluationEvidence = Readonly<{
  code: string;
  message: string;
  actual?: string;
  expected?: string;
}>;
export type EvaluationResult = Readonly<{
  evaluatorVersion: string;
  verdict: EvaluationVerdict;
  score: number;
  evidence: readonly EvaluationEvidence[];
}>;
export type DeterministicEvaluator<T> = Readonly<{
  version: string;
  evaluate(candidate: T): EvaluationResult;
}>;

export function exactEvaluator(
  version: string,
  expected: string,
): DeterministicEvaluator<string> {
  return {
    version,
    evaluate(candidate) {
      const passed = candidate === expected;
      return {
        evaluatorVersion: version,
        verdict: passed ? "passed" : "failed",
        score: passed ? 100 : 0,
        evidence: [
          {
            code: passed ? "exact-match" : "exact-mismatch",
            message: passed
              ? "Candidate exactly matches the expected output."
              : "Candidate does not match the expected output.",
            actual: candidate,
            expected,
          },
        ],
      };
    },
  };
}

export function jsonShapeEvaluator(
  version: string,
  requiredKeys: readonly string[],
): DeterministicEvaluator<unknown> {
  return {
    version,
    evaluate(candidate) {
      if (
        candidate === null ||
        typeof candidate !== "object" ||
        Array.isArray(candidate)
      )
        return error(
          version,
          "invalid-json-shape",
          "Candidate must be a JSON object",
        );
      const missing = requiredKeys.filter((key) => !(key in candidate));
      const passed = missing.length === 0;
      return {
        evaluatorVersion: version,
        verdict: passed ? "passed" : "failed",
        score: passed
          ? 100
          : Math.max(
              0,
              100 - (missing.length / Math.max(1, requiredKeys.length)) * 100,
            ),
        evidence: [
          {
            code: passed ? "required-keys-present" : "required-keys-missing",
            message: passed
              ? "All required keys are present."
              : `Missing keys: ${missing.join(", ")}`,
            expected: requiredKeys.join(", "),
          },
        ],
      };
    },
  };
}

export function ruleEvaluator<T>(
  version: string,
  rule: (candidate: T) => boolean,
  evidence: (candidate: T) => EvaluationEvidence,
): DeterministicEvaluator<T> {
  return {
    version,
    evaluate(candidate) {
      const item = evidence(candidate);
      const passed = rule(candidate);
      return {
        evaluatorVersion: version,
        verdict: passed ? "passed" : "failed",
        score: passed ? 100 : 0,
        evidence: [item],
      };
    },
  };
}

function error(
  version: string,
  code: string,
  message: string,
): EvaluationResult {
  return {
    evaluatorVersion: version,
    verdict: "evaluator-error",
    score: 0,
    evidence: [{ code, message }],
  };
}
