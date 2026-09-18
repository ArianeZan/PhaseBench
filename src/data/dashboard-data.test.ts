import { describe, expect, it } from "vitest";

import { loadDashboardData } from "./dashboard-data";

describe("loadDashboardData", () => {
  it("synchronizes phase and stack recommendations", async () => {
    const dashboard = await loadDashboardData("speed");

    expect(dashboard.date).toBe("2026-09-18");
    expect(dashboard.priority).toBe("speed");
    expect(dashboard.recommendations).toHaveLength(3);
    expect(
      dashboard.recommendations.every((item) => item.priority === "speed"),
    ).toBe(true);
    expect(dashboard.stack.priority).toBe("speed");
    expect(dashboard.stack.status).toBe("complete");
    expect(dashboard.snapshot).toHaveLength(12);
  });
});
