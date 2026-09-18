import { describe, expect, it } from "vitest";
import { loadComparisonData } from "./comparison-data";

describe("loadComparisonData", () => {
  it("returns every model by phase with one explicit winner", async () => {
    const comparison = await loadComparisonData("balanced");
    expect(comparison.rows).toHaveLength(12);
    expect(comparison.rows.filter((row) => row.isWinner)).toHaveLength(3);
    expect(comparison.rows.slice(0, 4).map((row) => row.ranking.rank)).toEqual([
      1, 2, 3, 4,
    ]);
  });
});
