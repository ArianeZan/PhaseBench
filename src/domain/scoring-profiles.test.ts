import { describe, expect, it } from "vitest";

import { priorityIds } from "./priorities";
import { scoringProfiles } from "./scoring-profiles";

describe("scoringProfiles", () => {
  it.each(priorityIds)(
    "gives %s a complete 100 percent profile",
    (priority) => {
      const weights = scoringProfiles[priority];
      const total = Object.values(weights).reduce(
        (sum, weight) => sum + weight,
        0,
      );
      expect(total).toBeCloseTo(1, 10);
    },
  );

  it("emphasizes the named outcome", () => {
    expect(scoringProfiles.quality.quality).toBeGreaterThan(0.5);
    expect(scoringProfiles.value.value).toBeGreaterThan(0.5);
    expect(scoringProfiles.speed.speed).toBeGreaterThan(0.5);
    expect(scoringProfiles.reliability.reliability).toBeGreaterThan(0.5);
    expect(new Set(Object.values(scoringProfiles.balanced))).toEqual(
      new Set([0.25]),
    );
  });
});
