---
title: Sandicts React Component Migration Map
doc-type: frontend-refactor-plan
role: implementation-plan
priority: medium
canonical: docs/frontend/sandicts-react-component-migration-map.md
related:
  - docs/frontend/sandicts-react-component-structure.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
scope: frontend, react, refactor, migration-map
read-when:
  - planning component-structure refactors
  - splitting frontend refactor work into small pull requests
---

# Sandicts React Component Migration Map

## Purpose

This map keeps the component-structure refactor incremental. It should help the
team choose small, reviewable PRs instead of one broad formatting pass across
the frontend.

Use `sandicts-react-component-structure.md` as the implementation guideline.

## Prioritization criteria

Prioritize a component when it has one or more of these signals:

- high line count;
- many inline `className` values;
- conditional class composition;
- React state or effects mixed into JSX;
- route-derived state or navigation logic;
- repeated filtering, grouping, sorting, or display-value transformations;
- existing tests that make the refactor safer;
- high churn or high reuse across screens.

Lower priority when:

- the component is a thin route wrapper;
- the component is already easy to scan;
- splitting would create files with no clear responsibility;
- the component is a shadcn/ui primitive whose public API is easy to break.

## Execution order

### 1. Guideline

Ticket: `KAN-129`

Done when this guideline exists and is referenced from the frontend docs index.

### 2. Pilot

Ticket: `KAN-130`

Pilot component:

- `src/components/shared/app-shell/context/context-switcher.tsx`

Why this component:

- it already has test coverage;
- it has translation-driven labels;
- it has derived data such as the current context and grouped options;
- it has dense markup/classes, but lower shell risk than the organization
  layout.

Expected split:

- `context-switcher.tsx` for rendering/composition;
- `context-switcher.types.ts` for props;
- `context-switcher.constants.ts` for semantic ordering;
- `context-switcher.styles.ts` for dense Tailwind classes;
- `context-switcher.utils.ts` for pure derivations.

### 3. Migration inventory

Ticket: `KAN-131`

Initial candidates:

| Priority | Area | Candidate | Reason |
| --- | --- | --- | --- |
| P0 | `shared/app-shell/context` | `context-switcher.tsx` | Safe pilot with tests and dense JSX |
| P1 | `shared/app-shell/organization` | `organization-shell.tsx` | Shell state, route state, drawer, navigation composition |
| P1 | `shared/app-shell/navigation` | `app-shell-navigation.tsx` | Repeated conditional classes and active-state rendering |
| P2 | `features/public-home` | `public-home-screen.tsx` | Dense visual composition and repeated card/signal rows |
| P2 | `components/shared` | `page-state.tsx`, `pending-button.tsx`, `area-placeholder`, `status-badge` | Shared components with small, focused contracts |
| P3 | `components/ui` | `field.tsx`, `sheet.tsx` | UI primitives with public API risk; refactor only with focused tests |
| P4 | `features/auth` | auth hooks | Audit contracts/tests/naming; do not invent components |
| P4 | `src/app` | route files and layouts | Keep routes thin; move visual blocks only when pages grow |

### 4. Shared and UI

Ticket: `KAN-132`

Suggested order:

1. `src/components/shared/app-shell`
2. small shared components such as page states and pending buttons
3. `src/components/ui`, only with extra care around public primitive APIs

Run `npm run build` for shell or UI primitive changes.

### 5. Auth

Ticket: `KAN-133`

Current scope is light because `src/features/auth` is mostly hooks. Treat this
as an audit of contracts, tests, and naming rather than a forced component
split.

### 6. Public home

Ticket: `KAN-134`

Primary candidate:

- `src/features/public-home/public-home-screen.tsx`

Likely split:

- styles into `public-home.styles.ts`;
- private subcomponents such as `PublicHomeActionCard` and
  `PublicHomeSignalRow` if they improve readability;
- keep layout visually equivalent.

### 7. App Router

Ticket: `KAN-135`

Handle last. Route files are already intentionally thin in many places.

Only extract blocks from `src/app` when a route grows beyond routing,
metadata, layout, and route-level composition.

## PR validation

- Docs-only PR: `npm run format:check`.
- Code PR: `npm run lint`, `npm run typecheck`, and `npm test`.
- Shell, layout, route, or UI primitive PR: also run `npm run build`.
- Route behavior changes: consider `npm run test:e2e` when there is relevant
  coverage.

