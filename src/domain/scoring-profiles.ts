import type { NormalizedDimensions } from "./metrics";
import type { RecommendationPriority } from "./priorities";

export type RecommendationDimension = keyof NormalizedDimensions;
export type ScoringWeights = Readonly<Record<RecommendationDimension, number>>;

export const scoringProfiles: Readonly<
  Record<RecommendationPriority, ScoringWeights>
> = {
  quality: { quality: 0.7, value: 0.1, speed: 0.05, reliability: 0.15 },
  value: { quality: 0.25, value: 0.6, speed: 0.05, reliability: 0.1 },
  speed: { quality: 0.15, value: 0.1, speed: 0.65, reliability: 0.1 },
  reliability: { quality: 0.15, value: 0.1, speed: 0.05, reliability: 0.7 },
  balanced: { quality: 0.25, value: 0.25, speed: 0.25, reliability: 0.25 },
};
