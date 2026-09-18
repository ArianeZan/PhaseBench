import type { ModelId } from "./models";
import type { PhaseRecommendation } from "./recommendations";

export type RecommendationChange =
  | Readonly<{
      status: "available";
      scoreDelta: number;
      rankDelta: number;
      winnerChanged: boolean;
      previousWinnerModelId: ModelId;
    }>
  | Readonly<{ status: "unavailable" }>;

export function calculateRecommendationChange(
  current: PhaseRecommendation,
  previous: PhaseRecommendation | undefined,
): RecommendationChange {
  if (
    !previous ||
    previous.phaseId !== current.phaseId ||
    previous.priority !== current.priority
  ) {
    return { status: "unavailable" };
  }

  const previousWinnerRank = previous.ranking.find(
    (item) => item.modelId === current.winner.modelId,
  );
  if (!previousWinnerRank) return { status: "unavailable" };

  return {
    status: "available",
    scoreDelta: round(current.winner.score - previousWinnerRank.score),
    rankDelta: previousWinnerRank.rank - current.winner.rank,
    winnerChanged: previous.winner.modelId !== current.winner.modelId,
    previousWinnerModelId: previous.winner.modelId,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
