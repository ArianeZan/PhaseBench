import type { MetricKey } from "./metrics";
import type { NormalizedDimensions } from "./metrics";
import type { ModelId } from "./models";
import type { PhaseId } from "./phases";
import type { RecommendationPriority } from "./priorities";

export type MetricUnit =
  "score" | "percent" | "USD" | "milliseconds" | "tokens" | "attempts";

export type RecommendationReason = Readonly<{
  metric: MetricKey;
  message: string;
  value: number;
  unit: MetricUnit;
}>;

export type RankedModel = Readonly<{
  modelId: ModelId;
  phaseId: PhaseId;
  priority: RecommendationPriority;
  rank: number;
  score: number;
  scoreDelta?: number;
  dimensions: NormalizedDimensions;
}>;

export type PhaseRecommendation = Readonly<{
  date: string;
  phaseId: PhaseId;
  priority: RecommendationPriority;
  winner: RankedModel;
  ranking: readonly RankedModel[];
  reasons: readonly RecommendationReason[];
}>;

export type PhaseWorkload = Readonly<{
  phaseId: PhaseId;
  taskCount: number;
  estimatedInputTokensPerTask: number;
  estimatedOutputTokensPerTask: number;
}>;

export type StackPhaseEstimate = Readonly<{
  phaseId: PhaseId;
  modelId: ModelId;
  estimatedCostUsd: number;
  estimatedDurationMs: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
}>;

export type StackTotals = Readonly<{
  estimatedCostUsd: number;
  estimatedDurationMs: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
}>;

type StackEstimateBase = Readonly<{
  date: string;
  priority: RecommendationPriority;
  workload: readonly PhaseWorkload[];
  phases: readonly StackPhaseEstimate[];
}>;

export type CompleteStackEstimate = StackEstimateBase &
  Readonly<{
    status: "complete";
    missingPhaseIds: readonly [];
    totals: StackTotals;
  }>;

export type IncompleteStackEstimate = StackEstimateBase &
  Readonly<{
    status: "incomplete";
    missingPhaseIds: readonly PhaseId[];
    totals: null;
  }>;

export type RecommendedStack = CompleteStackEstimate | IncompleteStackEstimate;
