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
first.

For Jira roadmap, backlog, Epic, Story, Task, Subtask, Bug, or issue-planning
requests, read `docs/ai/jira-operating-workflow.md` first. When product scope,
entity names, business rules, or shared Jira planning matter, read
`sandicts/sandicts-docs`; when API contracts matter, read
`sandicts/nodejs-sandicts-api`.

## Output Contract

Default language:

- Use English for Jira titles, Jira descriptions, PR titles, PR descriptions,
  commit messages, release notes, and delivery summaries unless the user
  explicitly requests another language.
- Follow `docs/ai/task-finalization-workflow.md` for PR titles, PR bodies, and
  commit messages.

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
