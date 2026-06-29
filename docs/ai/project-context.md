---
title: Sandicts Web Project Context
doc-type: frontend-project-context
role: source-of-truth
priority: high
canonical: docs/ai/project-context.md
related:
  - docs/ai/index.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-frontend-planning.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
scope: frontend, repository, setup, architecture, docs, ai-routing
read-when:
  - starting frontend implementation
  - changing frontend setup, scripts, docs, or architecture
  - deciding frontend repository boundaries
  - updating Codex skills or AI docs in this repository
do-not-read-when:
  - changing backend-only behavior
---

# Sandicts Web Project Context

## Purpose

This repository owns the Sandicts frontend application and its frontend
documentation.

The shared documentation repository is the source of truth for product scope,
entity names, MVP boundaries, business rules, and shared Jira planning.

The backend API repository remains the source of truth for backend
architecture, API contracts, validation, errors, and implementation details.

## Repository Role

- Repository: `sandicts/reactjs-sandicts-web`
- App: Sandicts Web
- Framework: Next.js App Router with TypeScript
- Runtime: Node.js 24 LTS and npm 11
- Package manager: npm
- Local frontend port: `3001`
- Local API port: `3000`

## Documentation Ownership

This repository owns:

- frontend planning and implementation docs in `docs/frontend`
- frontend AI routing and workflow docs in `docs/ai`
- frontend-specific Codex skills in `.codex/skills`
- frontend README setup and run instructions

The shared documentation repository owns:

- product and MVP scope
- Sandicts business rules
- entity glossary and naming
- shared Jira planning workflow details that are not frontend-specific

The backend repository owns:

- backend/API architecture and contracts
- backend implementation details

Use explicit cross-repo references instead of duplicating shared product or
backend-owned API rules.

Example:

```text
sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
```

## Local Commands

Use these checks for frontend changes:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm audit --audit-level=moderate
```

Use `npm run dev` for local development. The app runs on:

```text
http://localhost:3001
```

## Boundaries

- Do not store secrets, credentials, tokens, private config, or local absolute
  machine paths in repository docs.
- Do not duplicate shared product or business rules in frontend docs.
- Keep API data in server-state tooling, not local UI state.
- Keep generated artifacts, build output, and local dev logs out of Git.
- Add frontend docs when setup, commands, architecture, routes, validation, or
  user-facing workflow decisions change.

## Current Stack Direction

Follow the decided frontend direction:

- Next.js App Router with TypeScript
- Tailwind CSS and lucide-react
- shadcn/ui as the component strategy
- TanStack Query for server state
- React Hook Form and Zod for forms
- Orval as the initial MVP OpenAPI generator for the Nest Swagger contract
- Zustand only for local UI state
- Vitest with Testing Library for unit, component, and hook behavior
- Playwright with a local Chromium baseline for E2E flows

Open stack details should be tracked in Jira or frontend docs instead of being
assumed silently. Current known architecture decision status:

- `KAN-113`: API/OpenAPI integration architecture before generated client
  implementation
- `KAN-114`: general frontend application architecture and module boundaries
  are documented in `docs/frontend/sandicts-frontend-tech-decisions.md`
