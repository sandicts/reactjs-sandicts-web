---
title: Sandicts React Component Structure
doc-type: frontend-guideline
role: implementation-guideline
priority: high
canonical: docs/frontend/sandicts-react-component-structure.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-react-component-migration-map.md
scope: frontend, react, component-structure, refactor
read-when:
  - creating React components
  - refactoring component responsibilities
  - reviewing frontend pull requests
---

# Sandicts React Component Structure

## Purpose

This guideline turns the file responsibility rules from
`sandicts-frontend-tech-decisions.md` into a short implementation checklist for
React components.

The goal is not to create more files by default. The goal is to keep each file
easy to scan, test, and review by separating responsibilities when a component
starts mixing rendering, styling, derived data, state orchestration, constants,
and reusable transformations.

## Default rule

Start simple, then split by responsibility when the split improves readability
or testability.

Do not add a file only because the pattern exists. Add a file because it owns a
clear responsibility.

## Recommended responsibilities

Use these suffixes when the component is large enough to benefit from a split:

```text
component-name.tsx
component-name.types.ts
component-name.constants.ts
component-name.styles.ts
component-name.utils.ts
hooks/use-component-name.ts
```

Responsibilities:

- `*.tsx` renders and composes UI.
- `*.types.ts` holds props, local contracts, hook return types, view models, and
  helper option types.
- `*.constants.ts` holds semantic constants, option order, fixed lists,
  defaults, and copy keys that make JSX easier to scan.
- `*.styles.ts` holds dense Tailwind class composition when inline JSX becomes
  hard to read.
- `*.utils.ts` holds pure transformations and must not import React, router,
  cookies, HTTP clients, generated API code, or UI components.
- `hooks/use-*.ts` holds React state, effects, async workflow orchestration,
  route-derived state, API mutations, context integration, or view-model logic
  that needs React hooks.

## Folder shape

Small components may stay flat:

```text
components/shared/page-heading.tsx
components/shared/page-heading.types.ts
```

Components with tests, contracts, styles, or helpers should move into a focused
folder:

```text
components/shared/status-card/
├── status-card.tsx
├── status-card.types.ts
├── status-card.constants.ts
├── status-card.styles.ts
└── status-card.test.tsx
```

Complex components may add hooks or private child components:

```text
components/shared/app-shell/organization/
├── organization-shell.tsx
├── organization-shell.types.ts
├── organization-shell.styles.ts
├── hooks/
│   └── use-organization-shell.ts
└── components/
    └── organization-navigation-drawer.tsx
```

## `index.ts` files

Do not require `index.ts` for every component.

Use an explicit file import when that keeps ownership clear. Introduce a barrel
file only when a directory intentionally exposes a small public API and the
barrel reduces import noise without hiding ownership.

## Styles

Use the project stack that already exists:

- use Tailwind classes directly for simple components;
- use `cn` for conditional class composition;
- use `class-variance-authority` (`cva`) when a component has meaningful visual
  variants;
- do not introduce `tailwind-variants` unless the project explicitly decides to
  add it later.

`*.styles.ts` is optional. Add it when classes become dense enough that JSX
stops communicating structure clearly.

Good candidates for `*.styles.ts`:

- long responsive layouts;
- repeated card/list/item classes;
- conditional classes with multiple branches;
- shell or page-level composition with many nested class names.

Poor candidates for `*.styles.ts`:

- one or two obvious static classes;
- UI primitives where the existing `cva` is already clear;
- one-off markup where splitting would make the file harder to follow.

## Hooks versus utilities

Use a hook when the logic needs React:

- `useState`, `useEffect`, `useMemo`, `useCallback`, or another hook;
- route state such as `usePathname`;
- translations such as `useTranslations`;
- context integration;
- async orchestration tied to component lifecycle.

Use a utility when the logic is pure:

- filtering;
- sorting;
- grouping;
- selecting a current item;
- deriving initials, labels, or display values;
- mapping API DTOs into view models.

Do not create a custom hook only to wrap a synchronous calculation that does not
need React. Keep it as a local pure function or move it to `*.utils.ts` when it
deserves reuse or direct tests.

## App Router boundaries

Keep `src/app` thin:

- route files own routing, metadata, layouts, and route-level composition;
- move growing visual blocks into `features/<feature>` or shared components;
- avoid moving route behavior in a way that changes Next.js semantics.

## Pull request checklist

For each component refactor:

- preserve public props and imports unless a breaking change is intentional and
  documented;
- preserve `data-testid`, accessible names, and user-visible behavior;
- avoid visual changes unless the PR explicitly includes them;
- keep PRs scoped to one component or one small module;
- run `npm run lint`, `npm run typecheck`, and `npm test` for code changes;
- also run `npm run build` when changing shell, layout, routing, or UI
  primitives;
- run `npm run format:check` for docs-only changes.

