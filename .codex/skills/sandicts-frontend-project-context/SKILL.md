---
name: sandicts-frontend-project-context
description: Use when working in the Sandicts Web repository and needing project-specific context for frontend architecture, setup, docs, validation, Jira, pull requests, routes, UX planning, or changes to docs/ai or .codex/skills.
---

# Sandicts Frontend Project Context

## Purpose

Use this skill as the project-specific entry point for Codex work in the
Sandicts Web repository.

The canonical frontend project context lives in `docs/ai/index.md` and the
documents linked from it.

## Workflow

1. Start with `docs/ai/index.md` when the task touches frontend setup,
   architecture, validation, docs, Jira, PRs, routes, UX planning, or local
   project conventions.
2. Read only the docs whose frontmatter `read-when` entries match the current
   task.
3. Prefer focused operating docs before long frontend page, screen, or roadmap
   specs.
4. Treat `docs/ai/` documents as the frontend repository operating baseline.
5. Treat `docs/frontend/` documents as the frontend planning and implementation
   baseline.
6. When product scope, entity names, business rules, or shared Jira planning are
   needed, read the referenced docs in `sandicts/sandicts-docs`.
7. When backend contracts, API behavior, validation, or backend architecture are
   needed, read the referenced docs in `sandicts/nodejs-sandicts-api`.
8. For cross-app API compatibility work, follow
   `sandicts/sandicts-docs:docs/decisions/api-contract-governance.md`.
9. Keep `.codex/skills/` for Codex operating instructions and `docs/ai/` for
   durable frontend project context.
10. When changing repository skills, validate the edited skill folder with a
   skill validation script when available.

## Jira Fast Path

When the user provides a concrete Jira key such as `KAN-110`, avoid broad Rovo
Search as the first step.

Use the direct Jira path instead:

1. get accessible Atlassian resources and use the `sandicts.atlassian.net`
   cloud id
2. call the direct Jira issue tool for the known key
3. use JQL only when a Jira list, parent issue set, or filtered backlog is
   needed
4. use direct transition/comment tools for approved status or comment updates

Use Rovo Search only for open-ended Jira/Confluence discovery where the target
issue, page, or JQL filter is not already known.

## Boundaries

- Do not store tokens, credentials, secrets, private config, local absolute
  paths, or personal preferences in this repository.
- Do not duplicate shared product or business rules in frontend docs.
- Commit generated OpenAPI client output under
  `src/lib/api/generated/sandicts-api`, but never edit it manually.
- Keep build output, local env files, dev logs, and other disposable generated
  artifacts out of Git.
- Prefer small, task-focused project skills over broad generic instructions.
- Do not read long specs just because they are related; read them only when the
  task needs their detailed sections.

## Current Project Docs

Use `docs/ai/index.md` as the canonical catalog and reading router.

Main roots:

- `docs/ai/`: frontend repository operating context, Jira workflow, and
  task-finalization workflow.
- `docs/frontend/`: frontend planning, stack, page, screen, delivery, and
  discovery docs.
- `sandicts/sandicts-docs:docs/`: shared product, entity, business-rule,
  scope, and Jira planning docs.
- `sandicts/nodejs-sandicts-api:docs/ai/`: backend API, architecture,
  validation, error, and implementation docs.
