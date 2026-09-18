import { describe, expect, it } from "vitest";

import { priorityIds } from "@/domain/priorities";
import { recommendByPhase } from "@/domain/recommendation-engine";
import { calculateRecommendedStack } from "@/domain/stack";

import { getBenchmarkRepository } from "./repository";

describe("recommendation core", () => {
  it("serves validated, queryable fixture data", async () => {
    const repository = getBenchmarkRepository();
    const catalog = await repository.getCatalog();
    const history = await repository.getHistory({
      from: "2026-08-19",
      to: "2026-09-18",
      phaseIds: ["debate"],
    });

    expect(catalog.models).toHaveLength(4);
    expect(catalog.suites).toHaveLength(3);
    expect(catalog.cases).toHaveLength(15);
    expect(history).toHaveLength(31 * 4);
    expect(history[0]?.date).toBe("2026-08-19");
    expect(history.at(-1)?.date).toBe("2026-09-18");
    await expect(repository.getModelById("missing-model")).resolves.toBeNull();
  });

  it("produces explainable recommendations and complete stacks for every priority", async () => {
    const snapshot = await getBenchmarkRepository().getDailySnapshot();
    const winners = new Set<string>();

    for (const priority of priorityIds) {
      const recommendations = recommendByPhase(snapshot, priority);
      const stack = calculateRecommendedStack(snapshot, priority);

      expect(recommendations).toHaveLength(3);
      expect(recommendations.every((item) => item.reasons.length >= 2)).toBe(
        true,
      );
      expect(recommendations.every((item) => item.reasons.length <= 3)).toBe(
        true,
      );
      expect(stack.status).toBe("complete");
      expect(stack.phases).toHaveLength(3);
      recommendations.forEach((item) => winners.add(item.winner.modelId));
    }

    expect(winners.size).toBeGreaterThan(1);
  });
});
