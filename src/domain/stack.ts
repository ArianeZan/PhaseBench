import type { DailyModelSummary } from "./metrics";
import { phaseIds, type PhaseId } from "./phases";
import type { RecommendationPriority } from "./priorities";
import { rankModels } from "./ranking";
import type {
  PhaseWorkload,
  RecommendedStack,
  StackPhaseEstimate,
} from "./recommendations";

export const standardWorkflow = [
  {
    phaseId: "debate",
    taskCount: 1,
    estimatedInputTokensPerTask: 2800,
    estimatedOutputTokensPerTask: 960,
  },
  {
    phaseId: "plan",
    taskCount: 1,
    estimatedInputTokensPerTask: 3300,
    estimatedOutputTokensPerTask: 1320,
  },
  {
    phaseId: "build",
    taskCount: 1,
    estimatedInputTokensPerTask: 5400,
    estimatedOutputTokensPerTask: 2230,
  },
] as const satisfies readonly PhaseWorkload[];

export function calculateRecommendedStack(
  summaries: readonly DailyModelSummary[],
  priority: RecommendationPriority,
  workload: readonly PhaseWorkload[] = standardWorkflow,
): RecommendedStack {
  const dates = new Set(summaries.map((summary) => summary.date));
  if (dates.size > 1) {
    throw new Error("A stack requires summaries from one date.");
  }
  const date = summaries[0]?.date ?? "";
  const phases: StackPhaseEstimate[] = [];
  const missingPhaseIds: PhaseId[] = [];

  for (const phaseId of phaseIds) {
    const phaseSummaries = summaries.filter(
      (summary) => summary.phaseId === phaseId,
    );
    const winner = rankModels(phaseSummaries, priority)[0];
    const winnerSummary = phaseSummaries.find(
      (summary) => summary.modelId === winner?.modelId,
    );
    const phaseWorkload = workload.find((item) => item.phaseId === phaseId);

    if (
      !winnerSummary ||
      !phaseWorkload ||
      winnerSummary.metrics.costUsd === null ||
      winnerSummary.metrics.latencyMs === null
    ) {
      missingPhaseIds.push(phaseId);
      continue;
    }

    phases.push({
      phaseId,
      modelId: winnerSummary.modelId,
      estimatedCostUsd: roundMoney(
        winnerSummary.metrics.costUsd * phaseWorkload.taskCount,
      ),
      estimatedDurationMs: Math.round(
        winnerSummary.metrics.latencyMs * phaseWorkload.taskCount,
      ),
      estimatedInputTokens:
        phaseWorkload.estimatedInputTokensPerTask * phaseWorkload.taskCount,
      estimatedOutputTokens:
        phaseWorkload.estimatedOutputTokensPerTask * phaseWorkload.taskCount,
    });
  }

  if (missingPhaseIds.length > 0) {
    return {
      status: "incomplete",
      date,
      priority,
      workload,
      phases,
      missingPhaseIds,
      totals: null,
    };
  }

  return {
    status: "complete",
    date,
    priority,
    workload,
    phases,
    missingPhaseIds: [],
    totals: {
      estimatedCostUsd: roundMoney(
        phases.reduce((total, phase) => total + phase.estimatedCostUsd, 0),
      ),
      estimatedDurationMs: phases.reduce(
        (total, phase) => total + phase.estimatedDurationMs,
        0,
      ),
      estimatedInputTokens: phases.reduce(
        (total, phase) => total + phase.estimatedInputTokens,
        0,
      ),
      estimatedOutputTokens: phases.reduce(
        (total, phase) => total + phase.estimatedOutputTokens,
        0,
      ),
    },
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
