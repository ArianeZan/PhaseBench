import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("health endpoint", () => {
  it("reports a non-cached healthy synthetic service", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      service: "phasebench",
      evidence: "synthetic",
    });
  });
});
