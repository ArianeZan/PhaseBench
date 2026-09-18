# 0001 — Use the Next.js App Router

- **Status:** Accepted
- **Date:** 2026-09-18
- **Owners:** PhaseBench maintainers

## Context

PhaseBench needs a web foundation that supports a mostly server-rendered dashboard, route-level data loading, static metadata, and selective client interaction. The initial technical direction already specifies Next.js and TypeScript.

## Decision

Use the Next.js App Router under `src/app`. Route files will compose pages and load data, while reusable UI and business rules remain outside the route tree. React Server Components are the default; client boundaries are introduced only for browser state and interaction.

## Consequences

### Positive

- Server rendering and route metadata use first-class framework conventions.
- Client JavaScript can remain limited to interactive parts of the dashboard.
- Layouts and future loading/error boundaries can be colocated with routes.

### Negative

- Next.js version changes can alter APIs and conventions.
- Contributors must understand the server/client module boundary.

### Follow-up

- Consult the documentation installed with the active Next.js version before using framework APIs.
- Keep route modules focused on composition rather than reusable business logic.
