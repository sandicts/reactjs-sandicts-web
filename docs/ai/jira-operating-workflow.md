---
title: Sandicts Web Jira Operating Workflow
doc-type: jira-workflow
role: source-of-truth
priority: high
canonical: docs/ai/jira-operating-workflow.md
related:
  - docs/ai/index.md
  - docs/ai/task-finalization-workflow.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
scope: jira, kanban, planning, status, frontend
read-when:
  - reading a known Sandicts Jira issue
  - planning or implementing a frontend Jira task
  - creating, commenting, or transitioning Jira issues
  - checking current frontend backlog status
do-not-read-when:
  - working without Jira context
---

# Sandicts Web Jira Operating Workflow

## Purpose

Define the fast Jira path for frontend work in `sandicts/reactjs-sandicts-web`.

## Jira Project

- Jira project key: `KAN`
- Site: `sandicts.atlassian.net`
- Frontend foundation Epic: `KAN-46`

Always re-check Jira before changing status, comments, dates, or issue details.

## Jira Fast Path

When the user gives a concrete Jira key such as `KAN-110`, use direct Jira
access first.

Recommended lookup order:

1. get accessible Atlassian resources and select `sandicts.atlassian.net`
2. call the direct Jira issue tool for the known issue key
3. use JQL for known backlog slices, such as `parent = KAN-46`
4. call direct transition and comment tools only after the requested Jira
   mutation is clear

Use broad Rovo Search only for open-ended Jira or Confluence discovery where
the issue, page, or JQL filter is unknown.

## Frontend Reading Path For Jira Work

For frontend Jira work, read local docs first:

1. `docs/ai/project-context.md`
2. `docs/frontend/sandicts-frontend-planning.md`
3. `docs/frontend/sandicts-mvp-delivery-roadmap.md`
4. `docs/frontend/sandicts-page-functional-spec.md` only when routes,
   permissions, page behavior, or user flows matter

Read backend docs only when the issue depends on product scope, business rules,
or API contracts.

## Status Meaning

- `A fazer`: backlog or ready, not actively being changed
- `Em Progresso`: active work is happening now
- `In Review`: implementation is complete and PR review is needed
- `Concluído`: accepted and no remaining work is expected
- `Canceled`: intentionally abandoned or superseded

## Transition Rules

- Move the active implementation issue to `In Review` only after opening the PR
  or PRs that deliver it.
- Add a concise Jira comment with PR links, validation, and any known gaps.
- Do not move a task to `Concluído` unless it has actually been accepted after
  review and no remaining work is expected.
- Leave related future tasks in their current status unless the user explicitly
  asks to move them.

## Issue Writing Rules

Use English for Jira issue titles and descriptions unless the user explicitly
asks for another language.

Prefer these frontend prefixes:

- `[Docs]`
- `[Frontend]`
- `[UX]`
- `[Design]`
- `[CI]`
- `[GitHub]`
- `[E2E]`

Acceptance criteria must be observable and should avoid vague statements such
as "frontend works" or "docs are better".
