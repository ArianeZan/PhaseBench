import { getBenchmarkRepository } from "./repository";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel } from "@/domain/models";
import { developmentPhases, type DevelopmentPhase } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";
import { rankModels } from "@/domain/ranking";
import type { RankedModel } from "@/domain/recommendations";
import type { Provider } from "@/domain/providers";

export const comparisonSorts = [
  "rank",
  "model",
  "score",
  "quality",
  "cost",
  "latency",
  "reliability",
] as const;
export type ComparisonSort = (typeof comparisonSorts)[number];
export type SortDirection = "asc" | "desc";
export type ComparisonOptions = Readonly<{
  phaseId?: string;
  providerId?: string;
  sort?: ComparisonSort;
  direction?: SortDirection;
}>;

export type ComparisonRow = Readonly<{
  phase: DevelopmentPhase;
  model: AiModel;
  provider: Provider;
  summary: DailyModelSummary;
  ranking: RankedModel;
  isWinner: boolean;
}>;
export type ComparisonData = Readonly<{
  date: string;
  priority: RecommendationPriority;
  rows: readonly ComparisonRow[];
  providers: readonly Provider[];
}>;

export async function loadComparisonData(
  priority: RecommendationPriority,
  options: ComparisonOptions = {},
): Promise<ComparisonData> {
  const repository = getBenchmarkRepository();
  const [catalog, snapshot] = await Promise.all([
    repository.getCatalog(),
    repository.getDailySnapshot(),
  ]);
  const allRows = developmentPhases.flatMap((phase) =>
    rankModels(
      snapshot.filter((summary) => summary.phaseId === phase.id),
      priority,
    ).flatMap((ranking) => {
      const model = catalog.models.find((item) => item.id === ranking.modelId);
      const provider = catalog.providers.find(
        (item) => item.id === model?.providerId,
      );
      const summary = snapshot.find(
        (item) => item.phaseId === phase.id && item.modelId === ranking.modelId,
      );
      return model && provider && summary
        ? [
            {
              phase,
              model,
              provider,
              summary,
              ranking,
              isWinner: ranking.rank === 1,
            },
          ]
        : [];
    }),
  );
  const rows = allRows
    .filter((row) => !options.phaseId || row.phase.id === options.phaseId)
    .filter(
      (row) => !options.providerId || row.provider.id === options.providerId,
    )
    .toSorted((left, right) =>
      compareRows(
        left,
        right,
        options.sort ?? "rank",
        options.direction ?? "asc",
      ),
    );
  return {
    date: snapshot[0]?.date ?? "",
    priority,
    rows,
    providers: catalog.providers,
  };
}

export function resolveComparisonSort(
  value: string | undefined,
): ComparisonSort {
  return comparisonSorts.includes(value as ComparisonSort)
    ? (value as ComparisonSort)
    : "rank";
}
export function resolveSortDirection(value: string | undefined): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

function compareRows(
  left: ComparisonRow,
  right: ComparisonRow,
  sort: ComparisonSort,
  direction: SortDirection,
): number {
  const value = (row: ComparisonRow): number | string => {
    switch (sort) {
      case "rank":
        return row.ranking.rank;
      case "model":
        return row.model.name;
      case "score":
        return row.ranking.score;
      case "quality":
        return row.summary.metrics.qualityScore ?? Number.POSITIVE_INFINITY;
      case "cost":
        return row.summary.metrics.costUsd ?? Number.POSITIVE_INFINITY;
      case "latency":
        return row.summary.metrics.latencyMs ?? Number.POSITIVE_INFINITY;
      case "reliability":
        return row.summary.metrics.stabilityScore ?? Number.POSITIVE_INFINITY;
    }
  };
  const a = value(left);
  const b = value(right);
  const primary =
    typeof a === "string" && typeof b === "string"
      ? a.localeCompare(b)
      : Number(a) - Number(b);
  return (
    (direction === "desc" ? -primary : primary) ||
    left.phase.id.localeCompare(right.phase.id) ||
    left.model.id.localeCompare(right.model.id)
  );
}
