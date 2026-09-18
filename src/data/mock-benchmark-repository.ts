import type {
  BenchmarkCatalog,
  BenchmarkRepository,
  BenchmarkRunQuery,
  DailySnapshotQuery,
  HistoryQuery,
  ModelQuery,
} from "./benchmark-repository";
import {
  mockCatalog,
  mockCases,
  mockModels,
  mockSuites,
} from "./fixtures/catalog";
import {
  mockBenchmarkRuns,
  mockDailySummaries,
  mockLatestDate,
} from "./fixtures/results";

export function createMockBenchmarkRepository(): BenchmarkRepository {
  validateMockData();

  return {
    async getCatalog(): Promise<BenchmarkCatalog> {
      return mockCatalog;
    },

    async getModels(query?: ModelQuery) {
      return mockModels.filter(
        (model) =>
          matches(query?.providerIds, model.providerId) &&
          matches(query?.statuses, model.status),
      );
    },

    async getModelById(modelId) {
      return mockModels.find((model) => model.id === modelId) ?? null;
    },

    async getDailySnapshot(query?: DailySnapshotQuery) {
      const date = query?.date ?? mockLatestDate;
      return mockDailySummaries.filter(
        (summary) =>
          summary.date === date &&
          matches(query?.phaseIds, summary.phaseId) &&
          matches(query?.modelIds, summary.modelId),
      );
    },

    async getHistory(query: HistoryQuery) {
      return mockDailySummaries.filter(
        (summary) =>
          summary.date >= query.from &&
          summary.date <= query.to &&
          matches(query.phaseIds, summary.phaseId) &&
          matches(query.modelIds, summary.modelId),
      );
    },

    async getBenchmarkRuns(query?: BenchmarkRunQuery) {
      const matchesQuery = mockBenchmarkRuns.filter((run) => {
        const runDate = run.startedAt.slice(0, 10);
        const dateMatches = query?.dateRange
          ? runDate >= query.dateRange.from && runDate <= query.dateRange.to
          : true;

        return (
          dateMatches &&
          matches(query?.suiteIds, run.suiteId) &&
          matches(query?.modelIds, run.modelId) &&
          matches(query?.statuses, run.status)
        );
      });
      const newestFirst = matchesQuery.toSorted((left, right) =>
        right.startedAt.localeCompare(left.startedAt),
      );

      return query?.limit === undefined
        ? newestFirst
        : newestFirst.slice(0, Math.max(0, query.limit));
    },

    async getBenchmarkRunById(runId) {
      return mockBenchmarkRuns.find((run) => run.id === runId) ?? null;
    },
  };
}

function matches<T>(values: readonly T[] | undefined, candidate: T): boolean {
  return values === undefined || values.includes(candidate);
}

function validateMockData(): void {
  const providerIds = new Set<string>(
    mockCatalog.providers.map((provider) => provider.id),
  );
  const modelIds = new Set<string>(mockModels.map((model) => model.id));
  const suiteIds = new Set<string>(mockSuites.map((suite) => suite.id));
  const caseIds = new Set<string>(
    mockCases.map((benchmarkCase) => benchmarkCase.id),
  );

  for (const model of mockModels) {
    assertReference(
      providerIds.has(model.providerId),
      `provider ${model.providerId}`,
    );
  }

  for (const suite of mockSuites) {
    for (const caseId of suite.caseIds) {
      assertReference(caseIds.has(caseId), `case ${caseId}`);
    }
  }

  for (const benchmarkCase of mockCases) {
    assertReference(
      suiteIds.has(benchmarkCase.suiteId),
      `suite ${benchmarkCase.suiteId}`,
    );
  }

  for (const summary of mockDailySummaries) {
    assertReference(modelIds.has(summary.modelId), `model ${summary.modelId}`);
  }

  for (const run of mockBenchmarkRuns) {
    assertReference(modelIds.has(run.modelId), `model ${run.modelId}`);
    assertReference(suiteIds.has(run.suiteId), `suite ${run.suiteId}`);
    for (const result of run.results) {
      assertReference(caseIds.has(result.caseId), `case ${result.caseId}`);
    }
  }
}

function assertReference(valid: boolean, description: string): void {
  if (!valid) {
    throw new Error(`Invalid mock data reference: ${description}`);
  }
}
