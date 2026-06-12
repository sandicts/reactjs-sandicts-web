---
title: Sandicts Web Task Finalization Workflow
doc-type: delivery-workflow
role: source-of-truth
priority: high
canonical: docs/ai/task-finalization-workflow.md
related:
  - docs/ai/jira-operating-workflow.md
  - .codex/skills/jira-pr-commit-writer/SKILL.md
scope: git, github, jira, commits, pull-requests, validation, frontend
read-when:
  - finishing a Jira task
  - preparing commits for a completed frontend task
  - opening or updating a pull request
  - writing a PR title, PR description, commit message, or delivery summary
do-not-read-when:
  - planning Jira backlog before implementation
---

# Sandicts Web Task Finalization Workflow

## Purpose

Define the standard frontend workflow for finishing a Jira task, validating the
change, committing the right files, opening a pull request, and moving Jira to
review.

## Finalization Checklist

Before committing:

1. Identify the active Jira key and delivery scope.
2. Check the current branch name.
3. Inspect `git status --short`.
4. Inspect `git diff --stat`.
5. Inspect relevant file diffs.
6. Confirm changed files belong to the active task.
7. Leave unrelated local changes unstaged.
8. Run validation that matches the risk of the change.
9. Stage only files that belong to the task.
10. Commit with the standard commit message format.
11. Push the branch.
12. Open or update the pull request.
13. Watch available CI checks.
14. Move the delivered Jira issue to `In Review`.

## Branch Rule

Use Jira-aware branch names:

```text
codex/KAN-123-short-description
docs/KAN-123-short-description
feature/KAN-123-short-description
fix/KAN-123-short-description
hotfix/KAN-123-short-description
refactor/KAN-123-short-description
test/KAN-123-short-description
ci/KAN-123-short-description
chore/KAN-123-short-description
rc/KAN-123-short-description
```

Protected branch targets follow the backend flow:

```text
developer
staging
master
```

## Commit Message Standard

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Common frontend examples:

```text
docs(frontend): add AI operating context
feat(auth): build sign-in shell
fix(layout): prevent mobile overflow
ci: add frontend PR validation
```

The PR title carries the Jira key by default. Regular commit messages can omit
the Jira key when the branch and PR title already carry it.

## Pull Request Title Standard

Use:

```text
[KAN-123] <type>(<scope>): <short summary>
```

Examples:

```text
[KAN-110] docs(frontend): add AI and Jira context
[KAN-111] ci(frontend): add PR validation workflow
[KAN-112] docs(process): add frontend PR template
```

## Pull Request Body Standard

Until `KAN-112` adds a frontend PR template, use the Sandicts backend template
shape:

```md
## Summary

## Problem

## Root cause

## Changes

## Files added or updated

## Impact

### Fixed

### Not changed

## Validation

- [ ] lint
- [ ] typecheck
- [ ] tests
- [ ] build
- [ ] dependency audit (CI: Dependency audit)
- [ ] manual validation completed

## Notes
```

Mark validation boxes only for commands or checks that actually ran.

## Validation Rule

For docs-only changes:

```bash
git diff --check
```

For frontend app or setup changes:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

Run tests when test tooling is present and the change touches behavior covered
by tests. Frontend CI is expected to be configured by `KAN-111`; until then,
local validation must be called out clearly in the PR and Jira comment.

## Jira Status Rule

After the PR is opened for delivered work:

1. move the primary Jira issue to `In Review`
2. add a Jira comment with PR link, implemented scope, validation, and known
   gaps
3. do not move the issue to `Concluído` until review and merge are accepted

If a delivery spans backend and frontend PRs, include both links in the Jira
comment and move only the issues actually delivered by those PRs.
