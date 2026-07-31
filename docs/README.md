# Sandicts Web Docs

This repository is the canonical home for Sandicts frontend documentation.

## Frontend Docs

- `docs/frontend/sandicts-frontend-context.md`: product feel, UX direction, and frontend positioning
- `docs/frontend/sandicts-frontend-tech-decisions.md`: frontend stack and architecture decisions
- `docs/frontend/sandicts-deployment-environments.md`: Vercel environment, preview, CORS, cookie, and authentication deployment contract
- `docs/frontend/sandicts-expired-session-experience.md`: expired-session, return route, form draft, and forbidden UX decisions
- `docs/frontend/sandicts-post-login-routing.md`: provider-independent post-login routing, safe return route, context fallback, and Player profile-completion decisions
- `docs/frontend/sandicts-google-one-tap-experience.md`: One Tap route placement, suppression, fallback, browser, and privacy decisions
- `docs/frontend/sandicts-local-ui-state.md`: state ownership and Zustand boundaries
- `docs/frontend/sandicts-mobile-navigation.md`: responsive navigation and context-switcher decisions
- `docs/frontend/sandicts-mvp-visual-system.md`: MVP tokens, components, states, and accessibility direction
- `docs/frontend/prototypes/player-profile-selectors/README.md`: approved Player profile sport and level selector behavior, states, copy, and target contract
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

## GitHub Workflow

- `.github/pull_request_template.md`: standard frontend pull request body
- `.github/workflows/ci-pr.yml`: frontend pull request validation workflow

## Cross-Repo Sources

The shared documentation repository `sandicts/sandicts-docs` is the source of
truth for:

- product scope and MVP boundaries
- Sandicts business rules
- entity glossary and naming
- shared Jira planning workflow details
- cross-app API compatibility and delivery rules

The backend API repository remains the source of truth for:

- backend architecture and API contracts
- generated OpenAPI artifact and semantic HTTP behavior
- shared backend implementation details

When frontend documentation references shared product rules or backend-owned API
rules, keep the reference explicit instead of duplicating the rule in this
repository.

Cross-repository references use this notation:

```text
repository:path/to/file.md
```

Example:

```text
sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
```
