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

Use Node.js 24 LTS and npm 11.

```bash
node -v
npm -v
```

The expected local baseline is:

- Node.js `24.x`
- npm `11.x`

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
npm run start
```

## Repository Decision

The frontend lives in `sandicts/reactjs-sandicts-web`, separate from
`sandicts/nodejs-sandicts-api`.

This keeps frontend CI, deployment, package management, and preview environments
independent while the backend remains the source of truth for business rules and
OpenAPI contracts.
