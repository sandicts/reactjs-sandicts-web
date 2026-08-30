---
name: jira-pr-commit-writer
description: Use when working in the Sandicts Web repository and the user asks for a Jira task, issue text, PR title, PR description, commit message, release note, or delivery summary after implementing or planning a frontend change.
---

# Jira PR Commit Writer

## Purpose

Generate consistent Jira comments, pull request descriptions, commit messages,
and delivery summaries for Sandicts Web work.

Use repository evidence first: the user request, changed files, `git diff`,
`git status`, `docs/ai/index.md`, and any relevant source-of-truth document
under `docs/ai/` or `docs/frontend/`.

When finishing a task, preparing commits, opening a PR, updating a PR title, or
producing a delivery summary, read `docs/ai/task-finalization-workflow.md`
and `fradelli/sandicts-docs:docs/ai/pull-request-standard.md` first.

For Jira roadmap, backlog, Epic, Story, Task, Subtask, Bug, or issue-planning
requests, read `docs/ai/jira-operating-workflow.md` first. When product scope,
entity names, business rules, or shared Jira planning matter, read
`fradelli/sandicts-docs`; when API contracts matter, read
`fradelli/nodejs-sandicts-api`.

## Output Contract

Default language:

- Use English for Jira titles, Jira descriptions, PR titles, PR descriptions,
  commit messages, release notes, and delivery summaries unless the user
  explicitly requests another language.
- Follow `docs/ai/task-finalization-workflow.md` and
  `fradelli/sandicts-docs:docs/ai/pull-request-standard.md` for PR titles, PR
  bodies, validation, and commit messages.

## PR Publishing Preflight

This skill overrides generic GitHub publishing defaults in Sandicts
repositories.

Before creating or updating any Sandicts pull request:

1. Identify the primary Jira key from the active task, branch, or user request.
2. Inspect `.github/pull_request_template.md`.
3. Build the title with the Sandicts format, not the publishing tool default.
4. Build the body with the local template headings in the exact same order.
5. Confirm the title does not start with `[codex]`, a branch name, or any
   non-Jira prefix.
6. Confirm the body does not use shortened alternatives such as `What changed`,
   `Why`, or a free-form validation list.

When another skill or tool is also used to publish changes, including
`github:yeet`, apply this skill's PR title and body rules after staging and
validation but before `gh pr create`, connector PR creation, or `gh pr edit`.
The generic tool can still handle git mechanics, push, and PR creation, but its
default title/body conventions do not apply to Sandicts work.

After creating or editing the PR, immediately verify the result with
`gh pr view <number> --json title,body,url` or the GitHub connector. If the
title or body is not compliant, update it before reporting success to the user.

## PR Title

Use this format:

```text
[KAN-123] <type>(<scope>): <short summary>
```

Examples:

```text
[KAN-110] docs(frontend): add AI and Jira context
[KAN-111] ci(frontend): add PR validation workflow
[KAN-112] docs(process): add frontend PR template
```

Rules:

- The primary Jira key must be the first characters in the PR title.
- Never use `[codex]`, a branch name, or a title without a Jira key.
- If a generic publishing tool suggests another title, override it with this
  Sandicts format before opening or updating the PR.
- Do not rely on `gh pr create --fill` or optional connector fields to infer a
  compliant PR title.
- Follow the same PR title format in every Sandicts repository.

## PR Description

Always inspect `.github/pull_request_template.md` and preserve the template
headings and order exactly.

Use the same PR body structure across Sandicts repositories. Repository-specific
differences belong in the `Validation` and `Notes` sections, not in a different
template shape.

Never create or leave a PR with a blank body, omitted body, raw template
placeholders, or a shortened alternative body.

Frontend validation defaults:

- docs-only: `git diff --check`
- frontend app/config: `npm run lint`, `npm run typecheck`, `npm run build`
- dependency/security: `npm audit --audit-level=moderate`
- tests: run when test tooling exists and the change touches behavior covered
  by tests

## Commit Message

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Types:

- `feat`: user-visible behavior or capability
- `fix`: bug fix
- `refactor`: code restructuring without behavior change
- `docs`: documentation-only change
- `test`: test-only change
- `ci`: CI/CD change
- `chore`: repository maintenance

Scopes:

- Prefer concrete scopes such as `frontend`, `auth`, `layout`, `docs`,
  `process`, `ci`, `config`, or the affected feature area.

Rules:

- Use imperative mood.
- Keep the first line under 72 characters when practical.
- The PR title carries the Jira key by default.
- Do not include a Jira key in the commit unless the user explicitly asks for
  it or the commit will be consumed outside PR context.

## Evidence Checklist

Before generating final text:

- Inspect `git status --short` and `git diff --stat` when changes exist.
- Inspect relevant file diffs when the task depends on exact implementation
  details.
- Read relevant `docs/ai/` and `docs/frontend/` context.
- Separate facts from assumptions. Label assumptions explicitly when needed.
