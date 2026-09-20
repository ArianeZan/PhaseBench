# Code Quality

PhaseBench treats automated checks as merge requirements rather than optional cleanup.

## Linting

Run the complete ESLint check from the repository root:

```bash
npm run lint
```

Apply safe automatic fixes with:

```bash
npm run lint:fix
```

The configuration uses the official Next.js Core Web Vitals and TypeScript flat-config presets. Warnings fail the command through `--max-warnings=0`, preventing known issues from accumulating silently.

Generated Next.js output, production output, and `next-env.d.ts` are ignored because they are not maintained source files. No lint rules are disabled by project configuration. A future suppression must be as narrow as possible and include an adjacent explanation of why compliant code is not practical.

## Formatting

Check formatting without modifying files:

```bash
npm run format:check
```

Format all maintained files:

```bash
npm run format
```

Prettier is the single formatting authority. Its configuration is editor-neutral, and generated output, dependency folders, lockfiles, local databases, and editor state are excluded. Do not hand-format code against Prettier output or add competing formatter rules to ESLint.

Git normalizes maintained text files to LF through `.gitattributes`, including on Windows. This keeps formatter results stable across development environments; binary image formats are explicitly excluded from text normalization.

## Pre-merge verification

Run the complete local quality gate before merging:

```bash
npm run verify
```

The command stops at the first failure and runs checks in this order:

1. Formatting check
2. ESLint
3. Next.js route type generation and TypeScript
4. Vitest unit and integration tests
5. Production build

This order puts fast feedback first while keeping the production build as the final integration check. Any failed command returns a non-zero exit code and blocks the remaining sequence.

Run deterministic domain tests independently with `npm test`.

Browser checks are intentionally separate from the fast pre-merge gate:

- `npm run accessibility` checks primary routes in both themes plus keyboard, responsive, reduced-motion, touch-target, and chart-alternative behavior.
- `npm run performance` creates a production build and enforces the route budgets documented in `M3_PERFORMANCE_BASELINE.md`.

Run the relevant browser command whenever a change can affect its contract.

`npm run typecheck` regenerates Next.js route helpers before invoking TypeScript. This prevents stale generated route declarations after pages or layouts move.

## Continuous integration

`.github/workflows/verify.yml` runs for every pull request and every push to `master`. It grants only read access to repository contents, reads the exact Node.js version from `.nvmrc`, restores npm's download cache from `package-lock.json`, installs with `npm ci`, and runs the same `npm run verify` gate used locally.

The cache never contains `node_modules`, build output, or test results, so it cannot bypass installation or validation. A newer commit cancels an obsolete run for the same pull request or branch. The job has a 15-minute timeout and contains no secrets or deployment permissions.
