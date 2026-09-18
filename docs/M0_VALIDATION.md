# M0 Validation Record

M0 was validated on 2026-09-18 against the acceptance criteria in `docs/M0_PLAN.md`.

## Automated checks

- `npm run verify` passed formatting, lint, TypeScript, and the production build.
- The production build generated `/`, `/foundation`, `/_not-found`, and `/icon` without errors.

## Browser checks

| Area                 | Result                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------- |
| Light and dark modes | Both semantic palettes render the home and foundation routes correctly.                |
| Persistence          | A keyboard-triggered theme change remains active after reload.                         |
| Hydration            | Reloading with either saved theme produces no hydration warning.                       |
| Keyboard access      | The theme button is reachable and activates with the Enter key.                        |
| Accessible naming    | The control announces the action it will perform, not only its icon.                   |
| Focus                | Interactive primitives use a visible accent focus outline.                             |
| Reduced motion       | Global transitions and animations are minimized when the user requests reduced motion. |
| Responsive layout    | Home and foundation routes have no horizontal overflow at 360 px or desktop width.     |
| Console              | No application warnings or errors remain during the tested flows.                      |

This record covers the M0 foundation rather than future dashboard-specific components. Repeat responsive, theme, accessibility, and console checks as those components are introduced.
