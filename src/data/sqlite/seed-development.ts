import { createHash } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";

import Database from "better-sqlite3";

import { mockCases, mockModels, mockSuites } from "../fixtures/catalog";
import { mockBenchmarkRuns, mockDailySummaries } from "../fixtures/results";
import { providers } from "../../domain/providers";
import { applyMigrations } from "./migrations";

const projectRoot = process.cwd();
const configuredPath =
  process.env.PHASEBENCH_DATABASE_PATH ?? "./data/phasebench.sqlite";
const databasePath = resolve(projectRoot, configuredPath);
const dataRoot = resolve(projectRoot, "data");
const pathFromData = relative(dataRoot, databasePath);
if (
  isAbsolute(pathFromData) ||
  pathFromData.startsWith("..") ||
  ![".db", ".sqlite", ".sqlite3"].includes(extname(databasePath))
) {
  throw new Error(
    "Development databases must use a SQLite extension inside ./data",
  );
}
if (process.argv.includes("--reset")) rmSync(databasePath, { force: true });
mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
applyMigrations(database);
if (
  (
    database.prepare("SELECT count(*) count FROM providers").get() as {
      count: number;
    }
  ).count > 0
) {
  database.close();
  throw new Error(
    "Database already contains evidence. Use npm run db:reset to recreate it explicitly.",
  );
}

const timestamp = "2026-09-20T00:00:00.000Z";
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
database.transaction(() => {
  const insertProvider = database.prepare(
    "INSERT INTO providers (provider_id,name,short_name,created_at,updated_at) VALUES (?,?,?,?,?)",
  );
  for (const provider of providers)
    insertProvider.run(
      provider.id,
      provider.name,
      provider.shortName,
      timestamp,
      timestamp,
    );

  const insertModel = database.prepare(
    "INSERT INTO models VALUES (?,?,?,?,?,?,?)",
  );
  const insertModelVersion = database.prepare(
    "INSERT INTO model_versions VALUES (?,?,?,?,?,?)",
  );
  for (const model of mockModels) {
    insertModel.run(
      model.id,
      model.providerId,
      model.name,
      model.status,
      null,
      timestamp,
      timestamp,
    );
    insertModelVersion.run(
      `${model.id}:version`,
      model.id,
      model.version,
      model.id,
      1,
      timestamp,
    );
  }

  const insertSuite = database.prepare(
    "INSERT INTO benchmark_suites VALUES (?,?,?,?,?)",
  );
  const insertSuiteVersion = database.prepare(
    "INSERT INTO benchmark_suite_versions VALUES (?,?,?,?,?,?,?,?,?)",
  );
  for (const suite of mockSuites) {
    insertSuite.run(
      suite.id,
      suite.name,
      suite.description,
      timestamp,
      timestamp,
    );
    insertSuiteVersion.run(
      `${suite.id}:version`,
      suite.id,
      suite.phaseId,
      suite.version,
      suite.name,
      suite.description,
      hash(suite.id),
      1,
      timestamp,
    );
  }
  const insertCase = database.prepare(
    "INSERT INTO benchmark_case_versions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
  );
  for (const item of mockCases)
    insertCase.run(
      `${item.id}:version`,
      item.id,
      `${item.suiteId}:version`,
      item.name,
      item.description,
      item.benchmarkSet,
      item.evaluationMethod,
      (
        mockSuites.find((suite) => suite.id === item.suiteId)?.caseIds as
          readonly string[] | undefined
      )?.indexOf(item.id) ?? 0,
      item.maxAttempts,
      item.workload.expectedInputTokens,
      item.workload.expectedOutputTokens,
      hash(item.id),
      null,
    );

  const versions = new Set(
    mockBenchmarkRuns.flatMap((run) => [
      run.configuration.runnerVersion,
      run.configuration.promptVersion,
    ]),
  );
  const insertExecution = database.prepare(
    "INSERT INTO execution_versions VALUES (?,?,?,?,?,?)",
  );
  for (const version of versions) {
    const kind = version.includes("runner") ? "runner" : "prompt";
    insertExecution.run(
      `${kind}:${version}`,
      kind,
      version,
      hash(`${kind}:${version}`),
      null,
      timestamp,
    );
  }
  const insertRun = database.prepare(
    "INSERT INTO benchmark_runs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
  );
  const insertResult = database.prepare(
    "INSERT INTO benchmark_case_results VALUES (?,?,?,?,?,?,?,?,?)",
  );
  const insertMetrics = database.prepare(
    "INSERT INTO benchmark_result_metrics VALUES (?,?,?,?,?,?,?,?,?)",
  );
  for (const run of mockBenchmarkRuns) {
    insertRun.run(
      run.id,
      `${run.suiteId}:version`,
      `${run.modelId}:version`,
      `runner:${run.configuration.runnerVersion}`,
      `prompt:${run.configuration.promptVersion}`,
      run.status,
      run.startedAt,
      run.startedAt,
      run.completedAt ?? null,
      JSON.stringify(run.configuration.modelConfiguration),
      hash(JSON.stringify(run.configuration.modelConfiguration)),
      null,
      null,
    );
    for (const result of run.results) {
      const resultId = `${run.id}:${result.caseId}`;
      insertResult.run(
        resultId,
        run.id,
        `${run.suiteId}:version`,
        `${result.caseId}:version`,
        result.status,
        result.attemptCount,
        null,
        null,
        timestamp,
      );
      insertMetrics.run(
        resultId,
        result.qualityScore,
        result.automatedTestsPassed,
        result.automatedTestsTotal,
        result.judgeScore ?? null,
        result.costUsd,
        result.latencyMs,
        result.inputTokens,
        result.outputTokens,
      );
    }
  }
  const insertSummary = database.prepare(
    "INSERT INTO daily_model_summaries VALUES (?,?,?,?,?,?,?,?,?)",
  );
  for (const summary of mockDailySummaries)
    insertSummary.run(
      summary.date,
      summary.phaseId,
      `${summary.modelId}:version`,
      "fixture-v1",
      summary.completedRunCount,
      JSON.stringify(summary.metrics),
      `${summary.date}T23:59:59.999Z`,
      hash(`${summary.date}:${summary.phaseId}:${summary.modelId}`),
      timestamp,
    );
})();
database.close();
console.log(`Seeded PhaseBench development evidence at ${databasePath}`);
