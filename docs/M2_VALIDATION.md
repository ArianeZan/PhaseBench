# M2 Validation

M2 was validated on September 20, 2026 against the deterministic synthetic dataset. This report records the release checks for the complete responsive product experience.

## Automated verification

- `npm run verify` passes formatting, ESLint, generated Next.js route types, TypeScript, 52 unit and integration tests, and the production build.
- The production build prerenders four model profiles and twelve benchmark-run detail routes.
- Unknown model and run IDs use the framework not-found path and receive `noindex` metadata.

## Browser validation

The dashboard, comparison, run history, and run detail routes were exercised in the in-app browser at desktop width and an explicit 360 × 800 px viewport.

- The dashboard, navigation, recommendation cards, workflow summary, history controls, and chart remain within the page viewport at 360 px.
- Primary navigation targets measure at least 44 px high, and keyboard focus renders with a 2 px visible outline.
- Light and dark themes switch successfully and preserve semantic contrast tokens.
- Comparison URL parameters restore priority, phase, provider, sort column, and direction. Its wide table scrolls inside its own container without causing page overflow.
- Run-history URL parameters restore phase, model, and status. Run cards and evidence pages do not create page overflow at 360 px.
- Model and run detail links resolve to stable routes. An unknown run displays the product not-found screen and `noindex` metadata.
- Browser console inspection reported no warnings or errors during the validated flows.

## Data and accessibility notes

- Every displayed benchmark value remains synthetic and is labeled as such.
- Charts expose the same values through a native table alternative.
- Loading animations respect reduced-motion preferences; empty and error states provide clear English recovery actions.
- Documentation and applicable `AGENTS.md` guidance were reviewed. Existing agent guidance remains accurate, so no rule changes were required.

## Known environment note

The local shell reports Node.js 20.10.0 while `package.json` requires Node.js 20.19.0 or newer. Verification currently succeeds, but development and CI environments should use the declared minimum or newer.
