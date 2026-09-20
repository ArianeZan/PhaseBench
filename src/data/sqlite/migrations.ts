import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type Database from "better-sqlite3";

export type Migration = Readonly<{ id: number; name: string; sql: string }>;
const migrationFilePattern = /^(\d{4})-(.+)\.sql$/;

export function loadMigrations(
  directory = join(__dirname, "migrations"),
): Migration[] {
  return readdirSync(directory)
    .filter((file) => migrationFilePattern.test(file))
    .sort()
    .map((file) => {
      const match = migrationFilePattern.exec(file);
      if (!match) throw new Error(`Invalid migration filename: ${file}`);
      return {
        id: Number(match[1]),
        name: match[2],
        sql: readFileSync(join(directory, file), "utf8"),
      };
    });
}

export function applyMigrations(
  database: Database.Database,
  migrations = loadMigrations(),
): void {
  database.pragma("foreign_keys = ON");
  database.exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations (migration_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, checksum_sha256 TEXT NOT NULL, applied_at TEXT NOT NULL) STRICT",
  );
  const findApplied = database.prepare(
    "SELECT name, checksum_sha256 FROM schema_migrations WHERE migration_id = ?",
  );
  const record = database.prepare(
    "INSERT INTO schema_migrations VALUES (?, ?, ?, ?)",
  );
  for (const migration of migrations) {
    const checksum = createHash("sha256").update(migration.sql).digest("hex");
    const applied = findApplied.get(migration.id) as
      { name: string; checksum_sha256: string } | undefined;
    if (applied) {
      if (
        applied.name !== migration.name ||
        applied.checksum_sha256 !== checksum
      )
        throw new Error(
          `Applied migration ${migration.id} no longer matches its recorded checksum`,
        );
      continue;
    }
    database.transaction(() => {
      database.exec(migration.sql);
      record.run(
        migration.id,
        migration.name,
        checksum,
        new Date().toISOString(),
      );
    })();
  }
  if ((database.pragma("foreign_key_check") as unknown[]).length > 0)
    throw new Error("Foreign-key integrity check failed after migration");
}
