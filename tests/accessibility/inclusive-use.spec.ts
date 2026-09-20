import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 360, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`landmarks and keyboard focus remain clear at ${viewport.name} width`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "The right AI model for every phase.",
      }),
    ).toBeVisible();

    const focusOrder = [
      { name: "PhaseBench dashboard", href: "/" },
      { name: "Dashboard", href: "/" },
      { name: "Comparison", href: "/comparison" },
      { name: "Runs", href: "/runs" },
    ];
    for (const expected of focusOrder) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveAccessibleName(expected.name);
      await expect(focused).toHaveAttribute("href", expected.href);
    }

    const hasPageOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasPageOverflow).toBe(false);
  });
}

test("mobile controls provide usable touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const controls = page.locator(
    "header a, header button, nav[aria-label='Recommendation priority'] a, fieldset a, summary",
  );
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const control = controls.nth(index);
    const box = await control.boundingBox();
    expect(box, `Control ${index + 1} should be visible`).not.toBeNull();
    expect(
      box?.width,
      `Control ${index + 1} should be at least 24 px wide`,
    ).toBeGreaterThanOrEqual(24);
    expect(
      box?.height,
      `Control ${index + 1} should be at least 24 px high`,
    ).toBeGreaterThanOrEqual(24);
  }
});

test("reduced-motion preference removes meaningful transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  const duration = await page
    .getByRole("link", { name: "Comparison" })
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});

test("history chart has a keyboard-reachable table alternative", async ({
  page,
}) => {
  await page.goto("/?phase=debate&metric=qualityScore&range=7");

  await expect(
    page.getByRole("img", { name: /qualityScore history/ }),
  ).toBeVisible();
  const summary = page.getByText("View values as a table", { exact: true });
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "GPT-5.2" }),
  ).toBeVisible();
});
