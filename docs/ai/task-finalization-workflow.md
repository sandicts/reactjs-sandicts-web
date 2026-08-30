---
title: Sandicts Web Task Finalization Workflow
doc-type: delivery-workflow
role: source-of-truth
priority: high
canonical: docs/ai/task-finalization-workflow.md
related:
  - docs/ai/ci-cd/security-audit-remediation.md
  - docs/ai/jira-operating-workflow.md
  - fradelli/sandicts-docs:docs/ai/pull-request-standard.md
  - .codex/skills/jira-pr-commit-writer/SKILL.md
  - .github/pull_request_template.md
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
12. Open or update the pull request and enable delete branch after merge.
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

Follow `fradelli/sandicts-docs:docs/ai/pull-request-standard.md`.

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

Rules:

- Put the primary Jira key at the start of every PR title.
- Never open or leave a Sandicts PR titled with `[codex]`, only a branch name,
  or no Jira key.
- If a publishing helper or GitHub UI proposes a different title, rewrite it to
  the Sandicts format before creating the PR.
- Do not rely on `gh pr create --fill` or optional connector fields to infer a
  compliant PR title.
- Use the same title format in the frontend, backend, and shared docs
  repositories.

## Pull Request Body Standard

Follow `fradelli/sandicts-docs:docs/ai/pull-request-standard.md` and always
use `.github/pull_request_template.md`.

Rules:

- Describe only the current PR changes, not the full parent Epic.
- Include the primary Jira key and related Jira keys under `Notes`.
- Move the delivered Jira issue to `In Review` after opening the PR.
- Confirm GitHub is set to delete the source branch after the PR is merged.
- Mark validation boxes only for commands or checks that actually ran or CI
  checks that actually passed.
- Mention known gaps, skipped validations, or docs-only rationale explicitly.
- Update the PR body if the scope changes after opening the PR.
- Keep the same PR body section structure across Sandicts repositories.
  Repository-specific differences belong in `Validation` and `Notes`.
- Do not create or leave a PR with a blank body, omitted body, raw placeholders,
  or a shortened alternative body.

## Validation Rule

Validation must match the repository and the change type.

For frontend docs-only changes:

```bash
git diff --check
```

For frontend app, configuration, or setup changes:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

When an unrelated task reveals an audit failure already present on its base
branch, keep that task's diff unchanged. Create or reuse a dedicated security
Jira task and remediation PR, merge it first, then update the blocked branch
from `developer`. Do not remove the audit job, lower its threshold, or mix
dependency changes into the unrelated PR. The frontend workflow lives in
`docs/ai/ci-cd/security-audit-remediation.md`; the cross-repository standard
lives in
`fradelli/sandicts-docs:docs/ai/dependency-security-remediation.md`.

Run tests when test tooling is present and the change touches behavior covered
by tests. Frontend CI is expected to be configured by `KAN-111`; until then,
local validation must be called out clearly in the PR and Jira comment.

For shared docs repository changes:

- run `git diff --check`
- inspect the changed docs or skill metadata
- do not mark lint, typecheck, tests, build, or dependency audit as complete
  unless that repository has those commands configured and they actually ran

For backend repository changes, follow
`fradelli/nodejs-sandicts-api:docs/ai/task-finalization-workflow.md`.

## Jira Status Rule

After the PR is opened for delivered work:

1. move the primary Jira issue to `In Review`
2. add a Jira comment with PR link, implemented scope, validation, and known
   gaps
3. do not move the issue to `Concluído` until review and merge are accepted

If a delivery spans backend and frontend PRs, include both links in the Jira
comment and move only the issues actually delivered by those PRs.
