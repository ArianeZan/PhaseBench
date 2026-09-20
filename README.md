# PhaseBench

The right AI model for every phase.

PhaseBench is a web application that recommends which AI model to use for debate, planning, and building based on quality, cost, speed, reliability, and user preference.

## Requirements

- Git
- Node.js 20.19 or newer (the repository includes `.nvmrc`)
- npm 10.2.3 or a compatible npm 10 release
- Google Chrome for the Playwright accessibility and performance checks

## Local development

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project commands

| Command                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start the local development server with live reload.    |
| `npm run build`         | Create and validate the optimized production build.     |
| `npm run start`         | Serve an existing production build.                     |
| `npm run lint`          | Check the complete codebase with ESLint.                |
| `npm run lint:fix`      | Apply safe ESLint fixes and reject remaining warnings.  |
| `npm run format`        | Format maintained files with Prettier.                  |
| `npm run format:check`  | Check formatting without changing files.                |
| `npm run typecheck`     | Validate TypeScript without emitting files.             |
| `npm test`              | Run deterministic unit and integration tests.           |
| `npm run accessibility` | Audit primary routes and inclusive-use flows in Chrome. |
| `npm run performance`   | Build and enforce production route performance budgets. |
| `npm run verify`        | Run every required pre-merge check in sequence.         |

Run commands from the repository root. The project uses npm and commits `package-lock.json`; do not introduce a second package-manager lockfile.

Run `npm run verify` before merging any implementation or configuration task.

## Production build

```bash
npm run build
npm run start
```

The current MVP contains the responsive dashboard, comparison, model detail, run history, and run evidence screens. Recommendations are deterministic and backed by 31 days of explicitly synthetic fixtures through a storage-neutral repository contract. Real provider APIs and benchmark execution are not connected yet.

## Project structure

| Path                   | Responsibility                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| `src/app/`             | Next.js routes, layouts, route states, and global styles               |
| `src/components/`      | Product and reusable UI components                                     |
| `src/domain/`          | Deterministic scoring, ranking, history, and workflow logic            |
| `src/data/`            | Repository contracts, fixture adapter, and route-facing data assembly  |
| `tests/accessibility/` | Browser accessibility and inclusive-use checks                         |
| `tests/performance/`   | Production route payload and layout-stability budgets                  |
| `docs/`                | Product, architecture, delivery, evidence, and milestone documentation |

Read the applicable `AGENTS.md` before changing a directory. Keep UI, domain logic, and data access separated as described in [Architecture](docs/ARCHITECTURE.md).

## Testing workflow

For ordinary implementation work:

```bash
npm run verify
```

Also run `npm run accessibility` after changes to semantics, themes, focus behavior, responsive interaction, or charts. Run `npm run performance` after changes to route output, client components, large dependencies, or layout behavior. Both browser suites start the required local server automatically; stop another PhaseBench development server if Next.js reports that the project is already locked.

## Troubleshooting

- **`EBADENGINE` during installation:** check `node --version`. Upgrade to Node 20.19 or newer, then rerun `npm ci`.
- **A second `next dev` cannot start:** Next.js permits one development server per project directory. Reuse the existing server at its reported address or stop it before retrying.
- **`npm ci` reports `EPERM` on Windows:** stop running PhaseBench development or production servers first. Native Next.js, Tailwind, and CSS binaries can remain locked while Node is using them.
- **Chrome is unavailable to Playwright:** install Google Chrome and rerun the browser command. The local configuration uses the `chrome` channel rather than downloading an untracked browser binary.
- **Generated route types are stale:** run `npm run typecheck`; it executes `next typegen` before TypeScript.
- **A production server cannot start:** run `npm run build` first. `npm run start` serves the existing `.next` build only.
- **Port 3000 or 3200 is busy:** stop the process using that port. Accessibility uses 3000 and may reuse a development server; performance uses a fresh production server on 3200.

## Project documentation

- [Product backlog](docs/BACKLOG.md)
- [M0 execution plan](docs/M0_PLAN.md)
- [M0 validation record](docs/M0_VALIDATION.md)
- [M1 execution plan](docs/M1_PLAN.md)
- [M1 validation record](docs/M1_VALIDATION.md)
- [M2 execution plan](docs/M2_PLAN.md)
- [M2 validation record](docs/M2_VALIDATION.md)
- [M3 execution plan](docs/M3_PLAN.md)
- [M3 accessibility audit](docs/M3_ACCESSIBILITY_AUDIT.md)
- [M3 performance baseline](docs/M3_PERFORMANCE_BASELINE.md)
- [Architecture and source boundaries](docs/ARCHITECTURE.md)
- [Domain model](docs/DOMAIN_MODEL.md)
- [Mock data](docs/MOCK_DATA.md)
- [Scoring and normalization](docs/SCORING.md)
- [Product evidence and limitations](docs/PRODUCT_EVIDENCE.md)
- [Architecture decision records](docs/decisions/README.md)
- [Code quality](docs/CODE_QUALITY.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Delivery workflow](docs/DELIVERY_WORKFLOW.md)
- [Repository working agreement](AGENTS.md)
