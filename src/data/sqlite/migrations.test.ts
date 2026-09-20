import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";
import { applyMigrations, loadMigrations } from "./migrations";

let database: Database.Database | undefined;
afterEach(() => database?.close());
function migrate() {
  database = new Database(":memory:");
  applyMigrations(database);
  return database;
}

describe("SQLite migrations", () => {
  it("builds the complete schema repeatably", () => {
    const db = migrate();
    applyMigrations(db);
    expect(
      db.prepare("SELECT count(*) AS count FROM schema_migrations").get(),
    ).toEqual({ count: loadMigrations().length });
    expect(db.pragma("integrity_check", { simple: true })).toBe("ok");
  });
  it("rejects changed applied migrations", () => {
    const db = migrate();
    const [migration] = loadMigrations();
    expect(() =>
      applyMigrations(db, [
        { ...migration, sql: `${migration.sql}\nSELECT 1;` },
      ]),
    ).toThrow(/checksum/);
  });
  it("rejects invalid relationships and duplicate immutable evidence", () => {
    const db = migrate();
    expect(() =>
      db
        .prepare("INSERT INTO models VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run("model", "missing", "Model", "active", null, "now", "now"),
    ).toThrow(/FOREIGN KEY/);
    db.prepare(
      "INSERT INTO providers (provider_id, name, website_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ).run("provider", "Provider", null, "now", "now");
    db.prepare("INSERT INTO models VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      "model",
      "provider",
      "Model",
      "active",
      null,
      "now",
      "now",
    );
    db.prepare("INSERT INTO model_versions VALUES (?, ?, ?, ?, ?, ?)").run(
      "v1",
      "model",
      "1",
      "provider-model",
      1,
      "now",
    );
    expect(() =>
      db
        .prepare("INSERT INTO model_versions VALUES (?, ?, ?, ?, ?, ?)")
        .run("v2", "model", "1", "copy", 0, "now"),
    ).toThrow(/UNIQUE/);
  });
});
