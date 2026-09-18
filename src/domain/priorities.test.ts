import { describe, expect, it } from "vitest";

import {
  defaultPriority,
  priorityIds,
  resolveRecommendationPriority,
} from "./priorities";

describe("resolveRecommendationPriority", () => {
  it.each(priorityIds)("accepts %s", (priority) => {
    expect(resolveRecommendationPriority(priority)).toBe(priority);
  });

  it("uses Balanced for absent and invalid values", () => {
    expect(resolveRecommendationPriority(undefined)).toBe(defaultPriority);
    expect(resolveRecommendationPriority("cheapest")).toBe(defaultPriority);
  });
});
