# 0003 — Use Tailwind CSS and semantic tokens

- **Status:** Accepted
- **Date:** 2026-09-18
- **Owners:** PhaseBench maintainers

## Context

PhaseBench needs a responsive, accessible dashboard with light and dark themes and recognizable provider identities. The MVP should move quickly without committing to a general-purpose component library before its interaction patterns are known.

## Decision

Use Tailwind CSS for component styling and CSS custom properties for semantic design tokens. Components consume semantic roles such as surface, foreground, border, and accent instead of embedding palette meaning. Reusable primitives will be implemented locally as concrete needs emerge.

Do not add a component library during M0 unless a later decision demonstrates a clear benefit that outweighs its dependency and theming cost.

## Consequences

### Positive

- Responsive styling remains close to component markup.
- CSS custom properties support runtime theme switching without duplicating components.
- The project controls its visual language and dependency footprint.

### Negative

- Repeated utility combinations require deliberate extraction into primitives.
- Accessibility behavior is the project's responsibility rather than supplied by a full UI kit.

### Follow-up

- Semantic tokens were defined in PB-004A.
- The initial interface primitives were added in PB-004D.
- System-aware, persistent theme selection was completed in PB-005A and PB-005B.
