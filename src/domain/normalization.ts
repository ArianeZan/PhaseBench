import type { ModelMetrics, NormalizedDimensionScores } from "./metrics";

export type NormalizationDirection = "higher" | "lower";
export type NormalizationRange = Readonly<{
  minimum: number;
  maximum: number;
  direction: NormalizationDirection;
}>;

export const metricRanges = {
  qualityScore: range(0, 100, "higher"),
  taskPassRate: range(0, 100, "higher"),
  automatedTestPassRate: range(0, 100, "higher"),
  judgeScore: range(0, 100, "higher"),
  costUsd: range(0.05, 0.75, "lower"),
  latencyMs: range(1500, 8000, "lower"),
  averageAttempts: range(1, 2, "lower"),
  stabilityScore: range(0, 100, "higher"),
} as const;

export function normalizeMetric(
  value: number | null,
  configuration: NormalizationRange,
): number | null {
  if (value === null) return null;
  const span = configuration.maximum - configuration.minimum;
  if (span === 0) return 50;

  const clamped = Math.min(
    configuration.maximum,
    Math.max(configuration.minimum, value),
  );
  const score =
    configuration.direction === "higher"
      ? ((clamped - configuration.minimum) / span) * 100
      : ((configuration.maximum - clamped) / span) * 100;
  return round(score);
}

export function normalizeModelMetrics(
  metrics: ModelMetrics,
): NormalizedDimensionScores {
  const quality = weightedAverage([
    normalized(metrics.qualityScore, metricRanges.qualityScore, 0.45),
    normalized(metrics.taskPassRate, metricRanges.taskPassRate, 0.2),
    normalized(
      metrics.automatedTestPassRate,
      metricRanges.automatedTestPassRate,
      0.2,
    ),
    normalized(metrics.judgeScore, metricRanges.judgeScore, 0.15),
  ]);
  const normalizedCost = normalizeMetric(metrics.costUsd, metricRanges.costUsd);

  return {
    quality,
    value: weightedAverage([
      { value: quality, weight: 0.7 },
      { value: normalizedCost, weight: 0.3 },
    ]),
    speed: normalizeMetric(metrics.latencyMs, metricRanges.latencyMs),
    reliability: weightedAverage([
      normalized(metrics.stabilityScore, metricRanges.stabilityScore, 0.5),
      normalized(metrics.taskPassRate, metricRanges.taskPassRate, 0.3),
      normalized(metrics.averageAttempts, metricRanges.averageAttempts, 0.2),
    ]),
  };
}

type WeightedValue = Readonly<{ value: number | null; weight: number }>;

export function weightedAverage(
  values: readonly WeightedValue[],
): number | null {
  const available = values.filter(
    (item): item is Readonly<{ value: number; weight: number }> =>
      item.value !== null,
  );
  const totalWeight = available.reduce((total, item) => total + item.weight, 0);
  if (totalWeight === 0) return null;
  return round(
    available.reduce((total, item) => total + item.value * item.weight, 0) /
      totalWeight,
  );
}

function normalized(
  value: number | null,
  configuration: NormalizationRange,
  weight: number,
): WeightedValue {
  return { value: normalizeMetric(value, configuration), weight };
}

function range(
  minimum: number,
  maximum: number,
  direction: NormalizationDirection,
): NormalizationRange {
  return { minimum, maximum, direction };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
