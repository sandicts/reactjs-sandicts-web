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

## Cross-Repo Sources

The backend API repository remains the source of truth for:

- product scope and MVP boundaries
- Sandicts business rules
- backend architecture and API contracts
- shared Jira planning workflow until the frontend repository owns its own AI
  operating context

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
