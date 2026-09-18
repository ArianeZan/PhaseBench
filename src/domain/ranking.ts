import type {
  DailyModelSummary,
  NormalizedDimensionScores,
  NormalizedDimensions,
} from "./metrics";
import { normalizeModelMetrics } from "./normalization";
import type { RecommendationPriority } from "./priorities";
import type { RankedModel } from "./recommendations";
import { scoringProfiles } from "./scoring-profiles";

export function rankModels(
  summaries: readonly DailyModelSummary[],
  priority: RecommendationPriority,
): readonly RankedModel[] {
  assertComparableSummaries(summaries);
  const weights = scoringProfiles[priority];

  const scored = summaries.flatMap((summary) => {
    const dimensions = completeDimensions(
      normalizeModelMetrics(summary.metrics),
    );
    if (!dimensions) return [];

    const score = round(
      dimensions.quality * weights.quality +
        dimensions.value * weights.value +
        dimensions.speed * weights.speed +
        dimensions.reliability * weights.reliability,
    );

    return [{ summary, dimensions, score }];
  });

  scored.sort(
    (left, right) =>
      right.score - left.score ||
      right.dimensions.quality - left.dimensions.quality ||
      right.dimensions.reliability - left.dimensions.reliability ||
      left.summary.modelId.localeCompare(right.summary.modelId),
  );

  return scored.map(({ summary, dimensions, score }, index) => ({
    modelId: summary.modelId,
    phaseId: summary.phaseId,
    priority,
    rank: index + 1,
    score,
    dimensions,
  }));
}

function completeDimensions(
  scores: NormalizedDimensionScores,
): NormalizedDimensions | null {
  return scores.quality === null ||
    scores.value === null ||
    scores.speed === null ||
    scores.reliability === null
    ? null
    : {
        quality: scores.quality,
        value: scores.value,
        speed: scores.speed,
        reliability: scores.reliability,
      };
}

function assertComparableSummaries(
  summaries: readonly DailyModelSummary[],
): void {
  const first = summaries[0];
  if (!first) return;

  if (
    summaries.some(
      (summary) =>
        summary.date !== first.date || summary.phaseId !== first.phaseId,
    )
  ) {
    throw new Error("Rankings require summaries from one date and phase.");
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
