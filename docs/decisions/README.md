# Architecture Decision Records

Architecture Decision Records (ADRs) preserve decisions that shape PhaseBench and would otherwise be difficult to reconstruct from code alone.

## Index

| ADR | Status | Decision |
| --- | --- | --- |
| [0001](0001-use-nextjs-app-router.md) | Accepted | Use the Next.js App Router |
| [0002](0002-separate-data-access-from-ui.md) | Accepted | Separate data access from UI |
| [0003](0003-use-tailwind-and-semantic-tokens.md) | Accepted | Use Tailwind CSS and semantic tokens |

## Adding a decision

1. Copy [`template.md`](template.md) to `NNNN-short-title.md` using the next sequential number.
2. Describe the context and decision before implementation makes the choice implicit.
3. Record positive and negative consequences.
4. Add the ADR to this index.
5. When a decision changes, create a new ADR and mark the previous one as superseded; do not rewrite history.
