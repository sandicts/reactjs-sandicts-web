---
title: Sandicts Frontend Tech Decisions
doc-type: frontend-architecture-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-frontend-tech-decisions.md
related:
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-planning.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - docs/frontend/sandicts-page-functional-spec.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
scope: frontend, architecture, stack, mvp, delivery
read-when:
  - creating the Sandicts frontend app
  - choosing frontend libraries or architecture
  - creating frontend foundation Jira issues
  - deciding frontend data fetching, forms, state, tests, or API clients
  - reviewing whether a frontend change follows the agreed stack
do-not-read-when:
  - changing backend-only implementation with no frontend contract impact
---

# Sandicts Frontend Tech Decisions

## Purpose

This document records the agreed frontend technical direction for Sandicts.

It should prevent the frontend from reopening already decided technology
choices while still keeping unresolved implementation details visible as roadmap
tasks.

## Decision Status

Decided:

- frontend application lives in the separate `sandicts/reactjs-sandicts-web`
  repository
- local frontend path is `apps/reactjs-sandicts-web`, sibling to the backend
  repository
- use npm as the package manager, with Node.js 24 LTS and npm 11
- use Next.js App Router with TypeScript
- use shadcn/ui with Tailwind CSS and lucide-react
- use TanStack Query for server state
- use Zod with React Hook Form for forms
- use Orval as the initial MVP OpenAPI generator for the Nest Swagger
  contract
- use Zustand only for local UI state, not API data
- use Playwright for E2E tests
- use Vitest with Testing Library for components and hooks
- use GitHub Actions for PR validation with Node.js 24 and npm 11
- use a feature-oriented frontend architecture with thin Next.js routes,
  reusable UI primitives, domain feature modules, and `lib/*` infrastructure
  boundaries
- use a semantic API integration architecture where generated OpenAPI code is a
  contract adapter under `lib/api`, not the frontend application API
- hydrate auth sessions on the client through the backend refresh cookie,
  in-memory access token storage, `GET /auth/me`, and TanStack Query

Still open:

- deployment target
- final route map
- final navigation details for Player, Organization, Academy, and Admin App
  areas

## Core Stack

### Repository Location

Decision:

- create and maintain the frontend in `sandicts/reactjs-sandicts-web`
- keep it as a separate sibling repository from `sandicts/nodejs-sandicts-api`
- use local path `apps/reactjs-sandicts-web`

Reason:

- the backend repository is already an independent Nest API with its own npm
  lockfile, Prisma workflow, CI checks, and deployment concerns
- converting the backend repository into a monorepo would add setup work before
  the MVP frontend has proven a need for shared packages
- separate repositories keep frontend CI, deployment, preview environments, and
  package management independent
- the frontend can still stay type-aligned with the backend by generating an
  OpenAPI client from the Nest Swagger contract

Consequences:

- local development runs the API and web app as separate processes
- the API should keep using port `3000`; the frontend should use port `3001`
  locally
- CORS, cookie/session behavior, and deployment URLs remain explicit follow-up
  decisions
- shared code packages should not be introduced until repeated cross-repo
  duplication creates a real maintenance cost

### Runtime And Package Management

Use:

- npm as the package manager
- Node.js 24 LTS
- npm 11

Rules:

- keep `.nvmrc`, `package.json` `engines`, `packageManager`,
  `package-lock.json`, README setup instructions, and CI validation aligned
- install dependencies with `npm ci` in CI
- use the npm lockfile as the source of truth for dependency resolution
- do not introduce pnpm, Yarn, or another package manager without a new
  documented decision

Current alignment:

- `.nvmrc` targets Node.js `24.16.0`
- `package.json` declares Node.js `>=24 <25`, npm `>=11 <12`, and
  `packageManager: npm@11.13.0`
- CI reads Node.js from `.nvmrc`, caches npm dependencies by
  `package-lock.json`, validates npm major version 11, and runs `npm ci`

Reason:

- this keeps the frontend aligned with the existing backend npm workflow while
  preserving independent frontend dependency ownership
- npm is sufficient for the single-repository MVP frontend and avoids early
  package-manager complexity

### Framework

Use:

- Next.js App Router
- React
- TypeScript

Rules:

- use App Router layouts for public, Player, Organization, Academy, and Admin App
  areas
- keep product and business rules in `sandicts/sandicts-docs`
- do not treat Next.js as a second business backend
- use server-side capabilities only when they improve routing, auth, metadata,
  initial reads, or user experience
- keep dynamic screen behavior client-friendly when the workflow is highly
  interactive

Reason:

- Sandicts has public discovery, authenticated player flows, Organization operations,
  role-based shells, and future public pages
- Next.js gives better room for route structure, metadata, images, and public
  acquisition surfaces than a pure SPA foundation
- the Nest backend remains the system of record for persistence, auth, and API
  contracts; shared docs remain the system of record for product rules

### UI And Styling

Use:

- shadcn/ui
- Tailwind CSS
- lucide-react

Rules:

- start with shadcn/ui primitives and customize tokens for Sandicts
- keep components owned in the frontend codebase instead of depending on a
  closed external design system
- use lucide-react for icons where an existing icon fits the control
- define Sandicts tokens early: color, radius, typography, spacing, status
  colors, focus rings, and surface styles
- keep Organization screens denser and more operational than player screens

Reason:

- shadcn/ui is fast for MVP delivery and easy to customize
- Sandicts needs a recognizable brand direction without spending the MVP on a
  full custom component system

### Server State

Use:

- TanStack Query

Rules:

- API data belongs in TanStack Query, not Zustand
- queries should be keyed by stable domain concepts
- mutations should invalidate or update relevant query caches intentionally
- loading, empty, error, stale, and optimistic states must be designed per flow
- do not mirror whole API resources into local global state

Examples of server state:

- current auth session
- player profile
- Organization profile
- court list
- availability slots
- discovery results
- reservations
- payments
- open matches

### Local UI State

Use:

- Zustand only where local UI state needs cross-component coordination

Allowed examples:

- active app area or context switcher state
- sidebar and mobile navigation state
- multi-step UI draft state that is not yet persisted
- modal orchestration when local component state is insufficient

Avoid:

- storing API collections in Zustand
- duplicating TanStack Query cache
- using Zustand as a persistence substitute

### Forms And Validation

Use:

- React Hook Form
- Zod
- `@hookform/resolvers`

Rules:

- client validation should improve UX, not replace backend validation
- form schemas should match backend contracts when practical
- backend validation and business-rule errors must still be rendered clearly
- field validation errors should appear inline when possible
- business-rule failures should appear near the action or workflow state

Primary form areas:

- sign-in states
- player profile onboarding
- Organization profile setup
- court creation/editing
- availability editor
- reservation request confirmation
- manual payment status update
- open match creation

### API Client

Use:

- Orval as the initial MVP OpenAPI generator
- generated TypeScript client and TanStack Query hooks from the Nest Swagger
  contract
- a custom Sandicts API request runtime for base URL, credentials, bearer access
  tokens, refresh retry, and normalized backend errors

Rules:

- do not hand-write broad API clients when the OpenAPI contract can generate
  types and request functions
- API contract stability is a start criterion for integrated frontend work
- do not implement code generation as part of `KAN-63`
- implement the generated-client workflow in `KAN-73` from the architecture
  decided in `KAN-113`
- keep generated OpenAPI code under `src/lib/api/generated/sandicts-api`
- commit generated OpenAPI code after generation, but never edit generated
  files manually
- expose semantic feature hooks and service adapters to the rest of the app
  instead of making generated operation names the UI language
- use one Sandicts request runtime for generated calls so auth, credentials,
  base URL, refresh retry, and error parsing stay consistent
- use `npm run api:generate` as the future regeneration command implemented by
  `KAN-73`

Reason:

- Orval fits the current MVP direction because it can generate typed request
  code and TanStack Query hooks from the backend OpenAPI contract
- the Orval path keeps the frontend close to the backend Swagger source while
  reducing hand-written client and hook boilerplate
- a semantic API layer keeps the generated client as a contract adapter instead
  of letting infrastructure vocabulary leak into product screens

### API Integration Architecture

Principle:

- the generated OpenAPI client is a contract adapter, not the frontend
  application API

Target boundaries:

```text
src/lib/api/
├── generated/
│   └── sandicts-api/
├── runtime/
│   ├── sandicts-api-request.ts
│   ├── sandicts-api-error.ts
│   └── sandicts-api-auth.ts
└── contracts/
    └── sandicts-api-error.types.ts

src/lib/auth/
├── auth-session-refresh.ts
├── auth-session-store.ts
└── auth-session.types.ts

src/lib/query/
├── query-client.ts
├── query-keys.ts
└── query-provider.tsx
```

Rules:

- `src/lib/api/generated/sandicts-api` is generated by Orval from the Nest
  Swagger/OpenAPI document
- generated files are committed so the frontend can build without the backend
  running in CI
- generated files are treated as disposable output and must not contain manual
  edits
- `src/lib/api/runtime/sandicts-api-request.ts` is the Orval custom request
  mutator for the Sandicts API
- `src/lib/api/runtime/sandicts-api-error.ts` parses normalized backend error
  responses into `SandictsApiError`
- `src/lib/api/runtime/sandicts-api-auth.ts` reads the current in-memory access
  token and coordinates one refresh retry when an authenticated request returns
  `401`
- `src/lib/auth/auth-session-store.ts` stores the current access token and
  authenticated account summary in memory only
- `src/lib/auth` owns browser auth bootstrap, refresh coordination, and session
  clearing helpers
- refresh tokens remain backend-owned `HttpOnly` cookies and must not be stored
  in `localStorage`, `sessionStorage`, Zustand, or React Query
- API requests use `credentials: 'include'` so the browser can send and receive
  the refresh-token cookie
- authenticated API requests include `Authorization: Bearer <accessToken>` only
  when an access token is present
- a failed authenticated request may trigger exactly one refresh attempt before
  the original request is retried
- refresh retry limits must use semantic constants such as
  `sessionRefreshRetryLimit`
- if refresh fails, the auth session is cleared and feature UI renders the
  approved expired-session or sign-in state
- CORS must allow the frontend origin and credentials before real browser
  integration can pass locally or in deployed environments

### Auth Session Hydration

Decision:

- use a client-first auth session hydration flow for the MVP
- keep the access token only in browser memory
- keep the refresh token backend-owned in an `HttpOnly` cookie
- use TanStack Query as the source of server-state truth for the current public
  session projection

Initial browser bootstrap:

1. When the app starts in the browser, the auth bootstrap should call
   `POST /auth/refresh` with `credentials: 'include'`.
2. If refresh succeeds, persist `{ account, session, accessToken,
   accessTokenExpiresAt }` in the in-memory auth session store.
3. After a successful refresh or sign-in, seed or invalidate
   `queryKeys.auth.session()` so the current-session query can load the public
   session projection.
4. If refresh fails because there is no valid refresh cookie, clear the
   in-memory auth session and let protected-route boundaries decide whether to
   render unauthenticated or expired-session UX.

Current session query:

- `GET /auth/me` is the canonical current-session read when the frontend has an
  access token.
- `GET /auth/me` returns only `{ account, session }`; it does not rotate the
  refresh cookie and does not return a new access token.
- the `queryKeys.auth.session()` query should call `GET /auth/me` only when an
  access token exists in memory
- a `401` from `GET /auth/me` should use the shared request runtime's single
  refresh retry; if the retry succeeds, the original request may run again
- `auth_session_inactive`, `invalid_access_token`, and refresh-token failures
  clear the in-memory auth session and private auth-dependent query data
- `account_auth_forbidden` keeps the user out of protected areas and is handled
  as forbidden UX, not as a silent retry loop

Session-producing mutations:

- `POST /auth/google/sign-in`, `POST /auth/refresh`, and future magic-link
  consume success responses must all hydrate the same in-memory snapshot shape:
  `{ account, session, accessToken, accessTokenExpiresAt }`
- sign-in and refresh must not expect a refresh token in the response body
- generated response types remain backend contracts; feature hooks expose
  semantic auth behavior to UI code

Route and rendering boundaries:

- Next.js middleware is not the MVP source of auth truth because the access
  token intentionally lives only in browser memory
- Server Components may render public shell and route structure, but they must
  not be responsible for proving the user's current auth session in the MVP
- protected route behavior should be implemented as a client boundary or
  protected layout that reads the auth session query and renders
  `checking`, `authenticated`, `unauthenticated`, or `forbidden` states
- the exact expired-session copy and redirect behavior belong to the expired
  session UX decision, while post-login destination rules belong to the
  post-login routing decision

Cache invalidation:

- successful sign-in, refresh, and future magic-link consume should set the
  in-memory auth session and refresh `queryKeys.auth.session()`
- sign-out and sign-out-all should clear the in-memory auth session and remove
  or invalidate private auth-dependent queries
- failed refresh should clear the in-memory auth session, clear private
  auth-dependent data, and leave public discovery cache intact
- feature modules should treat auth clearing as an infrastructure signal and
  avoid duplicating auth/session state in Zustand

Import rules:

- `app` routes, screens, visual components, and forms must not import generated
  OpenAPI modules directly
- feature hooks or feature service adapters may compose generated hooks or
  request functions when they expose semantic product behavior
- feature hooks should expose names such as `usePlayerProfile`,
  `useCreateReservation`, or `useJoinOpenMatch`, not raw generated operation
  names
- generated response types represent backend contracts; UI-facing view models
  and component props remain in feature `.types.ts` or `view-models` files
- create a feature wrapper when it adds auth behavior, request-variable
  validation, cache invalidation, error mapping, or view-model normalization

Error contract:

- the API runtime maps normalized backend error responses to `SandictsApiError`
- `SandictsApiError` preserves `statusCode`, `code`, `message`, `requestId`,
  and optional `issues`
- validation issues from `validation_error` are mapped near the relevant form
  fields when practical
- `business_rule_violation`, `forbidden`, `conflict`, and
  `resource_not_found` are rendered as workflow or action-level states
- `internal_error` uses a generic user-facing message and preserves safe
  diagnostic fields for logs or support surfaces
- feature code branches on stable backend `code` values, not on message text

TanStack Query rules:

- TanStack Query owns server state and Zustand remains limited to local UI state
- query client setup belongs in `src/lib/query/query-client.ts`
- app-level query provider setup belongs in `src/lib/query/query-provider.tsx`
- shared query keys belong in `src/lib/query/query-keys.ts`
- query keys should be semantic, for example `queryKeys.auth.session()`,
  `queryKeys.playerProfile.current()`, and
  `queryKeys.courts.discovery(filters)`
- feature hooks own cache invalidation and optimistic behavior for their
  workflow
- generated Orval query helpers may be wrapped when their key or mutation API is
  too infrastructure-shaped for feature code

Generation workflow:

- `KAN-73` implements the Orval dependency, `orval.config.ts`, and
  `npm run api:generate`
- the default local OpenAPI source should be the backend Swagger JSON document,
  expected at `http://localhost:3000/docs-json` when backend docs are enabled
- the command should support an explicit `OPENAPI_SCHEMA_URL` or equivalent
  non-public environment override for local, CI, and future preview workflows
- generation should use a tags-split style output so API areas can scale by
  backend Swagger tags
- generated output should stay under the `lib/api` boundary even when multiple
  APIs are introduced
- current generated output lives under `src/lib/api/generated/sandicts-api`
- generated files are committed and must not be edited manually

Multiple API and BFF strategy:

- each future upstream API gets a separate namespace under
  `src/lib/api/generated/<api-name>`
- each API owns its own runtime request helper, base URL setting, and error
  mapping only when behavior differs from the Sandicts Nest API
- a future Next.js BFF is treated as another API boundary, not as a silent
  replacement for the Nest API contract
- shared UI code depends on semantic feature hooks, not on a specific upstream
  client shape

### Testing

Use:

- Playwright for E2E
- Vitest for unit/component tests
- Testing Library for component and hook behavior

Rules:

- each MVP module needs an integration gate
- E2E should cover the critical user flow, not every UI detail
- component tests should focus on behavior, state rendering, and form validation
- visual/manual QA should be explicit when a flow is not yet stable enough for
  full automation

Initial E2E gates:

- auth: sign in, preserve or refresh session, sign out
- profile: create/update player profile
- Organization: create/update Organization profile
- courts: create and see court in Organization list
- availability: publish slot and expose it to discovery
- discovery: filter courts by sport, availability, and price
- reservations: request, confirm, cancel, and block duplicates
- payments: update manual payment state
- open matches: create, join, leave, and block invalid joins

### CI And Validation

Use:

- GitHub Actions for pull request validation
- Node.js from `.nvmrc`
- npm dependency caching keyed by `package-lock.json`

Rules:

- pull requests targeting `developer`, `staging`, or `master` run validation
  automatically
- temporary branches must follow the backend naming pattern:
  `(feature|fix|hotfix|docs|refactor|test|ci|chore|rc|codex)/KAN-123-short-description`
- install dependencies with `npm ci`
- fail the workflow on lint, typecheck, build, or dependency audit failures
- keep the `Test` job as an explicit placeholder until Playwright and Vitest
  tooling is configured

Current jobs:

- `Governance`: branch naming and pull request target validation
- `Quality`: `npm run lint` and `npm run typecheck`
- `Test`: placeholder until frontend test tooling is configured
- `Build`: `npm run build`
- `Dependency audit`: `npm audit --audit-level=moderate`

## Frontend Architecture Rules

Decision:

- organize the frontend around product features and reusable primitives
- keep Next.js route files thin
- keep API integration, auth/session helpers, query setup, form helpers,
  environment config, and local UI state in explicit `lib/*` boundaries
- use file-level responsibility separation for components, hooks, schemas,
  constants, styles, and local utilities

Reason:

- Sandicts has separate public, player, and Organization product areas, but MVP work
  should still ship in thin vertical slices
- feature modules make the user workflow easy to find without turning shared
  UI or API infrastructure into feature-specific code
- the architecture should preserve the useful discipline of layered frontend
  systems while staying aligned with Next.js App Router, Orval, TanStack Query,
  shadcn/ui, and the already configured `@/*` source alias

Recommended app areas:

- public
- player
- Organization
- admin later only if needed

Recommended boundaries:

- `app`: route groups, layouts, route-level loading and error states
- `components/ui`: shadcn/ui primitives and low-level reusable UI building
  blocks owned by the frontend codebase
- `components/shared`: reusable cross-feature composition with no product data
  ownership
- `features`: feature-specific screens, forms, hooks, and view models
- `lib/api`: generated client, API runtime helpers, request configuration, and
  backend error handling
- `lib/auth`: session helpers and route/auth utilities
- `lib/query`: query client setup and query key conventions
- `lib/forms`: shared form helpers when repetition appears
- `lib/routes`: route builders and navigation constants that are reused across
  app areas
- `lib/env`: typed environment access and non-secret runtime config helpers
- `lib/ui-state`: Zustand stores for local UI state only
- `test/support`: shared test builders, fixtures, and render helpers when test
  tooling exists and repetition justifies extraction

Target source layout:

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── auth/
│   ├── player-profile/
│   ├── Organization-profile/
│   ├── courts/
│   ├── availability/
│   ├── discovery/
│   ├── reservations/
│   ├── payments/
│   └── open-matches/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── query/
│   ├── forms/
│   ├── routes/
│   ├── env/
│   └── ui-state/
└── test/
    └── support/
```

Do not create every folder up front. Create a boundary when the first real
implementation or documented foundation task needs it.

### Layer Responsibilities

Use this default flow for integrated screens:

```text
app route or layout
  -> feature screen
    -> feature components and forms
      -> feature hook or view model
        -> generated API hook or feature API wrapper
          -> lib/api runtime, auth, query, and error helpers
            -> Nest API
```

`app` owns:

- route groups, pages, layouts, metadata, route-level `loading.tsx`,
  `error.tsx`, `not-found.tsx`, and `forbidden` style boundaries when needed
- high-level composition of providers and feature screens
- server-side reads only when they improve routing, auth, metadata, initial
  rendering, or user experience

`app` should avoid:

- feature business workflow logic
- hand-written request code
- large JSX screens that belong in `features`
- UI constants or mapping logic that belongs near the feature

`features` owns:

- screens, section components, forms, feature hooks, schemas, local view
  models, local constants, and local pure utilities for one product area
- workflow-specific loading, empty, error, forbidden, and success states
- orchestration of generated API hooks and mutations for that feature
- mapping backend validation and business-rule errors into UI states

`features` should avoid:

- importing from another feature directly unless a temporary dependency is
  explicitly documented during an active refactor
- owning global app providers, generated API runtime, shared auth/session
  primitives, or shared route constants
- storing API data in Zustand

`components/ui` owns:

- shadcn/ui primitives and low-level reusable UI components such as buttons,
  inputs, dialogs, badges, tabs, menus, and tooltips
- styling variants that are product-agnostic enough to reuse

`components/shared` owns:

- cross-feature composition such as app shells, empty states, status badges,
  navigation surfaces, page headers, and reusable layout pieces
- UI that can depend on general product language but not on feature-specific
  API calls or feature-only hooks

`lib` owns:

- framework setup and infrastructure helpers
- generated API integration support
- auth/session utilities
- TanStack Query setup
- reusable form adapters
- route builders
- environment config
- Zustand stores for local UI state

`lib` should avoid:

- feature JSX and product screens
- feature-specific branching that should live in `features`
- imports from `features` or `app`

### Feature Module Shape

Start each feature small and add subfolders only when the feature needs them.

Recommended shape for a mature feature:

```text
features/<feature>/
├── screens/
├── components/
├── forms/
├── hooks/
├── schemas/
├── view-models/
├── <feature>.constants.ts
├── <feature>.types.ts
└── utils/
```

Rules:

- route files in `app` import a route-level screen from `features/<feature>`
  when the page grows beyond simple placeholder composition
- local feature components stay under the feature instead of
  `components/shared`
- promote a component to `components/shared` only after at least two features
  need it and it no longer depends on one feature's data model
- keep pure transformations in `utils/` or named `*.utils.ts` files beside the
  feature that owns them
- keep user-flow text, option lists, local empty-state copy, and defaults in
  `*.constants.ts` when they make JSX easier to scan

### File Responsibility

Keep one main responsibility per file.

Rules:

- `*.tsx` component files render and compose UI
- `*.types.ts` files hold local component props, hook contracts, view models,
  service option types, and helper option types
- `*.constants.ts` files hold semantic constants, local copy catalogs, option
  lists, and repeated defaults
- `*.schemas.ts` files hold Zod schemas and schema-derived types when useful
- `*.styles.ts` files are optional and should be introduced only when Tailwind
  class composition becomes too dense for readable JSX
- `*.utils.ts` files hold pure transformations and must not import React,
  router, cookies, HTTP clients, or generated API code

Simple components may use a flat pair such as:

```text
components/shared/area-placeholder.tsx
components/shared/area-placeholder.types.ts
```

Complex components may use a folder:

```text
components/shared/status-card/
├── status-card.tsx
├── status-card.types.ts
├── status-card.constants.ts
└── status-card.styles.ts
```

Avoid turning `index.tsx` into a blanket requirement. Prefer explicit file names
when they make imports, search results, and diffs easier to understand.

### Data Access And API Boundaries

Orval and TanStack Query remain the default API integration direction.

Rules:

- generated API code belongs under `src/lib/api/generated/sandicts-api` and is
  treated as a contract adapter
- components should not call raw `fetch`, raw generated request functions, or
  infrastructure helpers directly
- feature hooks may compose generated TanStack Query hooks, map variables,
  normalize feature-specific view models, and expose UI-friendly mutation
  helpers
- generated API response types represent backend contracts; component
  `.types.ts` files represent UI contracts
- create feature wrappers only when they add useful auth, error, variable,
  invalidation, or view-model behavior
- do not hand-write broad API clients when Orval can generate typed request
  functions and query hooks from the Nest Swagger contract
- keep backend error response parsing and cross-feature error helpers in
  `lib/api`, while feature-specific display decisions stay in `features`
- keep auth/session storage and refresh coordination in `lib/auth`, not inside
  components or feature screens
- use semantic query keys from `lib/query` for feature-level invalidation and
  cache coordination

Required defense pattern:

- the component or form should avoid building invalid request variables
- the feature hook should avoid firing a request when required identifiers or
  filters are missing
- shared docs remain the final source of truth for product and business rules
- the backend remains the final source of truth for validation behavior exposed
  through API contracts

### Server And Client Component Boundaries

Use Server Components by default, then opt into Client Components where
interactivity requires it.

Rules:

- files that use React state, effects, browser APIs, TanStack Query hooks,
  Zustand stores, or React Hook Form must be Client Components
- server-only helpers should live in a `server/` folder or use a `.server.ts`
  suffix
- client-only helpers should live in a `client/` folder or use a `.client.ts`
  suffix when ambiguity is likely
- Client Components must not import helpers that use `next/headers`,
  server-only cookies, filesystem APIs, or other server-only dependencies
- route pages may pass server-resolved values into Client Components through
  props when this improves routing or initial render behavior
- auth/session helpers must make the server/client boundary obvious before
  integrated auth work starts

### Import Rules

Use the existing `@/*` alias for stable imports from `src/*`.

Allowed default direction:

```text
app -> features, components, lib
features -> components, lib, same feature files
components -> components, lib
lib -> lib
```

Rules:

- keep sibling implementation files and `.types.ts` imports relative
- use `@/features/...`, `@/components/...`, and `@/lib/...` when crossing
  source roots or distant folders
- shared components must not import from `features`
- `lib` must not import from `features` or `app`
- avoid feature-to-feature imports; extract to `components/shared`, `lib`, or a
  future shared domain helper only when reuse is real
- do not introduce additional aliases until a specific repeated import problem
  justifies another documented decision

### Naming Conventions

Use names that make ownership obvious.

Rules:

- files and folders use kebab-case: `player-profile`, `reservation-card.tsx`
- React component symbols use PascalCase: `ReservationCard`
- hooks use `use*`: `usePlayerProfileForm`
- Zustand stores use `use*Store`: `useNavigationStore`
- Zod schemas use `*Schema`: `playerProfileSchema`
- constants use `UPPER_SNAKE_CASE` when exported and semantic camelCase when
  local readability is better
- generated API names follow the generator output and should not be manually
  renamed unless wrapped by a feature-level helper
- route groups should describe app areas, such as `(public)`, `(player)`, and
  `(Organization)`, when the route map is finalized

### Type Placement

Keep executable implementation and component contracts separated.

Rules:

- component prop types, hook contracts, view models, service option types, and
  helper option types belong in sibling `.types.ts` files
- import sibling `.types.ts` files with relative `import type`
- schema files, generated contract files, and type-first files may declare and
  export types directly
- avoid declaring component props in the same `.tsx` file as the component

### Import Aliases

Use the existing `@/*` alias for stable imports from `src/*`.

Rules:

- prefer `@/components/...`, `@/features/...`, `@/lib/...`, and similar stable
  source-root imports when crossing folders
- keep sibling implementation files and `.types.ts` imports relative
- do not introduce additional aliases until a repeated import problem justifies
  a separate documented decision
- do not use aliases to hide imports across boundaries that should not exist

### Test Helpers

Testing Library, Vitest, and Playwright are the decided tools, but broad test
tooling setup is still pending.

Rules:

- when test tooling exists, repeated builders, fixtures, and render helpers
  should live in `test/support`
- prefer builders over exported mutable fixture objects
- keep local setup inside a spec when it only supports that spec
- do not add a shared helper before at least two specs need it

### Semantic Constants

Keep implementation values readable.

Rules:

- do not leave non-obvious numeric literals inline when the value represents a
  domain rule, unit conversion, timeout, TTL, byte length, rate limit, status
  threshold, layout implementation value, or validation boundary
- prefer semantic constants or helpers such as `sandictsMarkSizePx`,
  `millisecondsPerSecond`, or `minimumGoogleIdTokenLength`
- keep Tailwind utility scale classes such as `px-4`, `gap-8`, and `text-5xl`
  inline because they are design-system tokens
- move repeated raw colors into CSS tokens instead of using arbitrary hex
  classes in JSX
- keep obvious `0` and `1` counters, package versions, generated code, and
  literal fixture data inline when extraction would reduce readability

### Review Enforcement

Use architecture review as part of every frontend PR.

Review questions:

- does the file live in the layer that owns its responsibility?
- did a route file stay thin enough, or should the screen move into `features`?
- are API data and cache behavior handled by TanStack Query rather than Zustand?
- are generated API contracts separate from UI view models?
- are server-only and client-only helpers separated clearly?
- are sibling `.types.ts` imports relative and cross-root imports using `@/*`?
- did a reusable component move to `components/shared` only after real reuse?
- are missing required request inputs blocked before calling the backend?
- are new architecture rules documented instead of left in review comments?

## Prototype Before Build Rule

No MVP page should be treated as fully decided before it has a prototype or
wireflow approved enough to implement.

Before building a page or major component, create or update roadmap work for:

- the UX decision that the page depends on
- the prototype or Figma/wireflow task
- the API contract or mocked contract needed by the page
- the documentation update that captures the approved decision
- the frontend implementation
- the integrated validation gate

This applies even when the page is already listed in the functional specs. The
spec describes intent; the prototype decides the first shippable shape.

## Documentation Rules

Frontend documentation work is real delivery work and should be tracked.

Create docs tasks when:

- a stack decision is made
- a page behavior is approved
- an open product decision is resolved
- a prototype changes page behavior
- a backend API contract changes a frontend flow
- a new architecture rule is introduced
- existing docs are created but not yet reviewed or committed

Suggested task titles:

- `[Docs] Document frontend technology decisions`
- `[Docs] Align MVP frontend planning documents`
- `[Docs] Capture approved auth prototype decisions`
- `[Docs] Update page spec after reservation prototype`
- `[Docs] Reconcile frontend roadmap with Jira`

## Open Technical Decisions

Resolve before completing the frontend foundation and first real API
integration:

- environment variable naming
- frontend test commands after Playwright and Vitest are configured
- deployment target and preview environment strategy

Resolve before first integrated auth implementation:

- CORS and credentialed browser behavior in each environment
- expired session UX
- sign-out behavior
- post-login routing

Resolve before each page implementation:

- final route for the page
- mobile and desktop navigation entry
- loading, empty, error, forbidden, and not-found states
- API contract or mock source
- validation/error mapping
- E2E gate for the flow

## Out Of Scope For This Decision

This document does not decide:

- exact Figma layouts
- exact route map
- deployment provider
- final API endpoint names
- business rules already owned by `sandicts/sandicts-docs`
