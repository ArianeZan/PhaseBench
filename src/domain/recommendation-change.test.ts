import { describe, expect, it } from "vitest";

import type { PhaseRecommendation, RankedModel } from "./recommendations";
import { calculateRecommendationChange } from "./recommendation-change";

describe("calculateRecommendationChange", () => {
  it("reports score, rank, and winner movement", () => {
    const current = recommendation("model-b", [
      ranked("model-b", 1, 91),
      ranked("model-a", 2, 90),
    ]);
    const previous = recommendation("model-a", [
      ranked("model-a", 1, 92),
      ranked("model-b", 2, 89.25),
    ]);
    expect(calculateRecommendationChange(current, previous)).toEqual({
      status: "available",
      scoreDelta: 1.75,
      rankDelta: 1,
      winnerChanged: true,
      previousWinnerModelId: "model-a",
    });
  });

  it("is unavailable without a comparable previous ranking", () => {
    const current = recommendation("model-a", [ranked("model-a", 1, 90)]);
    expect(calculateRecommendationChange(current, undefined)).toEqual({
      status: "unavailable",
    });
    expect(
      calculateRecommendationChange(current, {
        ...current,
        priority: "speed",
        winner: { ...current.winner, priority: "speed" },
      }),
    ).toEqual({ status: "unavailable" });
  });
});

function recommendation(
  winnerId: string,
  ranking: readonly RankedModel[],
): PhaseRecommendation {
  const winner = ranking.find((item) => item.modelId === winnerId);
  if (!winner) throw new Error("Test winner must exist in ranking.");
  return {
    date: "2026-09-18",
    phaseId: "debate",
    priority: "balanced",
    winner,
    ranking,
    reasons: [],
  };
}

function ranked(modelId: string, rank: number, score: number): RankedModel {
  return {
    modelId,
    phaseId: "debate",
    priority: "balanced",
    rank,
    score,
    dimensions: {
      quality: score,
      value: score,
      speed: score,
      reliability: score,
    },
  };
}
