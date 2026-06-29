---
title: Sandicts Web AI Context Index
doc-type: ai-routing-index
role: routing-index
priority: high
canonical: docs/ai/index.md
scope: ai-routing, docs, skills, context-selection, frontend
read-when:
  - starting any Sandicts Web AI-assisted task
  - deciding which frontend or operating docs to read
  - auditing docs or skills for AI context usage
do-not-read-when:
  - a more specific frontend repository skill has already selected the exact docs needed
---

# Sandicts Web AI Context Index

Use this file as the routing entry point for AI-assisted work in the frontend
repository.

## Reading Rules

- Start here or with `.codex/skills/sandicts-frontend-project-context/SKILL.md`.
- Prefer focused docs before long page, screen, or roadmap specs.
- Treat `docs/frontend/discovery/` as historical input only.
- Keep shared product scope, entity glossary, business rules, and Jira planning
  in `sandicts/sandicts-docs`.
- Keep backend API contracts and backend architecture in
  `sandicts/nodejs-sandicts-api`.
- Use cross-repo references in `repository:path/to/file.md` format.

## Local Operating Docs

| Document | Role |
| --- | --- |
| `docs/ai/project-context.md` | Frontend repository setup, ownership, and boundaries |
| `docs/ai/jira-operating-workflow.md` | Direct Jira workflow for known `KAN-*` work |
| `docs/ai/task-finalization-workflow.md` | Commit, PR, validation, and Jira review workflow |
| `sandicts/sandicts-docs:docs/ai/pull-request-standard.md` | Shared PR title, body, validation, and no-blank-body standard |

## Local Codex Skills

| Skill | Role |
| --- | --- |
| `.codex/skills/sandicts-frontend-project-context/SKILL.md` | Routes Codex to frontend repository context |
| `.codex/skills/jira-pr-commit-writer/SKILL.md` | Writes Jira comments, PR text, commit messages, and delivery summaries |

## Frontend Product And Planning Docs

| Document | Role |
| --- | --- |
| `docs/frontend/sandicts-frontend-context.md` | Product feel, UX direction, and frontend positioning |
| `docs/frontend/sandicts-frontend-tech-decisions.md` | Frontend stack and architecture decisions |
| `docs/frontend/sandicts-mvp-visual-system.md` | MVP token, component, state, icon, and accessibility direction |
| `docs/frontend/sandicts-frontend-planning.md` | Frontend start criteria and fullstack delivery model |
| `docs/frontend/sandicts-mvp-delivery-roadmap.md` | Frontend and fullstack MVP delivery roadmap |
| `docs/frontend/sandicts-page-functional-spec.md` | Page inventory, routes, permissions, and flow behavior |
| `docs/frontend/sandicts-mvp-screens-spec.md` | Detailed MVP screen and state notes |

## Shared And Backend References

Read shared docs from `sandicts/sandicts-docs` when a frontend task depends on
product scope, business rules, entity names, or shared Jira planning:

1. `sandicts/sandicts-docs:docs/product/sandicts-product-context.md`
2. `sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md`
3. `sandicts/sandicts-docs:docs/business-rules/sandicts-business-rules.md`
4. `sandicts/sandicts-docs:docs/product/sandicts-jira-planning-workflow.md`

Read backend docs from `sandicts/nodejs-sandicts-api` only when API contracts,
backend architecture, validation, errors, or implementation behavior matter.

For API contract integration, also read:

1. `sandicts/sandicts-docs:docs/decisions/api-contract-governance.md`
2. `sandicts/nodejs-sandicts-api:docs/ai/api/semantic-api-contracts.md`
3. `docs/frontend/sandicts-frontend-tech-decisions.md`

## Common Reading Paths

For frontend setup or architecture work, read:

1. `docs/ai/project-context.md`
2. `docs/frontend/sandicts-frontend-tech-decisions.md`
3. `docs/frontend/sandicts-frontend-planning.md`

For visual tokens, shared UI components, or common UI states, read:

1. `docs/frontend/sandicts-frontend-context.md`
2. `docs/frontend/sandicts-mvp-visual-system.md`
3. `docs/frontend/sandicts-frontend-tech-decisions.md` for ownership boundaries

For Jira work, read:

1. `docs/ai/jira-operating-workflow.md`
2. `docs/frontend/sandicts-mvp-delivery-roadmap.md` when sequencing matters
3. `docs/frontend/sandicts-page-functional-spec.md` only when page behavior matters

For finishing a Jira task, read:

1. `docs/ai/task-finalization-workflow.md`
2. `.codex/skills/jira-pr-commit-writer/SKILL.md`

For page, route, permission, or flow behavior, read:

1. `docs/frontend/sandicts-frontend-context.md`
2. `docs/frontend/sandicts-page-functional-spec.md`
3. `docs/frontend/sandicts-mvp-screens-spec.md` only when detailed screen state matters
