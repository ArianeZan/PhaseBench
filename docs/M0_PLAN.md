# M0 — Foundation Execution Plan

## Outcome

M0 ends with a runnable, documented Next.js application that has enforced engineering conventions, a reusable visual foundation, and persistent light/dark themes.

Each subtask below is intended for one short-lived branch and one focused merge. The suggested order is also the dependency order unless noted otherwise.

## Branch and merge policy

- Follow the complete terminal workflow in [`docs/DELIVERY_WORKFLOW.md`](DELIVERY_WORKFLOW.md).
- Start each branch from the latest `master`.
- Use `codex/<task-id>-<business-outcome>` branch names.
- Use outcome-oriented task titles that a product or business stakeholder can understand; keep technical implementation details in the task body.
- Keep commits focused and use Conventional Commits.
- Rebase or update from `master` before final verification when earlier subtasks have merged.
- Merge only after the subtask's acceptance criteria and relevant checks pass.
- At task close, review documentation and applicable `AGENTS.md` guidance as required by the root `AGENTS.md`.

## PB-001 — Initialize the application

### PB-001A · Make PhaseBench runnable locally

- **Branch:** `codex/pb-001a-runnable-app`
- **GitHub:** [#2](https://github.com/ArianeZan/PhaseBench/issues/2)
- **Status:** Completed on 2026-09-18
- **Dependencies:** none
- Scaffold Next.js with App Router, TypeScript, Tailwind CSS, and `src/` layout without overwriting repository documentation.
- Preserve strict TypeScript settings and configure the `@/*` import alias.
- **Acceptance:** the development server and production build start successfully; the default page renders without runtime errors.
- **Documentation review:** add the minimum install and start instructions to `README.md`.

### PB-001B · Make everyday project commands predictable

- **Branch:** `codex/pb-001b-project-commands`
- **GitHub:** [#3](https://github.com/ArianeZan/PhaseBench/issues/3)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-001A
- Provide clear scripts for development, build, start, lint, and type checking.
- **Acceptance:** every script runs and its purpose is documented; the repository uses exactly one lockfile/package manager.
- **Documentation review:** update the README command reference if necessary.

### PB-001C · Introduce the PhaseBench product

- **Branch:** `codex/pb-001c-product-introduction`
- **GitHub:** [#4](https://github.com/ArianeZan/PhaseBench/issues/4)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-001A
- Replace framework demo content with a minimal PhaseBench placeholder using the product name and tagline.
- Add baseline page metadata and favicon handling without attempting the final dashboard design.
- **Acceptance:** no Next.js starter branding remains; metadata and page content are in English; mobile and desktop layouts do not overflow.
- **Documentation review:** no update expected unless setup or product wording changes.

## PB-002 — Define conventions and structure

### PB-002A · Organize the project for sustainable growth

- **Branch:** `codex/pb-002a-project-organization`
- **GitHub:** [#5](https://github.com/ArianeZan/PhaseBench/issues/5)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-001A
- Establish initial directories for app routes, components, domain, data, and shared utilities, with lightweight barrel files only where useful.
- **Acceptance:** boundaries are documented and imports resolve through the configured alias; no speculative abstractions are introduced.
- **Documentation review:** document the directory map in `README.md` or `docs/ARCHITECTURE.md`.

### PB-002B · Establish shared development conventions

- **Branch:** `codex/pb-002b-development-conventions`
- **GitHub:** [#6](https://github.com/ArianeZan/PhaseBench/issues/6)
- **Status:** Completed on 2026-09-18
- **Dependencies:** PB-002A
- Record conventions for filenames, React components, types, constants, server/client boundaries, and import direction.
- **Acceptance:** conventions are concise, consistent with the scaffold, and captured in the closest applicable `AGENTS.md` file.
- **Documentation review:** update root or nested `AGENTS.md`; avoid duplicating the same rule in multiple files.

### PB-002C · Preserve the reasoning behind key decisions

- **Branch:** `codex/pb-002c-decision-history`
- **GitHub:** [#7](https://github.com/ArianeZan/PhaseBench/issues/7)
- **Dependencies:** PB-002A
- Add a small ADR template and record the initial decisions: App Router, mock-data repository boundary, and styling approach.
- **Acceptance:** decisions include context, choice, consequences, and status; contributors can add later ADRs consistently.
- **Documentation review:** link the ADR index from the README.

## PB-003 — Configure code quality

### PB-003A · Catch code issues automatically

- **Branch:** `codex/pb-003a-automatic-code-checks`
- **GitHub:** [#8](https://github.com/ArianeZan/PhaseBench/issues/8)
- **Dependencies:** PB-001A
- Configure ESLint for Next.js and TypeScript with no unexplained rule suppression.
- **Acceptance:** `npm run lint` succeeds on the repository and fails for a known invalid sample during local verification.
- **Documentation review:** document the lint command and any deliberate rule choices.

### PB-003B · Keep the codebase consistently formatted

- **Branch:** `codex/pb-003b-consistent-formatting`
- **GitHub:** [#9](https://github.com/ArianeZan/PhaseBench/issues/9)
- **Dependencies:** PB-001A
- Add a consistent formatter configuration, ignore generated files, and expose check/write scripts.
- **Acceptance:** the formatting check passes and repeated formatting is idempotent.
- **Documentation review:** document format commands and editor-neutral expectations.

### PB-003C · Verify every change before it is merged

- **Branch:** `codex/pb-003c-pre-merge-verification`
- **GitHub:** [#10](https://github.com/ArianeZan/PhaseBench/issues/10)
- **Dependencies:** PB-001B, PB-003A, PB-003B
- Add a single local command that runs formatting checks, linting, type checking, and the production build in a clear order.
- **Acceptance:** the command exits non-zero on any failure and completes successfully on the branch.
- **Documentation review:** make this the documented pre-merge command.

## PB-004 — Create visual foundations and tokens

### PB-004A · Create a consistent visual language

- **Branch:** `codex/pb-004a-visual-language`
- **GitHub:** [#11](https://github.com/ArianeZan/PhaseBench/issues/11)
- **Dependencies:** PB-001C
- Define semantic tokens for surfaces, text, borders, accents, status, spacing, radii, and shadows for both themes.
- **Acceptance:** components consume semantic tokens rather than raw palette values; core foreground/background combinations meet WCAG AA contrast.
- **Documentation review:** document token naming and usage near the styling conventions.

### PB-004B · Make content clear and readable

- **Branch:** `codex/pb-004b-readable-content`
- **GitHub:** [#12](https://github.com/ArianeZan/PhaseBench/issues/12)
- **Dependencies:** PB-004A
- Configure the chosen local or framework-optimized fonts and a responsive type scale.
- **Acceptance:** fonts load without layout-breaking fallback behavior; headings and body text remain readable at 360 px.
- **Documentation review:** record font choices and licensing/source where relevant.

### PB-004C · Make AI providers easy to recognize

- **Branch:** `codex/pb-004c-recognizable-providers`
- **GitHub:** [#13](https://github.com/ArianeZan/PhaseBench/issues/13)
- **Dependencies:** PB-004A
- Define accessible visual identities for OpenAI, Anthropic, Google, and a generic provider using color plus a non-color cue.
- **Acceptance:** identities work in both themes and remain distinguishable without color perception.
- **Documentation review:** document provider token usage; do not add vendor logos without reviewing their usage terms.

### PB-004D · Build a reusable interface foundation

- **Branch:** `codex/pb-004d-reusable-interface`
- **GitHub:** [#14](https://github.com/ArianeZan/PhaseBench/issues/14)
- **Dependencies:** PB-004A, PB-004B
- Add only the primitives needed immediately, such as container, card, button, badge, and visually hidden text.
- **Acceptance:** primitives expose accessible defaults, avoid product-specific business logic, and have a small showcase route or test fixture.
- **Documentation review:** add component usage guidance only where the API is not self-explanatory.

## PB-005 — Implement light and dark themes

### PB-005A · Respect each user's appearance preference

- **Branch:** `codex/pb-005a-appearance-preference`
- **GitHub:** [#15](https://github.com/ArianeZan/PhaseBench/issues/15)
- **Dependencies:** PB-004A
- Resolve light/dark theme from saved preference and system preference with a deterministic fallback.
- **Acceptance:** the correct theme is applied on first render without a visible flash or hydration warning.
- **Documentation review:** describe theme resolution and persistence behavior.

### PB-005B · Let users choose light or dark mode

- **Branch:** `codex/pb-005b-theme-choice`
- **GitHub:** [#16](https://github.com/ArianeZan/PhaseBench/issues/16)
- **Dependencies:** PB-005A, PB-004D
- Add a keyboard-accessible control with an unambiguous accessible name and visible focus state.
- **Acceptance:** users can switch themes, the choice persists after reload, and both modes render all foundation components correctly.
- **Documentation review:** update component guidance if the control introduces a reusable pattern.

### PB-005C · Validate the foundation across devices

- **Branch:** `codex/pb-005c-cross-device-validation`
- **GitHub:** [#17](https://github.com/ArianeZan/PhaseBench/issues/17)
- **Dependencies:** PB-005B, PB-004C, PB-004D
- Perform final M0 checks across themes, keyboard use, reduced motion, 360 px mobile, and desktop widths; fix only M0 regressions.
- **Acceptance:** the unified verification command passes, no horizontal overflow or console errors remain, and M0 documentation matches the implementation.
- **Documentation review:** update `README.md`, relevant ADRs, and applicable `AGENTS.md` files based on durable lessons from M0.

## M0 completion checklist

- [ ] PB-001A–PB-001C merged
- [ ] PB-002A–PB-002C merged
- [ ] PB-003A–PB-003C merged
- [ ] PB-004A–PB-004D merged
- [ ] PB-005A–PB-005C merged
- [ ] Development, lint, formatting, type-check, and production-build commands documented and passing
- [ ] Light and dark themes verified on mobile and desktop
- [ ] README, ADRs, and applicable `AGENTS.md` files reviewed for accuracy
