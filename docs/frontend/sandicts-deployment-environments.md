---
title: Sandicts Frontend Deployment Environments
doc-type: frontend-architecture-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-deployment-environments.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-google-one-tap-experience.md
  - docs/frontend/sandicts-post-login-routing.md
  - sandicts/sandicts-docs:docs/decisions/frontend-deployment-target.md
  - sandicts/nodejs-sandicts-api:docs/ai/config/configuration-foundation.md
scope: deployment, environments, vercel, cors, cookies, authentication, seo
read-when:
  - configuring a frontend deployment
  - adding or changing frontend environment variables
  - integrating browser authentication with a deployed API
  - reviewing stable preview, indexing, CORS, or cookies
do-not-read-when:
  - changing only local presentation with no environment or API impact
---

# Sandicts Frontend Deployment Environments

## Decision

Use Vercel as the Next.js deployment provider for the MVP.

The environment model has three deployed runtime tiers:

1. local development
2. stable preview integration
3. production

Feature, fix, and `developer` pushes do not deploy. Stable preview and
production are deployed only by GitHub Actions after the repository CI validates
the exact post-merge SHA. Vercel's Git integration and automatic Git
deployments are not used.

This preserves host-only refresh cookies with `SameSite=Lax` and avoids
depending on third-party cookies or registering generated Vercel URLs with
Google Identity Services.

## Branch And Promotion Model

| Branch or source | Vercel environment | Purpose |
| --- | --- | --- |
| feature, fix, or `developer` | none | Code review, integration, and local execution only |
| `staging` | Preview with a fixed custom domain | Stable full-stack integration |
| `master` | Production | Public production release |

GitHub Actions remains the code quality and contract gate. `staging` and
`master` deployment workflows call the existing CI as a reusable workflow, then
check out and deploy the same `github.sha` only when all CI jobs succeed.

CD uses pinned Vercel CLI `58.4.4` with `vercel pull`, `vercel build`, and
`vercel deploy --prebuilt`. Preview assigns its stable domain with
`vercel alias set`; Production uses `vercel deploy --prebuilt --prod` and the
project's configured production domains.

## Proposed Origins

The values below become final only after domain ownership and DNS are
confirmed:

| Tier | Frontend | API |
| --- | --- | --- |
| local | `http://localhost:3001` | `http://localhost:3000` |
| stable preview | `https://preview.sandicts.com.br` | `https://api.preview.sandicts.com.br` |
| production | `https://sandicts.com.br` | `https://api.sandicts.com.br` |

`sandicts.com`, `www.sandicts.com`, and `www.sandicts.com.br` point to Vercel
and redirect to the canonical production origin `https://sandicts.com.br`.
Hostinger remains the authoritative DNS provider.

If product later separates a marketing site from the application, moving the
authenticated frontend to `app.sandicts.com.br` requires a coordinated
canonical URL, Google origin, email, CORS, and redirect migration.

## Browser Integration Matrix

| Tier | CORS origin | Credentials | Refresh cookie | Auth providers |
| --- | --- | --- | --- | --- |
| local | exact localhost frontend origin | `include` | `HttpOnly`, host-only, `SameSite=Lax`, `Secure=false`, `Path=/auth/refresh` | magic link and configured Google flows |
| stable preview | exact stable preview frontend origin | `include` | `HttpOnly`, host-only, `SameSite=Lax`, `Secure=true`, `Path=/auth/refresh` | magic link, Google Sign-In, and One Tap |
| production | exact production frontend origin | `include` | `HttpOnly`, host-only, `SameSite=Lax`, `Secure=true`, `Path=/auth/refresh` | magic link, Google Sign-In, and One Tap |

The API never uses a wildcard origin with credentials. Generated Vercel origins
are not part of the deployed CORS allowlist.

Do not add `Domain=.sandicts.com.br` to the refresh cookie. The backend owns the
cookie and the frontend does not need to read it.

## Authentication And Redirects

### Magic Link

`WEB_APP_BASE_URL` selects the trusted callback origin:

```text
<WEB_APP_BASE_URL>/sign-in/magic-link?token=<one-time-token>
```

The callback removes the token from browser history before consuming it through
`POST`.

### Google Sign-In And One Tap

Authorized JavaScript origins are limited to:

- `http://localhost:3001`
- the stable preview origin
- the production origin

Vercel-generated origins are not registered. Both explicit Google Sign-In and
One Tap send the Google credential to the same backend endpoint and produce the
same internal Sandicts session.

One Tap additionally requires:

- `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=true`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- HTTPS outside localhost
- the existing route and suppression policy
- validated CSP and `Cross-Origin-Opener-Policy` behavior when the GIS runtime
  is implemented

### Refresh And Logout

- browser requests use `credentials: "include"`
- access tokens remain in memory
- refresh uses `POST /auth/refresh`
- logout clears the backend session and emits a cookie deletion with the same
  name, path, SameSite, and Secure settings
- provider success uses the shared safe post-login resolver
- `returnTo` accepts only an internal non-auth route

## Frontend Environment Contract

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | public | deployed values are `local`, `preview`, or `production`; `pr-preview` remains accepted for compatibility but has no CD trigger |
| `NEXT_PUBLIC_API_BASE_URL` | public | absolute Sandicts API base URL |
| `NEXT_PUBLIC_AUTH_ENABLED` | public | enables browser auth in stable preview and production |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | public | Google web OAuth client ID |
| `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED` | public | independently enables One Tap |
| `WEB_ORIGIN` | server/build | canonical frontend origin |
| `SEO_INDEXING_ENABLED` | server/build | enables indexing only for production |
| `OPENAPI_SCHEMA_URL` | build/CI | optional API schema generation source |
| `PLAYWRIGHT_BASE_URL` | test runner | runs Playwright against an existing deployment |

`NEXT_PUBLIC_*` values are compiled into the browser bundle and are never
secrets. Changing one requires a new deployment.

Runtime validation enforces:

- HTTPS API URLs outside local development
- authentication disabled in `pr-preview`
- One Tap requires browser auth and a Google client ID
- production Next.js builds cannot enable indexing for a non-production tier

## Vercel Configuration Checklist

- create or link the project manually with Vercel CLI
- keep the GitHub repository disconnected from Vercel Git integration
- let Vercel detect Next.js without a provider-specific application adapter
- set project root to `.` and Node.js to `24.x`
- configure Preview and Production environment variables in Vercel
- add `preview.sandicts.com.br` and all production or redirect domains to the project
- create GitHub Environments `preview` and `production`
- store `VERCEL_TOKEN` as an environment secret
- store `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as GitHub variables
- expose no production secrets to Preview
- enable deployment protection where preview data or unfinished screens require it
- keep automatic Vercel rollback available
- restrict the GitHub `preview` environment to `staging`
- restrict the GitHub `production` environment to `master` and require approval

No `vercel.json` is required by the current application. Add it only when a
reviewed requirement cannot be expressed through the Vercel project settings or
`next.config.ts`.

## Validation

Every `staging` deployment must:

- run only after all reusable CI jobs pass
- check out and serve the exact post-merge SHA
- use only Vercel Preview variables
- emit `noindex`
- avoid production data and secrets
- assign `preview.sandicts.com.br` to the created deployment
- leave feature, fix, and `developer` pushes without deployments

Stable preview must validate:

- HTTPS and custom-domain routing
- credentialed CORS
- refresh cookie attributes
- magic link callback
- Google authorized origin
- Google Sign-In and One Tap
- refresh rotation and logout
- post-login and expired-session redirects

Production promotion additionally validates canonical URLs, sitemap, TLS,
observability, and rollback to the previous healthy deployment.

## Rollback

- promote the last healthy Vercel deployment
- reassign `preview.sandicts.com.br` to the last healthy Preview deployment
- restore the previous environment-variable version
- revert DNS only when the provider or custom-domain target changed
- preserve cookie name and path across emergency rollback
- never widen CORS to `*` as a recovery action

## Dependencies

- KAN-29 owns creation and configuration of the Vercel project
- KAN-30 owns the API deployment target and real API origins
- KAN-27 and KAN-28 own staging and production operational configuration
- KAN-125 consumes the real production origin for SEO
- Auth and E2E tasks own provider UI and end-to-end flow implementation
