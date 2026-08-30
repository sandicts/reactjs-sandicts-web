---
name: sandicts-frontend-project-context
description: Use when working in the Sandicts Web repository and needing project-specific context for frontend architecture, code organization, setup, docs, validation, Jira, pull requests, routes, UX planning, or changes to docs/ai or .codex/skills.
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
   needed, read the referenced docs in `fradelli/sandicts-docs`.
7. When backend contracts, API behavior, validation, or backend architecture are
   needed, read the referenced docs in `fradelli/nodejs-sandicts-api`.
8. For cross-app API compatibility work, follow
   `fradelli/sandicts-docs:docs/decisions/api-contract-governance.md`.
9. Keep `.codex/skills/` for Codex operating instructions and `docs/ai/` for
   durable frontend project context.
10. When changing repository skills, validate the edited skill folder with a
   skill validation script when available.

## Code Organization Guardrail

Before adding or moving implementation files:

1. Inspect the target directory and identify its existing responsibilities.
2. Keep a directory flat only while it represents one small, cohesive
   responsibility that remains easy to scan.
3. Split growing directories by product area or technical responsibility when
   they begin mixing variants, shared composition, navigation, state, tests, or
   unrelated helpers.
4. Prefer responsibility names such as `navigation`, `chrome`, `context`,
   `player`, or `organization`; do not create dumping-ground folders such as
   `misc`, `common`, or generic nested `components`.
5. Colocate component contracts, tests, constants, and pure utilities with the
   component or subdomain that owns them.
6. Keep sibling implementation and `*.types.ts` imports relative. Use `@/*`
   when crossing distant source roots.
7. Reorganize an in-scope directory before adding more loose files when the new
   change would make ownership less obvious.
8. Do not add a generic `shared` layer when the parent already defines a
   cohesive module and direct responsibility folders make ownership clear.
9. Run typecheck, tests, and build after structural moves to catch stale imports
   and route-resolution regressions.

Use `docs/frontend/sandicts-frontend-tech-decisions.md` as the canonical source
for detailed file and directory organization rules.

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
- `fradelli/sandicts-docs:docs/`: shared product, entity, business-rule,
  scope, and Jira planning docs.
- `fradelli/nodejs-sandicts-api:docs/ai/`: backend API, architecture,
  validation, error, and implementation docs.
