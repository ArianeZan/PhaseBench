import type { ModelId } from "./models";
import type { PhaseId } from "./phases";

export const metricKeys = [
  "qualityScore",
  "taskPassRate",
  "automatedTestPassRate",
  "judgeScore",
  "costUsd",
  "latencyMs",
  "inputTokens",
  "outputTokens",
  "averageAttempts",
  "stabilityScore",
] as const;

export type MetricKey = (typeof metricKeys)[number];
export type MetricValue = number | null;

export type ModelMetrics = Readonly<Record<MetricKey, MetricValue>>;

export type DailyModelSummary = Readonly<{
  date: string;
  modelId: ModelId;
  phaseId: PhaseId;
  completedRunCount: number;
  metrics: ModelMetrics;
}>;

export type NormalizedDimensions = Readonly<{
  quality: number;
  value: number;
  speed: number;
  reliability: number;
}>;
