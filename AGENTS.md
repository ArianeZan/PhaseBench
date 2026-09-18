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
- Use Conventional Commit messages and include the task ID when useful, for example `feat: scaffold Next.js app (PB-001A)`.
- Never commit secrets, local databases, generated output, dependency directories, or editor state.

## Completion requirements

Before considering a subtask complete:

1. Run the checks relevant to the changed area.
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
- Current M0 execution plan: `docs/M0_PLAN.md`
- If implementation and documentation disagree, resolve the discrepancy within the active task.
