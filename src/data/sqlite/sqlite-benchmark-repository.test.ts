import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { applyMigrations } from "./migrations";
import { createSqliteBenchmarkRepository } from "./sqlite-benchmark-repository";

let database: Database.Database;

beforeEach(() => {
  database = new Database(":memory:");
  applyMigrations(database);
  seedEvidence(database);
});

afterEach(() => database.close());

describe("SQLite benchmark repository", () => {
  it("maps the complete product read contract", async () => {
    const repository = createSqliteBenchmarkRepository(database);
    const catalog = await repository.getCatalog();

    expect(catalog.providers).toEqual([
      { id: "provider", name: "Provider", shortName: "PR" },
    ]);
    expect(catalog.models[0]).toMatchObject({ id: "model", version: "1" });
    expect(catalog.suites[0].caseIds).toEqual(["case"]);
    expect(catalog.cases[0].workload.expectedInputTokens).toBe(100);
    await expect(repository.getModelById("missing")).resolves.toBeNull();
    await expect(
      repository.getModels({ statuses: ["retired"] }),
    ).resolves.toEqual([]);

    const latest = await repository.getDailySnapshot();
    expect(latest).toHaveLength(1);
    expect(latest[0]).toMatchObject({ date: "2026-09-20", modelId: "model" });
    await expect(
      repository.getHistory({ from: "2026-09-19", to: "2026-09-20" }),
    ).resolves.toHaveLength(2);

    const runs = await repository.getBenchmarkRuns({ limit: 1 });
    expect(runs[0]).toMatchObject({
      id: "run",
      suiteId: "suite",
      modelId: "model",
      configuration: {
        runnerVersion: "1",
        promptVersion: "1",
        modelConfiguration: { temperature: 0, maxOutputTokens: 200 },
      },
    });
    expect(runs[0].results[0]).toMatchObject({
      caseId: "case",
      qualityScore: 90,
      costUsd: 0.1,
    });
    await expect(repository.getBenchmarkRunById("missing")).resolves.toBeNull();
  });
});

function seedEvidence(db: Database.Database): void {
  const hash = "a".repeat(64);
  db.exec(`
    INSERT INTO providers (provider_id,name,short_name,created_at,updated_at) VALUES ('provider','Provider','PR','now','now');
    INSERT INTO models VALUES ('model','provider','Model','active',NULL,'now','now');
    INSERT INTO model_versions VALUES ('model-v1','model','1','provider-model',1,'now');
    INSERT INTO benchmark_suites VALUES ('suite','Suite','Description','now','now');
    INSERT INTO benchmark_suite_versions VALUES ('suite-v1','suite','build','1','Suite','Description','${hash}',1,'now');
    INSERT INTO benchmark_case_versions VALUES ('case-v1','case','suite-v1','Case','Description','fixed','automated-tests',0,1,100,200,'${hash}',NULL);
    INSERT INTO execution_versions VALUES ('runner-v1','runner','1','${hash}',NULL,'now');
    INSERT INTO execution_versions VALUES ('prompt-v1','prompt','1','${"b".repeat(64)}',NULL,'now');
    INSERT INTO benchmark_runs VALUES ('run','suite-v1','model-v1','runner-v1','prompt-v1','completed','2026-09-20T10:00:00.000Z','2026-09-20T10:00:01.000Z','2026-09-20T10:00:02.000Z','{"temperature":0,"maxOutputTokens":200}','${hash}',NULL,NULL);
    INSERT INTO benchmark_case_results VALUES ('result','run','suite-v1','case-v1','passed',1,NULL,NULL,'now');
    INSERT INTO benchmark_result_metrics VALUES ('result',90,1,1,NULL,0.1,1000,100,50);
    INSERT INTO daily_model_summaries VALUES ('2026-09-19','build','model-v1','1',1,'${metrics(89)}','now','${hash}','now');
    INSERT INTO daily_model_summaries VALUES ('2026-09-20','build','model-v1','1',1,'${metrics(90)}','now','${"b".repeat(64)}','now');
  `);
}

function metrics(qualityScore: number): string {
  return JSON.stringify({
    qualityScore,
    taskPassRate: 100,
    automatedTestPassRate: 100,
    judgeScore: null,
    costUsd: 0.1,
    latencyMs: 1000,
    inputTokens: 100,
    outputTokens: 50,
    averageAttempts: 1,
    stabilityScore: 95,
  }).replaceAll("'", "''");
}
