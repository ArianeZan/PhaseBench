# PhaseBench

The right AI model for every phase.

PhaseBench is a web application that recommends which AI model to use for debate, planning, and building based on quality, cost, speed, reliability, and user preference.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project commands

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Start the local development server with live reload.   |
| `npm run build`        | Create and validate the optimized production build.    |
| `npm run start`        | Serve an existing production build.                    |
| `npm run lint`         | Check the complete codebase with ESLint.               |
| `npm run lint:fix`     | Apply safe ESLint fixes and reject remaining warnings. |
| `npm run format`       | Format maintained files with Prettier.                 |
| `npm run format:check` | Check formatting without changing files.               |
| `npm run typecheck`    | Validate TypeScript without emitting files.            |
| `npm test`             | Run deterministic unit and integration tests.          |
| `npm run verify`       | Run every required pre-merge check in sequence.        |

Run commands from the repository root. The project uses npm and commits `package-lock.json`; do not introduce a second package-manager lockfile.

Run `npm run verify` before merging any implementation or configuration task.

## Production build

```bash
npm run build
npm run start
```

The current application contains the completed M0 interface foundation and M1 recommendation core. It has responsive product framing, persistent semantic themes, a storage-neutral mock repository, 31 days of synthetic benchmark results, and deterministic recommendations for every phase and priority. Product-specific dashboard screens will be introduced in M2.

## Project documentation

- [Product backlog](docs/BACKLOG.md)
- [M0 execution plan](docs/M0_PLAN.md)
- [M0 validation record](docs/M0_VALIDATION.md)
- [M1 execution plan](docs/M1_PLAN.md)
- [M1 validation record](docs/M1_VALIDATION.md)
- [Architecture and source boundaries](docs/ARCHITECTURE.md)
- [Domain model](docs/DOMAIN_MODEL.md)
- [Mock data](docs/MOCK_DATA.md)
- [Scoring and normalization](docs/SCORING.md)
- [Architecture decision records](docs/decisions/README.md)
- [Code quality](docs/CODE_QUALITY.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Delivery workflow](docs/DELIVERY_WORKFLOW.md)
- [Repository working agreement](AGENTS.md)
