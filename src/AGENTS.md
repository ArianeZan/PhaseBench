# Source Code Conventions

These rules apply to everything under `src/`. Repository-wide guidance remains in the root `AGENTS.md`; architectural responsibilities and dependency direction remain in `docs/ARCHITECTURE.md`.

## Naming and files

- Use lowercase kebab-case filenames, for example `phase-card.tsx` and `recommendation-score.ts`.
- Use `.tsx` only when a file contains JSX; otherwise use `.ts`.
- Use PascalCase for React components and TypeScript types.
- Name component prop types `<ComponentName>Props` and keep them beside the component unless they are part of a shared public contract.
- Use camelCase for functions, variables, and module-level constants. Reserve SCREAMING_SNAKE_CASE for genuine environment or protocol constants.
- Prefer named exports. Use default exports only where Next.js file conventions require them, such as pages, layouts, and generated metadata assets.

## Components

- Keep route files focused on route-level composition, data loading, and metadata.
- Put reusable presentation and interaction in `src/components`.
- Keep product rules out of components; components may format and display domain values but must not calculate recommendations.
- Preserve semantic HTML, keyboard access, visible focus, and responsive behavior in every component change.

## Server and client boundaries

- Treat components as React Server Components by default.
- Add `"use client"` only when browser APIs, event handlers, or client-side state require it.
- Place the client boundary as low in the component tree as practical; do not convert a page or layout merely to support one interactive child.
- Do not import server-only modules, credentials, database clients, or provider SDKs into a client component or anything it imports.
- Pass serializable data from server components to client components.

## Types and domain values

- Model PhaseBench concepts in `src/domain` and derive types from canonical constant data when this avoids duplicated unions.
- Avoid `any`; validate or narrow unknown external input at the data boundary.
- Keep domain functions deterministic and independent of React, Next.js, storage, time, network calls, and environment state.
- Use explicit units in names or types when a bare number could be ambiguous, such as `latencyMs` or `costUsd`.

## Imports and dependencies

- Follow the dependency direction in `docs/ARCHITECTURE.md`.
- Use the `@/*` alias when importing across top-level source boundaries.
- Use relative imports within a tightly related directory.
- Do not import from `src/app`; route code is an outer composition layer, not a reusable dependency.
- Avoid barrel files unless they define a small, stable public surface and materially improve imports.
- Use `import type` when an import is used only by TypeScript.

## Change discipline

- Add files to `data` or `lib` only for a concrete use case; do not create placeholder abstractions.
- Keep a module focused on one responsibility and extract code when it acquires a second reason to change.
- Fix lint violations instead of suppressing them. Any unavoidable suppression must target the narrowest scope and include an adjacent rationale.
- Let Prettier own formatting; do not introduce manual alignment or ESLint formatting rules that compete with it.
- Update the closest `AGENTS.md` only for durable conventions, not one-off implementation notes.
