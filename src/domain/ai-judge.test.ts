import { describe, expect, it } from "vitest";
import {
  calibrateJudgments,
  constrainJudgeEvidence,
  validateAiJudgeConfig,
  type AiJudgeConfig,
} from "./ai-judge";

const config: AiJudgeConfig = {
  judgeModelVersion: "judge-v1",
  rubricVersion: "rubric-v1",
  promptVersion: "prompt-v1",
  temperature: 0,
  maxOutputTokens: 300,
  pairOrder: "randomized",
  maxEvidenceChars: 20,
};

describe("auditable AI judge contract", () => {
  it("requires versioned and bounded configuration", () => {
    expect(() => validateAiJudgeConfig(config)).not.toThrow();
    expect(() => validateAiJudgeConfig({ ...config, temperature: 2 })).toThrow(
      /safe limits/,
    );
  });
  it("calibrates against deterministic reference decisions", () => {
    expect(
      calibrateJudgments([
        {
          caseVersion: "a",
          judgeVerdict: "pass",
          referenceVerdict: "pass",
          agreed: true,
        },
        {
          caseVersion: "b",
          judgeVerdict: "fail",
          referenceVerdict: "pass",
          agreed: false,
        },
      ]),
    ).toEqual({ total: 2, agreements: 1, agreementRate: 0.5 });
  });
  it("bounds retained evidence", () =>
    expect(constrainJudgeEvidence("0123456789", 5)).toBe("0123…"));
});
