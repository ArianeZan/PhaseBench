import Database from "better-sqlite3";

import { createMockBenchmarkRepository } from "./mock-benchmark-repository";
import { createRepositoryAccessor } from "./repository-accessor";
import { applyMigrations } from "./sqlite/migrations";
import { createSqliteBenchmarkRepository } from "./sqlite/sqlite-benchmark-repository";

export type DataSourceConfiguration =
  | Readonly<{ source: "fixtures" }>
  | Readonly<{ source: "sqlite"; databasePath: string }>;

export function resolveDataSourceConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): DataSourceConfiguration {
  const source = environment.PHASEBENCH_DATA_SOURCE ?? "fixtures";
  if (source === "fixtures") return { source };
  if (source !== "sqlite") {
    throw new Error(
      "PHASEBENCH_DATA_SOURCE must be either 'fixtures' or 'sqlite'",
    );
  }
  const databasePath = environment.PHASEBENCH_DATABASE_PATH?.trim();
  if (!databasePath) {
    throw new Error(
      "PHASEBENCH_DATABASE_PATH is required when PHASEBENCH_DATA_SOURCE=sqlite",
    );
  }
  return { source, databasePath };
}

function createConfiguredRepository() {
  const configuration = resolveDataSourceConfiguration(process.env);
  if (configuration.source === "fixtures")
    return createMockBenchmarkRepository();
  const database = new Database(configuration.databasePath);
  applyMigrations(database);
  return createSqliteBenchmarkRepository(database);
}

export const getBenchmarkRepository = createRepositoryAccessor(
  createConfiguredRepository,
);
