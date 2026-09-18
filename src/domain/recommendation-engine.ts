import { explainRecommendation } from "./explanations";
import type { DailyModelSummary } from "./metrics";
import { phaseIds } from "./phases";
import type { RecommendationPriority } from "./priorities";
import { rankModels } from "./ranking";
import type { PhaseRecommendation } from "./recommendations";

export function recommendByPhase(
  summaries: readonly DailyModelSummary[],
  priority: RecommendationPriority,
): readonly PhaseRecommendation[] {
  const dates = new Set(summaries.map((summary) => summary.date));
  if (dates.size > 1) {
    throw new Error("Recommendations require summaries from one date.");
  }

  return phaseIds.flatMap((phaseId) => {
    const phaseSummaries = summaries.filter(
      (summary) => summary.phaseId === phaseId,
    );
    const ranking = rankModels(phaseSummaries, priority);
    const winner = ranking[0];
    const winnerSummary = phaseSummaries.find(
      (summary) => summary.modelId === winner?.modelId,
    );

    if (!winner || !winnerSummary) return [];

    return [
      {
        date: winnerSummary.date,
        phaseId,
        priority,
        winner,
        ranking,
        reasons: explainRecommendation(winnerSummary.metrics, priority),
      } satisfies PhaseRecommendation,
    ];
  });
}
