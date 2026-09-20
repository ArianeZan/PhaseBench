<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PhaseBench Agent Guide

This file defines the repository-wide working agreement. Add nested `AGENTS.md` files only when a directory needs rules that are more specific than these.

## Language

- Use English for source code, identifiers, documentation, tests, fixtures, UI copy, branch names, and commit messages.
- User-facing conversation may follow the user's language.

## Delivery workflow

- Use one short-lived branch per backlog subtask.
- Give tasks and branches outcome-oriented names that a product or business stakeholder can understand. Keep framework and implementation details in the task body.
- Branch names follow `codex/<task-id>-<business-outcome>`, for example `codex/pb-001a-runnable-app`.
- Keep each branch focused on its task and independently reviewable.
- Do not mix opportunistic refactors with the task at hand.
- Use Conventional Commit messages and include the task ID when useful, for example `feat: make PhaseBench runnable locally (PB-001A)`.
- Never commit secrets, local databases, generated output, dependency directories, or editor state.
- Scope every GitHub CLI issue or pull-request command explicitly to `ArianeZan/PhaseBench` with `--repo ArianeZan/PhaseBench`.
- Keep the GitHub issue state and the corresponding milestone-plan status aligned when completing a task.

## Completion requirements

Before considering a subtask complete:

1. Run `npm run verify` for implementation or configuration changes. Documentation-only tasks may run narrower relevant checks.
   Run `npm run performance` when a change can materially affect route payloads, client boundaries, or layout stability.
2. Review affected documentation and update it when behavior, setup, architecture, or decisions changed.
3. Review the applicable `AGENTS.md` files. Update them only when the task reveals a durable development rule or directory-specific convention.
4. Report what changed, which checks ran, and any remaining limitations.

Documentation and `AGENTS.md` review are part of every subtask, not separate cleanup work. An update is not required when the current guidance remains accurate.

## Engineering principles

- Keep UI, domain logic, and data access separated.
- Prefer server components by default; use client components only for browser state or interaction.
- Keep recommendation logic deterministic and independent from rendering.
- Access data through explicit repository contracts rather than importing fixtures into UI components.
- Make accessibility and responsive behavior part of implementation, not a later patch.
- Avoid adding dependencies unless they clearly reduce complexity or are required by the agreed stack.

## Source of truth

- Product backlog: `docs/BACKLOG.md`
- Milestone execution plans: `docs/M0_PLAN.md`, `docs/M1_PLAN.md`, and `docs/M2_PLAN.md`
- Architecture and source boundaries: `docs/ARCHITECTURE.md`
- Architecture decision records: `docs/decisions/README.md`
- Branch, rebase, and integration workflow: `docs/DELIVERY_WORKFLOW.md`
- If implementation and documentation disagree, resolve the discrepancy within the active task.
