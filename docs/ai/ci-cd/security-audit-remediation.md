---
title: Sandicts Web Security Audit Remediation
doc-type: remediation-workflow
role: repository-guidance
priority: high
canonical: docs/ai/ci-cd/security-audit-remediation.md
related:
  - docs/ai/task-finalization-workflow.md
  - fradelli/sandicts-docs:docs/ai/dependency-security-remediation.md
  - fradelli/nodejs-sandicts-api:docs/ai/ci-cd/security-audit-remediation.md
scope: frontend, npm-audit, dependency-security, dependency-overrides, pull-requests, jira
read-when:
  - fixing a frontend npm audit failure
  - updating frontend dependencies or overrides for security
  - responding to a dependency audit CI failure
do-not-read-when:
  - changing frontend behavior without dependency or CI security impact
  - updating unrelated feature or product documentation
---

# Sandicts Web Security Audit Remediation

## Purpose

Apply the shared Sandicts dependency-security standard to the frontend without
hiding risk, weakening CI, or mixing pre-existing vulnerabilities into an
unrelated delivery.

The cross-repository policy lives in
`fradelli/sandicts-docs:docs/ai/dependency-security-remediation.md`. Backend
repository commands and dependency paths remain backend-owned.

## Isolation Rule

When an unrelated pull request exposes a dependency audit failure that already
exists on its base branch:

1. Confirm that the unrelated pull request does not change `package.json` or
   `package-lock.json`.
2. Create or reuse a dedicated security Jira task.
3. Create a `chore/KAN-*-...` branch from `developer`.
4. Remediate dependencies in a separate `chore(security)` commit and pull
   request.
5. Keep the audit job and its `moderate` threshold blocking.
6. Merge the security pull request before updating the blocked pull request
   from `developer`.
7. Confirm the blocked pull request has no dependency remediation in its own
   diff.

Do not add dependency or lockfile changes to the unrelated pull request merely
to make its CI green.

## Required Workflow

When `npm audit --audit-level=moderate` fails:

1. Reproduce the failure locally with the same command.
2. Inspect `npm audit --json`.
3. Identify vulnerable paths with `npm explain <package>`.
4. Check supported patched versions in the npm registry.
5. Prefer the smallest compatible remediation.
6. Validate the lockfile from a clean install.
7. Run the complete frontend validation matrix.
8. Record the dependency paths, fix selection, validation, and residual risk in
   the pull request and Jira task.

## Fix Selection

Use this order:

1. Upgrade a direct dependency inside the supported major range.
2. Refresh the lockfile when an existing range already permits a patched
   transitive version.
3. Add a narrow override when the supported upstream still pins a vulnerable
   transitive version.
4. Use `npm audit fix --force` only after explicit approval and a compatibility
   plan.

Do not downgrade a framework or tool to the audit command's suggested version
when that would cross the repository's supported architecture baseline.

## Frontend Validation

Run:

```bash
npm ci
npm audit --audit-level=moderate
npm run quality
npm run test:ci
npm run api:check
npm run build
```

When an override affects a CLI or generated-client tool, also execute the
relevant command such as `npm run ui:info` or `npm run api:generate` and verify
that it does not create unrelated output drift.

## Override Requirements

Overrides must:

- target the narrowest dependency path npm supports
- select a published patched version
- document the upstream package that still pins the vulnerable version
- pass the tool or runtime validation affected by the override
- remain visible in the PR description and Jira record
- be removed after upstream dependency ranges make them unnecessary

## Delivery Record

Every remediation records:

- vulnerable package names and severities
- direct or transitive ownership
- dependency paths
- selected upgrades, lockfile refreshes, and overrides
- rejected breaking alternatives
- validation commands and results
- residual risk or follow-up

Use a dedicated `chore(security): ...` commit for dependency and lockfile
changes. Use a separate `docs(security): ...` commit when repository guidance
changes in the same pull request.
