import { getBenchmarkRepository } from "./repository";
import type {
  BenchmarkRun,
  BenchmarkRunStatus,
  BenchmarkSuite,
} from "@/domain/benchmarks";
import type { AiModel } from "@/domain/models";
import type { PhaseId } from "@/domain/phases";

export const runStatuses = [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const satisfies readonly BenchmarkRunStatus[];
export type RunHistoryItem = Readonly<{
  run: BenchmarkRun;
  suite: BenchmarkSuite;
  model: AiModel;
  quality: number | null;
  costUsd: number;
  durationMs: number;
}>;
export type RunHistoryData = Readonly<{
  items: readonly RunHistoryItem[];
  models: readonly AiModel[];
}>;

export async function loadRunHistory(filters: {
  phaseId?: PhaseId;
  modelId?: string;
  status?: BenchmarkRunStatus;
}): Promise<RunHistoryData> {
  const repository = getBenchmarkRepository();
  const catalog = await repository.getCatalog();
  const suiteIds = filters.phaseId
    ? catalog.suites
        .filter((suite) => suite.phaseId === filters.phaseId)
        .map((suite) => suite.id)
    : undefined;
  const runs = await repository.getBenchmarkRuns({
    suiteIds,
    modelIds: filters.modelId ? [filters.modelId] : undefined,
    statuses: filters.status ? [filters.status] : undefined,
  });
  const items = runs.flatMap((run) => {
    const suite = catalog.suites.find((item) => item.id === run.suiteId);
    const model = catalog.models.find((item) => item.id === run.modelId);
    if (!suite || !model) return [];
    return [
      {
        run,
        suite,
        model,
        quality: run.results.length
          ? run.results.reduce((sum, result) => sum + result.qualityScore, 0) /
            run.results.length
          : null,
        costUsd: run.results.reduce((sum, result) => sum + result.costUsd, 0),
        durationMs: run.results.reduce(
          (sum, result) => sum + result.latencyMs,
          0,
        ),
      },
    ];
  });
  return { items, models: catalog.models };
}
