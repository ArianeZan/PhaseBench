import type {
  BenchmarkCase,
  BenchmarkRun,
  BenchmarkRunId,
  BenchmarkRunStatus,
  BenchmarkSuite,
  BenchmarkSuiteId,
} from "@/domain/benchmarks";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel, ModelId, ModelStatus } from "@/domain/models";
import type { PhaseId } from "@/domain/phases";
import type { Provider, ProviderId } from "@/domain/providers";

export type DateRange = Readonly<{
  from: string;
  to: string;
}>;

export type ModelQuery = Readonly<{
  providerIds?: readonly ProviderId[];
  statuses?: readonly ModelStatus[];
}>;

export type DailySnapshotQuery = Readonly<{
  date?: string;
  phaseIds?: readonly PhaseId[];
  modelIds?: readonly ModelId[];
}>;

export type HistoryQuery = DateRange &
  Readonly<{
    phaseIds?: readonly PhaseId[];
    modelIds?: readonly ModelId[];
  }>;

export type BenchmarkRunQuery = Readonly<{
  dateRange?: DateRange;
  suiteIds?: readonly BenchmarkSuiteId[];
  modelIds?: readonly ModelId[];
  statuses?: readonly BenchmarkRunStatus[];
  limit?: number;
}>;

export type BenchmarkCatalog = Readonly<{
  providers: readonly Provider[];
  models: readonly AiModel[];
  suites: readonly BenchmarkSuite[];
  cases: readonly BenchmarkCase[];
}>;

export interface BenchmarkRepository {
  getCatalog(): Promise<BenchmarkCatalog>;
  getModels(query?: ModelQuery): Promise<readonly AiModel[]>;
  getModelById(modelId: ModelId): Promise<AiModel | null>;
  getDailySnapshot(
    query?: DailySnapshotQuery,
  ): Promise<readonly DailyModelSummary[]>;
  getHistory(query: HistoryQuery): Promise<readonly DailyModelSummary[]>;
  getBenchmarkRuns(query?: BenchmarkRunQuery): Promise<readonly BenchmarkRun[]>;
  getBenchmarkRunById(runId: BenchmarkRunId): Promise<BenchmarkRun | null>;
}
