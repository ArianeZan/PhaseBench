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
| `npm run verify`       | Run every required pre-merge check in sequence.        |

Run commands from the repository root. The project uses npm and commits `package-lock.json`; do not introduce a second package-manager lockfile.

Run `npm run verify` before merging any implementation or configuration task.

## Production build

```bash
npm run build
npm run start
```

The current application is the initial Next.js foundation. Product-specific screens and design will be introduced in subsequent M0 tasks.

## Project documentation

- [Product backlog](docs/BACKLOG.md)
- [M0 execution plan](docs/M0_PLAN.md)
- [Architecture and source boundaries](docs/ARCHITECTURE.md)
- [Architecture decision records](docs/decisions/README.md)
- [Code quality](docs/CODE_QUALITY.md)
- [Delivery workflow](docs/DELIVERY_WORKFLOW.md)
- [Repository working agreement](AGENTS.md)
