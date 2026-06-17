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
  - sandicts/nodejs-sandicts-api:docs/ai/product/sandicts-mvp-scope.md
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

Still open:

- API integration architecture for generated code, wrappers, auth, errors,
  TanStack Query, and multiple APIs or BFFs
- general frontend application architecture and module boundaries
- deployment target
- final route map
- final navigation model for player and partner areas

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

- use App Router layouts for public, player, partner, and future admin areas
- keep product and business rules in the Nest API
- do not treat Next.js as a second business backend
- use server-side capabilities only when they improve routing, auth, metadata,
  initial reads, or user experience
- keep dynamic screen behavior client-friendly when the workflow is highly
  interactive

Reason:

- Sandicts has public discovery, authenticated player flows, partner operations,
  role-based shells, and future public pages
- Next.js gives better room for route structure, metadata, images, and public
  acquisition surfaces than a pure SPA foundation
- the Nest backend remains the system of record for rules, persistence, auth,
  and API contracts

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
- keep partner screens denser and more operational than player screens

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
- partner profile
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
- partner profile setup
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

Rules:

- do not hand-write broad API clients when the OpenAPI contract can generate
  types and request functions
- API contract stability is a start criterion for integrated frontend work
- use the Orval decision as a documented direction only until the API
  integration architecture is decided in `KAN-113`
- do not implement code generation as part of `KAN-63`
- do not add generated client files until the output folder, ownership, and
  regeneration workflow are decided
- `KAN-113` must decide the generated output folder and future regeneration
  command before `KAN-73` implements the client foundation
- `KAN-113` must decide when frontend code can import generated modules
  directly and when it must use domain wrappers
- `KAN-113` must decide how requests handle auth, base URL, credentials,
  backend error responses, TanStack Query, and multiple APIs or BFFs

Reason:

- Orval fits the current MVP direction because it can generate typed request
  code and TanStack Query hooks from the backend OpenAPI contract
- the Orval path keeps the frontend close to the backend Swagger source while
  reducing hand-written client and hook boilerplate
- the generated-client implementation is intentionally deferred until the
  frontend API integration architecture is documented

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
- partner: create/update partner profile
- courts: create and see court in partner list
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

The frontend should be organized around product areas and reusable primitives.

This section is a directional baseline, not the final architecture decision.
`KAN-114` must decide the general application architecture, module boundaries,
component layering, services, import rules, and naming conventions before broad
feature implementation grows.

Recommended app areas:

- public
- player
- partner
- admin later only if needed

Recommended boundaries:

- `app`: route groups, layouts, route-level loading and error states
- `components`: shared UI composition and domain components
- `features`: feature-specific screens, forms, hooks, and view models
- `lib/api`: generated client and API helpers
- `lib/auth`: session helpers and route/auth utilities
- `lib/query`: query client setup and query key conventions
- `lib/forms`: shared form helpers when repetition appears
- `lib/ui-state`: Zustand stores for local UI state only

Do not finalize folder names until the frontend repository exists, but preserve
these boundaries in the first implementation.

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
- do not introduce additional aliases until `KAN-114` finalizes frontend module
  boundaries
- do not use aliases to hide imports across boundaries that should not exist

### Test Helpers

Testing Library, Vitest, and Playwright are the decided tools, but broad test
tooling setup is still pending.

Rules:

- when test tooling exists, repeated builders, fixtures, and render helpers
  should live in a dedicated test support folder decided by `KAN-114`
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

- API/OpenAPI integration architecture in `KAN-113`: generated output folder,
  generated-code ownership, commit versus CI generation, wrapper rules, direct
  imports, auth/baseUrl handling, error handling, TanStack Query integration,
  future generation command, and multiple API or BFF strategy
- application architecture in `KAN-114`: module boundaries, component layering,
  services, import rules, server/client component boundaries, naming, and
  review conventions
- environment variable naming
- frontend test commands after Playwright and Vitest are configured
- deployment target and preview environment strategy

Resolve before first integrated auth implementation:

- cookie/session behavior with the backend
- CORS and credentials behavior
- session hydration endpoint and response shape
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
- business rules already owned by backend/product docs
