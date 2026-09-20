import type Database from "better-sqlite3";

import type { BenchmarkRun } from "@/domain/benchmarks";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel } from "@/domain/models";
import type { Provider } from "@/domain/providers";

import type {
  BenchmarkCatalog,
  BenchmarkRepository,
  BenchmarkRunQuery,
  DailySnapshotQuery,
  HistoryQuery,
  ModelQuery,
} from "../benchmark-repository";

type Row = Record<string, unknown>;

export function createSqliteBenchmarkRepository(
  database: Database.Database,
): BenchmarkRepository {
  const all = (sql: string, ...params: unknown[]) =>
    database.prepare(sql).all(...params) as Row[];

  const models = (): AiModel[] =>
    all(`SELECT m.model_id, m.provider_id, m.name, m.status, m.released_on, mv.version
         FROM models m JOIN model_versions mv ON mv.model_id=m.model_id AND mv.is_current=1
         ORDER BY m.rowid`).map(mapModel);

  const summaries = (): DailyModelSummary[] =>
    all(`SELECT d.summary_date, d.phase_id, m.model_id, d.completed_run_count, d.metrics_json
         FROM daily_model_summaries d JOIN model_versions mv ON mv.model_version_id=d.model_version_id
         JOIN models m ON m.model_id=mv.model_id ORDER BY d.summary_date, d.rowid`).map(
      (row) => ({
        date: text(row.summary_date),
        phaseId: text(row.phase_id) as DailyModelSummary["phaseId"],
        modelId: text(row.model_id),
        completedRunCount: number(row.completed_run_count),
        metrics: JSON.parse(
          text(row.metrics_json),
        ) as DailyModelSummary["metrics"],
      }),
    );

  const runs = (): BenchmarkRun[] =>
    all(`SELECT r.*, s.suite_id, m.model_id, rv.version runner_version, pv.version prompt_version
         FROM benchmark_runs r JOIN benchmark_suite_versions sv ON sv.suite_version_id=r.suite_version_id
         JOIN benchmark_suites s ON s.suite_id=sv.suite_id
         JOIN model_versions mv ON mv.model_version_id=r.model_version_id JOIN models m ON m.model_id=mv.model_id
         JOIN execution_versions rv ON rv.execution_version_id=r.runner_version_id
         JOIN execution_versions pv ON pv.execution_version_id=r.prompt_version_id`).map(
      (row) => {
        const results = all(
          `SELECT c.case_id, cr.status, cr.attempt_count, rm.* FROM benchmark_case_results cr
        JOIN benchmark_case_versions c ON c.case_version_id=cr.case_version_id
        JOIN benchmark_result_metrics rm ON rm.result_id=cr.result_id WHERE cr.run_id=? ORDER BY c.position`,
          text(row.run_id),
        );
        const configuration = JSON.parse(
          text(row.model_configuration_json),
        ) as BenchmarkRun["configuration"]["modelConfiguration"];
        return {
          id: text(row.run_id),
          suiteId: text(row.suite_id),
          modelId: text(row.model_id),
          status: text(row.status) as BenchmarkRun["status"],
          startedAt: text(row.started_at ?? row.queued_at),
          ...(row.completed_at ? { completedAt: text(row.completed_at) } : {}),
          configuration: {
            runnerVersion: text(row.runner_version),
            promptVersion: text(row.prompt_version),
            modelConfiguration: configuration,
          },
          results: results.map((result) => ({
            caseId: text(result.case_id),
            status: text(
              result.status,
            ) as BenchmarkRun["results"][number]["status"],
            attemptCount: number(result.attempt_count),
            qualityScore: number(result.quality_score),
            automatedTestsPassed: number(result.automated_tests_passed),
            automatedTestsTotal: number(result.automated_tests_total),
            ...(result.judge_score === null
              ? {}
              : { judgeScore: number(result.judge_score) }),
            costUsd: number(result.cost_usd),
            latencyMs: number(result.latency_ms),
            inputTokens: number(result.input_tokens),
            outputTokens: number(result.output_tokens),
          })),
        };
      },
    );

  return {
    async getCatalog(): Promise<BenchmarkCatalog> {
      const providers = all(
        "SELECT provider_id, name, short_name FROM providers ORDER BY rowid",
      ).map((row): Provider => ({
        id: text(row.provider_id),
        name: text(row.name),
        shortName: text(row.short_name),
      }));
      const suites = all(
        "SELECT sv.*, s.suite_id FROM benchmark_suite_versions sv JOIN benchmark_suites s ON s.suite_id=sv.suite_id WHERE sv.is_current=1 ORDER BY sv.rowid",
      ).map((row) => ({
        id: text(row.suite_id),
        phaseId: text(
          row.phase_id,
        ) as BenchmarkCatalog["suites"][number]["phaseId"],
        name: text(row.name),
        description: text(row.description),
        version: text(row.version),
        caseIds: all(
          "SELECT case_id FROM benchmark_case_versions WHERE suite_version_id=? ORDER BY position",
          text(row.suite_version_id),
        ).map((item) => text(item.case_id)),
      }));
      const cases = all(
        "SELECT c.*, s.suite_id FROM benchmark_case_versions c JOIN benchmark_suite_versions sv ON sv.suite_version_id=c.suite_version_id JOIN benchmark_suites s ON s.suite_id=sv.suite_id WHERE sv.is_current=1 ORDER BY c.suite_version_id,c.position",
      ).map((row) => ({
        id: text(row.case_id),
        suiteId: text(row.suite_id),
        name: text(row.name),
        description: text(row.description),
        benchmarkSet: text(
          row.benchmark_set,
        ) as BenchmarkCatalog["cases"][number]["benchmarkSet"],
        evaluationMethod: text(
          row.evaluation_method,
        ) as BenchmarkCatalog["cases"][number]["evaluationMethod"],
        maxAttempts: number(row.max_attempts),
        workload: {
          expectedInputTokens: number(row.expected_input_tokens),
          expectedOutputTokens: number(row.expected_output_tokens),
        },
      }));
      return { providers, models: models(), suites, cases };
    },
    async getModels(query?: ModelQuery) {
      return models().filter(
        (model) =>
          matches(query?.providerIds, model.providerId) &&
          matches(query?.statuses, model.status),
      );
    },
    async getModelById(modelId) {
      return models().find((model) => model.id === modelId) ?? null;
    },
    async getDailySnapshot(query?: DailySnapshotQuery) {
      const items = summaries();
      const date = query?.date ?? items.at(-1)?.date;
      return items.filter(
        (item) =>
          item.date === date &&
          matches(query?.phaseIds, item.phaseId) &&
          matches(query?.modelIds, item.modelId),
      );
    },
    async getHistory(query: HistoryQuery) {
      return summaries().filter(
        (item) =>
          item.date >= query.from &&
          item.date <= query.to &&
          matches(query.phaseIds, item.phaseId) &&
          matches(query.modelIds, item.modelId),
      );
    },
    async getBenchmarkRuns(query?: BenchmarkRunQuery) {
      const items = runs()
        .filter(
          (run) =>
            (!query?.dateRange ||
              (run.startedAt.slice(0, 10) >= query.dateRange.from &&
                run.startedAt.slice(0, 10) <= query.dateRange.to)) &&
            matches(query?.suiteIds, run.suiteId) &&
            matches(query?.modelIds, run.modelId) &&
            matches(query?.statuses, run.status),
        )
        .toSorted((a, b) => b.startedAt.localeCompare(a.startedAt));
      return query?.limit === undefined
        ? items
        : items.slice(0, Math.max(0, query.limit));
    },
    async getBenchmarkRunById(runId) {
      return runs().find((run) => run.id === runId) ?? null;
    },
  };
}

function mapModel(row: Row): AiModel {
  return {
    id: text(row.model_id),
    providerId: text(row.provider_id),
    name: text(row.name),
    version: text(row.version),
    status: text(row.status) as AiModel["status"],
    ...(row.released_on ? { releasedOn: text(row.released_on) } : {}),
  };
}
function matches<T>(values: readonly T[] | undefined, candidate: T) {
  return values === undefined || values.includes(candidate);
}
function text(value: unknown) {
  if (typeof value !== "string") throw new Error("Expected SQLite text value");
  return value;
}
function number(value: unknown) {
  if (typeof value !== "number")
    throw new Error("Expected SQLite numeric value");
  return value;
}
