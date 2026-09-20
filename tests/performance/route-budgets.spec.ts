import { expect, test } from "@playwright/test";

const budgets = {
  documentBytes: 150_000,
  javascriptBytes: 300_000,
  stylesheetBytes: 50_000,
  cumulativeLayoutShift: 0.1,
} as const;

const routes = [
  { name: "dashboard", path: "/?priority=balanced" },
  { name: "comparison", path: "/comparison?priority=balanced" },
  { name: "runs", path: "/runs" },
  { name: "model detail", path: "/models/openai-gpt-5-2" },
  { name: "run detail", path: "/runs/2026-09-18-build-openai-gpt-5-2" },
] as const;

for (const route of routes) {
  test(`${route.name} stays within MVP route budgets`, async ({ page }) => {
    await page.addInitScript(() => {
      let cumulativeLayoutShift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) cumulativeLayoutShift += shift.value;
        }
        (window as Window & { __phaseBenchCls?: number }).__phaseBenchCls =
          cumulativeLayoutShift;
      }).observe({ type: "layout-shift", buffered: true });
    });

    const response = await page.goto(route.path, { waitUntil: "networkidle" });
    expect(response?.ok()).toBe(true);
    const documentBytes = Buffer.byteLength((await response?.body()) ?? "");
    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const sizeFor = (extension: string) =>
        resources
          .filter((entry) => new URL(entry.name).pathname.endsWith(extension))
          .reduce(
            (total, entry) =>
              total + (entry.encodedBodySize || entry.transferSize),
            0,
          );
      return {
        javascriptBytes: sizeFor(".js"),
        stylesheetBytes: sizeFor(".css"),
        cumulativeLayoutShift:
          (window as Window & { __phaseBenchCls?: number }).__phaseBenchCls ??
          0,
      };
    });

    test.info().annotations.push({
      type: "metrics",
      description: JSON.stringify({ documentBytes, ...metrics }),
    });
    console.log(route.name, { documentBytes, ...metrics });
    expect(documentBytes).toBeLessThanOrEqual(budgets.documentBytes);
    expect(metrics.javascriptBytes).toBeLessThanOrEqual(
      budgets.javascriptBytes,
    );
    expect(metrics.stylesheetBytes).toBeLessThanOrEqual(
      budgets.stylesheetBytes,
    );
    expect(metrics.cumulativeLayoutShift).toBeLessThanOrEqual(
      budgets.cumulativeLayoutShift,
    );
  });
}
