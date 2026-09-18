import { describe, expect, it } from "vitest";
import {
  loadComparisonData,
  resolveComparisonSort,
  resolveSortDirection,
} from "./comparison-data";

describe("loadComparisonData", () => {
  it("returns every model by phase with one explicit winner", async () => {
    const comparison = await loadComparisonData("balanced");
    expect(comparison.rows).toHaveLength(12);
    expect(comparison.rows.filter((row) => row.isWinner)).toHaveLength(3);
    expect(comparison.rows.map((row) => row.ranking.rank)).toEqual([
      1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4,
    ]);
  });

  it("filters and sorts deterministically without changing winner identity", async () => {
    const comparison = await loadComparisonData("balanced", {
      phaseId: "build",
      providerId: "google",
      sort: "cost",
      direction: "desc",
    });
    expect(comparison.rows).toHaveLength(1);
    expect(comparison.rows[0]?.phase.id).toBe("build");
    expect(comparison.rows[0]?.provider.id).toBe("google");
    expect(resolveComparisonSort("invalid")).toBe("rank");
    expect(resolveSortDirection("invalid")).toBe("asc");
  });
});
