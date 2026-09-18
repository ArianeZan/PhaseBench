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
