# Design System

PhaseBench uses semantic design tokens so components express purpose rather than palette choices. Light and dark values are defined once in `src/app/globals.css` and exposed to Tailwind utilities through `@theme inline`.

## Color roles

| Token                          | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `background`                   | Application canvas                       |
| `foreground`                   | Primary text and icons                   |
| `surface`                      | Cards and raised content regions         |
| `surface-muted`                | Secondary or grouped regions             |
| `text-muted`                   | Supporting text with accessible contrast |
| `border`                       | Dividers and component outlines          |
| `accent`                       | Brand emphasis and active indicators     |
| `accent-foreground`            | Content placed on the accent color       |
| `success`, `warning`, `danger` | Semantic status indicators               |

Use semantic utilities such as `bg-surface`, `text-text-muted`, `border-border`, and `bg-accent`. Do not use raw Tailwind palette colors for structural UI. Provider identities are a separate layer introduced in PB-004C.

## Layout roles

| Token             | Purpose                               |
| ----------------- | ------------------------------------- |
| `page` spacing    | Responsive horizontal page padding    |
| `section` spacing | Responsive vertical section rhythm    |
| `control` radius  | Inputs, buttons, and compact controls |
| `card` radius     | Repeated content cards                |
| `panel` radius    | Large grouped surfaces                |
| `card` shadow     | Theme-aware card elevation            |

These roles are available through utilities including `px-page`, `py-section`, `rounded-control`, `rounded-card`, `rounded-panel`, and `shadow-card`.

## Contrast baseline

The core text combinations meet WCAG AA for normal text:

| Theme | Combination                 | Contrast |
| ----- | --------------------------- | -------- |
| Light | foreground on background    | 16.5:1   |
| Light | muted text on background    | 6.0:1    |
| Light | accent on background        | 5.0:1    |
| Light | accent foreground on accent | 5.4:1    |
| Dark  | foreground on background    | 19.3:1   |
| Dark  | muted text on background    | 7.9:1    |
| Dark  | accent on background        | 13.9:1   |
| Dark  | accent foreground on accent | 9.2:1    |

Status colors must not be the only indication of meaning. Validate any new foreground/background pairing rather than assuming that the presence of a token guarantees contrast.

## Typography

PhaseBench self-hosts the variable Geist Sans and Geist Mono families through the official `geist` npm package. Both families are released under the SIL Open Font License and are bundled into the application build, so production builds do not depend on a font CDN.

- **Geist Sans** is the default interface and content family.
- **Geist Mono** is reserved for benchmark identifiers, compact labels, measurements, and technical data.

The responsive scale exposes semantic utilities:

| Utility        | Intended use                               |
| -------------- | ------------------------------------------ |
| `text-display` | Primary page statement or product headline |
| `text-heading` | Card and section headings                  |
| `text-body-lg` | Introductory or emphasized body copy       |
| `text-body`    | Standard supporting content                |
| `text-label`   | Compact labels, metadata, and status text  |

Use the semantic scale before adding arbitrary font sizes. At 360 px, `text-display` resolves to 48 px and wraps naturally; body copy remains at least 14 px with a generous line height.

## Provider identities

Provider identity is communicated through three independent cues: full name, two-letter code, and marker shape. Color reinforces recognition but never carries identity alone.

| Provider        | Token                | Code | Marker                 |
| --------------- | -------------------- | ---- | ---------------------- |
| OpenAI          | `provider-openai`    | `OA` | Filled circle          |
| Anthropic       | `provider-anthropic` | `AN` | Rotated rounded square |
| Google          | `provider-google`    | `GO` | Outlined circle        |
| Other providers | `provider-generic`   | `OT` | Filled square          |

Each provider token has light and dark values. Use these colors only for provider attribution, not for general status or interaction states. PhaseBench-owned shapes and text are used instead of vendor logos; introducing official logos requires a separate review of current vendor usage terms.

## Interface primitives

The initial primitives live in `src/components/ui`:

| Primitive        | Responsibility                                                      |
| ---------------- | ------------------------------------------------------------------- |
| `Container`      | Consistent responsive page width and inline spacing                 |
| `Card`           | Theme-aware grouped surface with optional semantic element          |
| `Badge`          | Compact metadata and status presentation                            |
| `Button`         | Accessible primary and secondary actions with focus/disabled states |
| `VisuallyHidden` | Screen-reader context without visual layout impact                  |

Primitives contain styling and accessibility defaults, not PhaseBench business logic. Prefer native semantic elements and pass an appropriate `as` value to `Card` when its content is an article or section. The `/foundation` route is the visual fixture for reviewing these primitives across themes and viewport sizes.

## Theme resolution

Theme state is resolved by `next-themes` before React hydrates:

1. A saved `phasebench-theme` preference wins.
2. Without a saved choice, the operating-system preference is used.
3. If the system preference is unavailable, light mode is the deterministic fallback.

The resolved value is applied as `light` or `dark` on the root HTML class. The root layout uses `suppressHydrationWarning` only on that element because the pre-hydration script updates its class. Theme transitions are temporarily disabled during resolution or changes to prevent distracting color flashes. Browser-native controls receive the matching `color-scheme` value.

The provider is the smallest shared client boundary around the server-rendered application; pages and layouts remain Server Components.

`ThemeControl` provides a compact light/dark toggle with a theme-specific accessible name, native button keyboard behavior, and the shared visible focus treatment. It renders disabled until the client theme is known, preventing server/client markup differences. Selecting a mode writes the existing `phasebench-theme` preference, so the choice remains active after reload. Use this shared control instead of introducing route-specific theme switches.

Global motion is reduced when the operating system exposes `prefers-reduced-motion: reduce`. New components must not override that preference with essential transitions or animations.

## Product shell

Product routes share `AppShell` through the `(product)` route group. The shell owns the persistent brand link, theme control, main landmark, responsive content width, and synthetic-data footer. Route groups organize shared UI without changing public URLs. Route pages provide only their page-specific content and must not recreate shell landmarks.

Primary navigation uses Next.js links and a small client boundary that reads only the pathname. The active destination exposes `aria-current="page"` and a text/surface treatment. A stable Suspense fallback protects future dynamic product routes while preserving the rest of the server-rendered shell.

The recommendation priority selector uses real links rather than client-only state. Its selected value is stored in the `priority` query parameter, remains keyboard accessible before hydration, and is expressed with `aria-current` plus text and surface changes. Missing, repeated, or invalid values resolve deterministically to Balanced on the server.

The recommended workflow is an ordered list so Debate → Plan → Build remains explicit without relying on its visual layout. It stacks vertically on small screens and expands to three columns on large screens. Complete workflows show aggregate cost, duration, and token estimates; incomplete workflows name missing phases instead of presenting partial totals. Always keep the standard workload assumption visible beside these estimates.

Performance history uses URL-backed phase, metric, and range controls. Charts must name their unit, preserve missing values as visual gaps, fit their container without horizontal page overflow, and include a keyboard-accessible table containing the same values. Legends identify models with text as well as provider color.

The comparison table identifies winners with text, never color alone. It keeps explicit units in column headings or values and uses horizontal scrolling inside its own bordered region on narrow screens so no model metric is discarded.

Product routes share stable loading and error states. Loading placeholders preserve the page hierarchy, expose a polite status, and stop animating under reduced-motion preferences. Recoverable errors provide retry and dashboard actions without exposing internal messages. Empty collections and missing metrics must use direct English explanations and a useful next action rather than collapsing their section.

Interactive elements share a visible accent focus ring and use manipulation touch behavior. Primary navigation, chart controls, form controls, and buttons maintain a minimum 44 px target. Hover and selection feedback may reinforce state, but focus, text, and native semantics must communicate the same information. Transitions remain color-only and are effectively disabled by the global reduced-motion rule.
