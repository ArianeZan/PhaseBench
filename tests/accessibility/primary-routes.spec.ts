import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "dashboard", path: "/?priority=balanced" },
  {
    name: "comparison",
    path: "/comparison?priority=quality&phase=build&sort=score&direction=desc",
  },
  { name: "runs", path: "/runs?phase=build&status=completed" },
  { name: "model detail", path: "/models/openai-gpt-5-2" },
  {
    name: "run detail",
    path: "/runs/2026-09-18-build-openai-gpt-5-2",
  },
] as const;

const themes = ["light", "dark"] as const;

for (const theme of themes) {
  for (const route of routes) {
    test(`${route.name} has no serious accessibility violations in ${theme} theme`, async ({
      page,
    }) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("phasebench-theme", selectedTheme);
      }, theme);
      await page.goto(route.path);
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blockers = results.violations.filter(
        ({ impact }) => impact === "critical" || impact === "serious",
      );

      expect(blockers, formatViolations(blockers)).toEqual([]);
    });
  }
}

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
) {
  return violations
    .map(
      (violation) =>
        `${violation.impact}: ${violation.id} — ${violation.help}\n${violation.nodes
          .map((node) => `  ${node.target.join(" ")}: ${node.failureSummary}`)
          .join("\n")}`,
    )
    .join("\n\n");
}
