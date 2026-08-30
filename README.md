# Sandicts Web

Frontend web application for Sandicts, built as a separate sibling repository to
the Nest API.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Phosphor Icons
- npm

## UI Foundation

shadcn/ui is configured through `components.json` for the Radix Nova preset,
Tailwind CSS v4, React Server Components, TypeScript, Phosphor icons, Stone
surfaces, Amber actions, and the existing `@/*` source alias.

Inspect the current configuration or add a component with:

```bash
npm run ui:info
npm run ui:add -- button
```

Low-level primitives live in `src/components/ui`. Cross-feature compositions
live in `src/components/shared` when more than one feature needs them. Feature
screens should import primitives from `@/components/ui/*` and must not edit
generated or copied registry code at call sites to compensate for a shared
visual rule.

The semantic token and component contract lives in:

```text
docs/frontend/sandicts-mvp-visual-system.md
```

Use semantic utilities such as `bg-card`, `text-muted-foreground`,
`border-border`, and `ring-ring`. Keep raw palette names and repeated color
values out of shared component APIs. Add new shadcn/ui primitives only when a
real screen needs them instead of generating the complete catalog up front.

## Runtime

Use npm as the package manager, with Node.js 24 LTS and npm 11.

```bash
node -v
npm -v
```

The expected local baseline is:

- Node.js `24.x`
- npm `11.x`
- package manager `npm`

## Sandicts Development Workstation

This repository is one part of the Sandicts multi-repository development
workspace. Codex, GitHub, Jira, backend, frontend, local environments, and
optional Vercel operator access are documented once in the shared guide:

```text
../sandicts-docs/docs/engineering/development-workstation-onboarding.md
```

The canonical GitHub location is:

```text
https://github.com/fradelli/sandicts-docs/blob/main/docs/engineering/development-workstation-onboarding.md
```

Vercel is not required for frontend development or for CD to run after a merge.
This README owns only the frontend-specific setup below.

## Local Frontend Setup

Start the application after installing dependencies and creating `.env.local`:

```bash
npm run dev
```

The web app runs on:

```text
http://localhost:3001
```

The local API is expected at:

```text
http://localhost:3000
```

Configure the API URL with:

```env
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=false
```

Configure the absolute web origin used by canonical URLs, social metadata,
`robots.txt`, and `sitemap.xml` with:

```env
WEB_ORIGIN=http://localhost:3001
SEO_INDEXING_ENABLED=false
```

Indexing is disabled by default. Enable it only for the public production
deployment, together with a non-local HTTPS `WEB_ORIGIN`. Preview, test, and
local environments should keep `SEO_INDEXING_ENABLED=false`.

`NEXT_PUBLIC_APP_ENV` accepts `local`, `pr-preview`, `preview`, or
`production`. Browser authentication is intentionally disabled in
`pr-preview`; complete magic-link, Google, refresh-cookie, and logout validation
runs against local or the stable preview environment.

## Scripts

```bash
npm run dev
npm run lint
npm run lint:fix
npm run typecheck
npm run format
npm run format:check
npm run quality
npm test
npm run test:ci
npm run test:watch
npm run test:e2e
npm run test:e2e:ui
npm run build
npm run api:generate
npm run api:check
npm run start
```

## Code Quality

TypeScript runs in strict mode. ESLint owns correctness rules, while Prettier
owns code formatting. Run the complete local quality gate with:

```bash
npm run quality
```

Use `npm run lint:fix` for safe ESLint fixes and `npm run format` for mechanical
formatting. Generated Orval output is excluded from linting and formatting
because `npm run api:generate` owns those files.

Use the `@/*` alias for stable imports from `src/*` when crossing folders. Keep
sibling implementation and type imports relative.

## Testing

Install the local Chromium binary once before the first E2E run:

```bash
npx playwright install chromium
```

If Windows Application Control blocks Playwright-managed executables, use the
installed Chrome channel without hardcoding a machine path:

```powershell
$env:PLAYWRIGHT_BROWSER_CHANNEL = "chrome"
npm run test:e2e
```

Use Vitest for fast unit, contract, component, and hook behavior:

```bash
npm test
npm run test:watch
```

Use Playwright for user-visible flows across real routes:

```bash
npm run test:e2e
npm run test:e2e:ui
```

Run the deterministic auth happy path by itself with:

```bash
npm run test:e2e -- e2e/auth-happy-path.spec.ts
```

The auth E2E fixture in `e2e/fixtures/auth.fixture.ts` replaces Google Identity
Services and the browser auth API contract inside Playwright. It uses only
clearly fake credentials, account data, access tokens, and session IDs. The
test never requires a real Google account, OAuth client secret, refresh cookie,
API process, or committed environment file. Keep real credentials and captured
production tokens out of E2E fixtures and artifacts.

For a CI-like run, install the managed browser and enable Playwright's CI
retries and single-worker behavior before running the same spec:

```bash
npx playwright install --with-deps chromium
CI=1 npm run test:e2e -- e2e/auth-happy-path.spec.ts
```

On Windows, if Application Control blocks the managed browser, use the
installed Chrome fallback shown above. The fake public client ID configured by
`playwright.config.ts` is only a local web-server placeholder that lets the
intercepted provider UI initialize; it is not a credential or a deployable
OAuth client ID.

`npm run test:e2e` starts or reuses the Next.js app at
`http://localhost:3001` and runs the local Chromium project. Unit, component,
and hook files stay beside their source as `*.test.ts` or `*.test.tsx`. E2E
specs live in `e2e` as `*.spec.ts`. Keep one-off setup inside its spec and add
shared builders, fixtures, or render helpers to `test/support` only after more
than one spec needs them.

Prefer accessible roles, names, labels, and observable behavior over CSS
selectors, implementation details, or snapshots. Async Server Component flows
belong in E2E coverage rather than jsdom component tests.

Set `PLAYWRIGHT_BASE_URL` to run the same suite against an existing stable
preview or production deployment without starting the local Next.js server.

## API Client

API types and TanStack Query hooks are generated from the Nest API OpenAPI
contract with Orval.

The default schema sources are tried in order:

```text
../nodejs-sandicts-api/openapi/sandicts-api.json
https://raw.githubusercontent.com/fradelli/nodejs-sandicts-api/developer/openapi/sandicts-api.json
```

Generate the client with:

```bash
npm run api:generate
```

Use `OPENAPI_SCHEMA_URL` to override the schema source:

```bash
OPENAPI_SCHEMA_URL=http://localhost:3000/docs-json npm run api:generate
```

Verify that committed generated output is current with:

```bash
npm run api:check
```

Generated files live under:

```text
src/lib/api/generated/sandicts-api
```

Do not edit generated files manually. Application code should use semantic
feature hooks or adapters instead of importing generated operations directly
from screens.

## CI

Pull requests targeting `developer`, `staging`, or `master` run the GitHub
Actions `CI PR` workflow. The same workflow is reusable by the deployment
workflows so the exact post-merge SHA is validated before deployment without
copying test commands into CD.

The workflow uses Node.js from `.nvmrc`, npm cache keyed by `package-lock.json`,
and validates:

- branch name and pull request target branch
- lint
- TypeScript typecheck
- Vitest unit, contract, component, and hook tests
- generated API contract drift
- production build
- dependency audit for moderate or higher vulnerabilities

```bash
npm ci
npm run lint
npm run typecheck
npm run test:ci
npm run api:check
npm run build
npm audit --audit-level=moderate
```

Temporary branches must follow the same pattern used by the backend repository:

```text
(feature|fix|hotfix|docs|refactor|test|ci|chore|rc|codex)/KAN-123-short-description
```

Pull requests use:

```text
.github/pull_request_template.md
```

Environment promotions use
`.github/PULL_REQUEST_TEMPLATE/release-promotion.md`; dependency-security
remediations use
`.github/PULL_REQUEST_TEMPLATE/vulnerability-remediation.md`. Governance
enforces `developer -> staging -> master`, the exact promotion title, the
source commit, rollback evidence, and Preview evidence before Production.

## Deployment

Vercel is the selected MVP frontend provider.

- feature, fix, and `developer` pushes do not create deployments
- a successful reusable CI run for a `staging` push creates a Vercel Preview
  deployment and assigns `preview.sandicts.com.br`
- a successful reusable CI run for a `master` push creates a Vercel Production
  deployment for `sandicts.com.br`
- GitHub Actions is the only CI/CD orchestrator; the Vercel Git integration and
  automatic Git deployments remain disabled
- CD uses Vercel CLI `58.4.4`, `vercel pull`, `vercel build`, and prebuilt
  deployments

The deployment workflows are:

```text
.github/workflows/cd-vercel-preview.yml
.github/workflows/cd-vercel-production.yml
```

Normal releases, security corrections, and recovery changes all enter through
`developer` and follow the same protected-branch promotion order. A merge to
`staging` deploys Preview; Production is promoted only after that exact release
is validated and merged from `staging` to `master`.

Create GitHub Environments named `preview` and `production`. Store
`VERCEL_TOKEN` as an environment secret, and configure `VERCEL_ORG_ID` and
`VERCEL_PROJECT_ID` as GitHub variables. Runtime and build variables remain in
the corresponding Vercel Preview and Production environments; do not commit
their deployed values or generated `.vercel` files.

The complete URL, CORS, cookie, variable, authentication, validation, and
rollback contract lives in:

```text
docs/frontend/sandicts-deployment-environments.md
```

The current application does not require `vercel.json`. Keep platform
configuration in Vercel project settings unless a reviewed requirement needs a
versioned provider-specific file.

## Documentation

Frontend AI routing and task workflow docs live in:

```text
docs/ai
```

Frontend planning, architecture, page, and roadmap docs live in:

```text
docs/frontend
```

Start with `docs/README.md` when deciding which frontend document to read.

## Repository Decision

The frontend lives in `fradelli/reactjs-sandicts-web`, separate from
`fradelli/nodejs-sandicts-api`.

This keeps frontend CI, deployment, package management, and preview environments
independent. Shared product and business rules live in
`fradelli/sandicts-docs`; backend API contracts live in
`fradelli/nodejs-sandicts-api`.
