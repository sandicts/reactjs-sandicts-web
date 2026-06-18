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
npm run typecheck
npm run build
npm run api:generate
npm run start
```

## API Client

API types and TanStack Query hooks are generated from the Nest API OpenAPI
contract with Orval.

The default local schema URL is:

```text
http://localhost:3000/docs-json
```

Generate the client with:

```bash
npm run api:generate
```

Use `OPENAPI_SCHEMA_URL` to override the schema source for CI, preview, or
non-default local environments:

```bash
OPENAPI_SCHEMA_URL=http://localhost:3000/docs-json npm run api:generate
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
- production build
- dependency audit for moderate or higher vulnerabilities

```bash
npm ci
npm run lint
npm run typecheck
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
independent while the backend remains the source of truth for business rules and
OpenAPI contracts.
