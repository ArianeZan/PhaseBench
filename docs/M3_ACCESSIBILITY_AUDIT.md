# M3 Accessibility Audit

## Automated coverage

Run `npm run accessibility` to start PhaseBench locally and execute axe through Chrome. The suite checks the dashboard, comparison, run history, model detail, and run detail routes in both light and dark themes. Shared URLs intentionally exercise populated filters and sorting.

The blocking threshold is any axe violation with `critical` or `serious` impact under WCAG 2 A/AA or WCAG 2.1 A/AA tags. Playwright retains traces and an HTML report for failures; those generated artifacts are ignored by Git.

## Evidence

On 2026-09-20, `npm run accessibility` completed 10 checks successfully in desktop Chrome: five routes in each of the light and dark themes. There were no critical or serious violations under the configured WCAG tags.

The initial run identified three serious color-contrast failures:

- secondary priority text on the light accent background;
- the same selected-priority treatment on the light comparison screen;
- white winner-label text on the dark success background.

The selected priority now uses the full `accent-foreground` color. Status content on solid success backgrounds uses a theme-aware `success-foreground` token. A second full run passed without exceptions.

## Inclusive-use coverage

The Playwright suite also verifies the following at 360 px and 1440 px widths:

- banner, primary navigation, main, footer, and the page heading are exposed;
- the first keyboard stops follow brand → Dashboard → Comparison → Runs;
- the page has no horizontal viewport overflow;
- mobile header, recommendation, history, and disclosure controls have targets of at least 24 × 24 px;
- reduced-motion preference reduces transitions to the repository's near-zero fallback;
- the history chart's table alternative can be reached and opened with the keyboard.

## Exceptions

No exceptions are approved or required. Automated results complement rather than replace the keyboard, focus, touch-target, responsive, contrast, reduced-motion, and chart-alternative review in PB-024B.
