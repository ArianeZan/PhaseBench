import { describe, expect, it } from "vitest";

import { resolveDataSourceConfiguration } from "./repository";

describe("data source configuration", () => {
  it("defaults safely to fixtures", () => {
    expect(resolveDataSourceConfiguration({})).toEqual({ source: "fixtures" });
  });

  it("requires an explicit path for SQLite", () => {
    expect(() =>
      resolveDataSourceConfiguration({ PHASEBENCH_DATA_SOURCE: "sqlite" }),
    ).toThrow(/PHASEBENCH_DATABASE_PATH/);
    expect(
      resolveDataSourceConfiguration({
        PHASEBENCH_DATA_SOURCE: "sqlite",
        PHASEBENCH_DATABASE_PATH: "./data/local.sqlite",
      }),
    ).toEqual({ source: "sqlite", databasePath: "./data/local.sqlite" });
  });

  it("rejects unknown sources", () => {
    expect(() =>
      resolveDataSourceConfiguration({ PHASEBENCH_DATA_SOURCE: "remote" }),
    ).toThrow(/fixtures.*sqlite/);
  });
});
