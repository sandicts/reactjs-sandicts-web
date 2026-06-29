# Sandicts Web

Frontend web application for Sandicts, built as a separate sibling repository to
the Nest API.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react
- npm

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

## Setup

```bash
npm install
cp .env.example .env.local
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
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

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

`npm run test:e2e` starts or reuses the Next.js app at
`http://localhost:3001` and runs the local Chromium project. Unit, component,
and hook files stay beside their source as `*.test.ts` or `*.test.tsx`. E2E
specs live in `e2e` as `*.spec.ts`. Keep one-off setup inside its spec and add
shared builders, fixtures, or render helpers to `test/support` only after more
than one spec needs them.

Prefer accessible roles, names, labels, and observable behavior over CSS
selectors, implementation details, or snapshots. Async Server Component flows
belong in E2E coverage rather than jsdom component tests.

## API Client

API types and TanStack Query hooks are generated from the Nest API OpenAPI
contract with Orval.

The default schema sources are tried in order:

```text
../nodejs-sandicts-api/openapi/sandicts-api.json
https://raw.githubusercontent.com/sandicts/nodejs-sandicts-api/developer/openapi/sandicts-api.json
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
Actions `CI PR` workflow.

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

The frontend lives in `sandicts/reactjs-sandicts-web`, separate from
`sandicts/nodejs-sandicts-api`.

This keeps frontend CI, deployment, package management, and preview environments
independent. Shared product and business rules live in
`sandicts/sandicts-docs`; backend API contracts live in
`sandicts/nodejs-sandicts-api`.
