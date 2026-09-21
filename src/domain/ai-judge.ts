export type AiJudgeConfig = Readonly<{
  judgeModelVersion: string;
  rubricVersion: string;
  promptVersion: string;
  temperature: number;
  maxOutputTokens: number;
  pairOrder: "candidate-first" | "reference-first" | "randomized";
  maxEvidenceChars: number;
}>;

export type AiJudgeVerdict = "pass" | "fail" | "indeterminate";
export type AiJudgeResult = Readonly<{
  config: AiJudgeConfig;
  verdict: AiJudgeVerdict;
  score: number;
  evidence: string;
  conflictDetected: boolean;
}>;
export type CalibrationRecord = Readonly<{
  judgeVerdict: AiJudgeVerdict;
  referenceVerdict: "pass" | "fail";
  agreed: boolean;
  caseVersion: string;
}>;

export function validateAiJudgeConfig(config: AiJudgeConfig): void {
  if (
    !config.judgeModelVersion ||
    !config.rubricVersion ||
    !config.promptVersion
  )
    throw new Error("AI judge versions are required");
  if (
    config.temperature < 0 ||
    config.temperature > 1 ||
    config.maxOutputTokens <= 0 ||
    config.maxEvidenceChars <= 0
  )
    throw new Error("AI judge configuration is outside safe limits");
}

export function calibrateJudgments(
  records: readonly CalibrationRecord[],
): Readonly<{ total: number; agreements: number; agreementRate: number }> {
  const agreements = records.filter((record) => record.agreed).length;
  return {
    total: records.length,
    agreements,
    agreementRate: records.length === 0 ? 0 : agreements / records.length,
  };
}

export function constrainJudgeEvidence(
  evidence: string,
  maxChars: number,
): string {
  return evidence.length <= maxChars
    ? evidence
    : `${evidence.slice(0, Math.max(0, maxChars - 1))}…`;
}
