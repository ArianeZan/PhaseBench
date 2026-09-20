// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComparisonTable } from "./comparison-table";
import { HistoryChart } from "./history-chart";
import { PrioritySelector } from "./priority-selector";
import { RecommendationCard } from "./recommendation-card";
import { RecommendedStackView } from "./recommended-stack";
import { loadComparisonData } from "@/data/comparison-data";
import { loadDashboardData } from "@/data/dashboard-data";
import { loadHistoryData } from "@/data/history-data";
import type { RecommendedStack } from "@/domain/recommendations";

describe("decision screens", () => {
  it("exposes priority choices as shareable links with the selection named", () => {
    render(
      <PrioritySelector selectedPriority="speed" pathname="/comparison" />,
    );

    expect(
      screen.getByRole("navigation", { name: "Recommendation priority" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Fastest/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: /Balanced/ })).toHaveAttribute(
      "href",
      "/comparison?priority=balanced",
    );
  });

  it("renders recommendation evidence, units, change, and model destination", async () => {
    const dashboard = await loadDashboardData("balanced");
    const view = dashboard.recommendationViews[0];
    if (!view) throw new Error("Expected a recommendation fixture.");

    render(<RecommendationCard view={view} />);

    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("heading", { level: 3 }),
    ).toHaveTextContent(view.model.name);
    expect(
      within(article).getByRole("link", { name: view.model.name }),
    ).toHaveAttribute("href", `/models/${view.model.id}`);
    expect(article).toHaveTextContent("Cost / task");
    expect(article).toHaveTextContent("ms");
    expect(article).toHaveTextContent(/same rank|rank/);
  });

  it("shows complete totals and explains incomplete workflows", async () => {
    const dashboard = await loadDashboardData("balanced");
    render(
      <RecommendedStackView
        phases={dashboard.stackViews}
        stack={dashboard.stack}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "One model for every phase" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Total cost")).toBeInTheDocument();
    expect(screen.getByText(/one task per phase/i)).toBeInTheDocument();

    const incomplete: RecommendedStack = {
      ...dashboard.stack,
      status: "incomplete",
      missingPhaseIds: ["build"],
      totals: null,
    };
    cleanup();
    render(
      <RecommendedStackView
        phases={dashboard.stackViews.slice(0, 2)}
        stack={incomplete}
      />,
    );
    expect(screen.getByText(/data is missing for: build/i)).toBeInTheDocument();
    expect(screen.queryByText("Total cost")).not.toBeInTheDocument();
  });

  it("identifies every comparison winner in text and preserves metric columns", async () => {
    const comparison = await loadComparisonData("balanced");
    render(<ComparisonTable rows={comparison.rows} />);

    const table = screen.getByRole("table", {
      name: "Daily model comparison by development phase",
    });
    expect(within(table).getAllByRole("row")).toHaveLength(13);
    expect(within(table).getAllByText("Winner")).toHaveLength(3);
    expect(
      within(table).getByRole("columnheader", { name: "Reliability" }),
    ).toBeInTheDocument();
    expect(within(table).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/models\//),
    );
  });

  it("explains when a comparison selection has no results", () => {
    render(<ComparisonTable rows={[]} />);

    expect(
      screen.getByText(
        "No comparison results are available for this selection.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps history values available through a named table alternative", async () => {
    const history = await loadHistoryData({
      phaseId: "debate",
      metric: "qualityScore",
      rangeDays: 7,
      to: "2026-09-18",
    });
    render(<HistoryChart data={history} />);

    expect(
      screen.getByRole("img", { name: /qualityScore history/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("View values as a table")).toBeInTheDocument();
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
    expect(
      screen.getAllByText("GPT-5.2", { exact: true }).length,
    ).toBeGreaterThan(0);
  });
});
