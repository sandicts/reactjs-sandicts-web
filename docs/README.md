# Sandicts Web Docs

This repository is the canonical home for Sandicts frontend documentation.

## Frontend Docs

- `docs/frontend/sandicts-frontend-context.md`: product feel, UX direction, and frontend positioning
- `docs/frontend/sandicts-frontend-tech-decisions.md`: frontend stack and architecture decisions
- `docs/frontend/sandicts-frontend-planning.md`: frontend start criteria and fullstack delivery model
- `docs/frontend/sandicts-mvp-delivery-roadmap.md`: frontend and fullstack MVP delivery roadmap
- `docs/frontend/sandicts-page-functional-spec.md`: page inventory, routes, permissions, and flow behavior
- `docs/frontend/sandicts-mvp-screens-spec.md`: detailed MVP screen and state notes
- `docs/frontend/discovery/`: historical discovery input, not the current source of truth

## AI And Delivery Docs

- `docs/ai/index.md`: AI routing and reading paths
- `docs/ai/project-context.md`: frontend repository setup, ownership, and boundaries
- `docs/ai/jira-operating-workflow.md`: Jira fast path and status workflow
- `docs/ai/task-finalization-workflow.md`: commit, PR, validation, and Jira review workflow

## Codex Skills

- `.codex/skills/sandicts-frontend-project-context/SKILL.md`: frontend project routing
- `.codex/skills/jira-pr-commit-writer/SKILL.md`: Jira, PR, commit, and delivery text

## Cross-Repo Sources

The backend API repository remains the source of truth for:

- product scope and MVP boundaries
- Sandicts business rules
- backend architecture and API contracts
- shared backend implementation details

When frontend documentation references backend-owned rules, keep the reference
explicit instead of duplicating the rule in this repository.

Cross-repository references use this notation:

```text
repository:path/to/file.md
```

Example:

```text
sandicts/nodejs-sandicts-api:docs/ai/product/sandicts-mvp-scope.md
```
