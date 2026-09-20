// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComparisonPage from "./comparison/page";
import ModelNotFound from "./models/[modelId]/not-found";
import ModelPage from "./models/[modelId]/page";
import RunNotFound from "./runs/[runId]/not-found";
import RunDetailPage from "./runs/[runId]/page";
import RunsPage from "./runs/page";

describe("exploration journeys", () => {
  it("restores comparison filters and sorting from a shared URL", async () => {
    const page = await ComparisonPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({
        priority: "quality",
        phase: "build",
        provider: "google",
        sort: "cost",
        direction: "desc",
      }),
    });
    render(page);

    expect(screen.getByRole("combobox", { name: "Phase" })).toHaveValue(
      "build",
    );
    expect(screen.getByRole("combobox", { name: "Provider" })).toHaveValue(
      "google",
    );
    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "cost",
    );
    expect(screen.getByRole("combobox", { name: "Direction" })).toHaveValue(
      "desc",
    );
    expect(screen.getByText(/quality recommendation profile/i)).toBeVisible();

    const table = screen.getByRole("table", {
      name: "Daily model comparison by development phase",
    });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(
      within(table).getByRole("link", { name: "Gemini 3.1 Pro" }),
    ).toHaveAttribute("href", "/models/google-gemini-3-1-pro");
  });

  it("connects comparison, model evidence, and run detail routes", async () => {
    render(
      await ModelPage({
        params: Promise.resolve({ modelId: "openai-gpt-5-2" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "GPT-5.2" }),
    ).toBeVisible();
    const runLink = screen.getByRole("link", {
      name: "Build Core",
    });
    expect(runLink).toHaveAttribute(
      "href",
      "/runs/2026-09-18-build-openai-gpt-5-2",
    );

    cleanup();
    render(
      await RunDetailPage({
        params: Promise.resolve({
          runId: "2026-09-18-build-openai-gpt-5-2",
        }),
        searchParams: Promise.resolve({}),
      }),
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build Core",
      }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /Back to runs/ })).toHaveAttribute(
      "href",
      "/runs",
    );
  });

  it("restores benchmark filters from a shared URL", async () => {
    render(
      await RunsPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({
          phase: "build",
          model: "openai-gpt-5-2",
          status: "completed",
        }),
      }),
    );

    expect(screen.getByRole("combobox", { name: "Phase" })).toHaveValue(
      "build",
    );
    expect(screen.getByRole("combobox", { name: "Model" })).toHaveValue(
      "openai-gpt-5-2",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "completed",
    );
    expect(screen.getByText("1 runs · Synthetic data")).toBeVisible();
    expect(screen.getByRole("link", { name: "GPT-5.2" })).toHaveAttribute(
      "href",
      "/runs/2026-09-18-build-openai-gpt-5-2",
    );
  });

  it("rejects unknown detail IDs and exposes useful return destinations", async () => {
    await expect(
      ModelPage({
        params: Promise.resolve({ modelId: "unknown-model" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(
      RunDetailPage({
        params: Promise.resolve({ runId: "unknown-run" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });

    render(<ModelNotFound />);
    expect(
      screen.getByRole("link", { name: "View model comparison" }),
    ).toHaveAttribute("href", "/comparison");
    render(<RunNotFound />);
    expect(
      screen.getByRole("link", { name: "View benchmark history" }),
    ).toHaveAttribute("href", "/runs");
  });
});
