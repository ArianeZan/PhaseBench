import type { DailyModelSummary, MetricKey } from "./metrics";
import type { ModelId } from "./models";
import type { PhaseId } from "./phases";
import type { MetricUnit } from "./recommendations";

export const historyMetrics = [
  { key: "qualityScore", label: "Quality score", unit: "score" },
  { key: "taskPassRate", label: "Task pass rate", unit: "percent" },
  { key: "costUsd", label: "Estimated cost", unit: "USD" },
  { key: "latencyMs", label: "Latency", unit: "milliseconds" },
  { key: "stabilityScore", label: "Stability score", unit: "score" },
] as const satisfies readonly Readonly<{
  key: MetricKey;
  label: string;
  unit: MetricUnit;
}>[];

export type HistoryMetric = (typeof historyMetrics)[number]["key"];

export const historyRanges = [7, 14, 30] as const;
export type HistoryRangeDays = (typeof historyRanges)[number];

export function resolveHistoryMetric(value: string | undefined): HistoryMetric {
  return historyMetrics.some((metric) => metric.key === value)
    ? (value as HistoryMetric)
    : "qualityScore";
}

export function resolveHistoryRange(
  value: string | undefined,
): HistoryRangeDays {
  const parsed = Number(value);
  return historyRanges.includes(parsed as HistoryRangeDays)
    ? (parsed as HistoryRangeDays)
    : 30;
}

export type HistoryPoint = Readonly<{
  date: string;
  value: number | null;
}>;

export type ModelHistorySeries = Readonly<{
  modelId: ModelId;
  points: readonly HistoryPoint[];
}>;

export type HistorySeries = Readonly<{
  phaseId: PhaseId;
  metric: HistoryMetric;
  unit: MetricUnit;
  from: string;
  to: string;
  dates: readonly string[];
  models: readonly ModelHistorySeries[];
}>;

export type HistorySeriesOptions = Readonly<{
  phaseId: PhaseId;
  metric: HistoryMetric;
  rangeDays: HistoryRangeDays;
  to: string;
  modelIds: readonly ModelId[];
}>;

export function buildHistorySeries(
  summaries: readonly DailyModelSummary[],
  options: HistorySeriesOptions,
): HistorySeries {
  const metric = historyMetrics.find((item) => item.key === options.metric);
  if (!metric) throw new Error(`Unsupported history metric: ${options.metric}`);

  const dates = createDateRange(options.to, options.rangeDays);
  const from = dates[0] ?? options.to;
  const values = new Map<string, number | null>();

  for (const summary of summaries) {
    if (
      summary.phaseId !== options.phaseId ||
      summary.date < from ||
      summary.date > options.to ||
      !options.modelIds.includes(summary.modelId)
    ) {
      continue;
    }

    const key = pointKey(summary.modelId, summary.date);
    if (values.has(key)) {
      throw new Error(
        `Duplicate history summary for ${summary.modelId} on ${summary.date}.`,
      );
    }
    values.set(key, summary.metrics[options.metric]);
  }

  return {
    phaseId: options.phaseId,
    metric: options.metric,
    unit: metric.unit,
    from,
    to: options.to,
    dates,
    models: options.modelIds.map((modelId) => ({
      modelId,
      points: dates.map((date) => ({
        date,
        value: values.get(pointKey(modelId, date)) ?? null,
      })),
    })),
  };
}

export function getHistoryDateRange(
  to: string,
  rangeDays: HistoryRangeDays,
): Readonly<{ from: string; to: string }> {
  return { from: createDateRange(to, rangeDays)[0] ?? to, to };
}

function createDateRange(to: string, rangeDays: HistoryRangeDays): string[] {
  const end = Date.parse(`${to}T00:00:00.000Z`);
  if (Number.isNaN(end)) throw new Error(`Invalid history date: ${to}`);

  return Array.from({ length: rangeDays }, (_, index) =>
    new Date(end - (rangeDays - index - 1) * 86_400_000)
      .toISOString()
      .slice(0, 10),
  );
}

function pointKey(modelId: ModelId, date: string): string {
  return `${modelId}:${date}`;
}
