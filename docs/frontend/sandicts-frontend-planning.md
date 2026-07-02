---
title: Sandicts Frontend Planning
doc-type: frontend-planning
role: working-draft
priority: high
canonical: docs/frontend/sandicts-frontend-planning.md
related:
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - docs/frontend/sandicts-page-functional-spec.md
  - sandicts/sandicts-docs:docs/product/sandicts-product-context.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
  - sandicts/sandicts-docs:docs/product/sandicts-jira-planning-workflow.md
scope: frontend, ux, fullstack, mvp, jira, integration
read-when:
  - planning the Sandicts frontend
  - deciding when frontend work should start
  - creating frontend Jira issues
  - defining frontend rules, routes, UX flows, or integration milestones
  - validating backend and frontend together
do-not-read-when:
  - changing backend-only implementation with no user-facing workflow impact
---

# Sandicts Frontend Planning

## Purpose

This document defines when and how Sandicts frontend work should start.

It complements:

- `docs/frontend/sandicts-frontend-context.md`
- `docs/frontend/sandicts-frontend-tech-decisions.md`
- `docs/frontend/sandicts-mvp-delivery-roadmap.md`
- `docs/frontend/sandicts-page-functional-spec.md`
- `sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md`
- `sandicts/sandicts-docs:docs/product/sandicts-jira-planning-workflow.md`

The frontend should not wait until the entire backend MVP is done. It should
start early enough to validate real flows, but late enough that it is not built
on imaginary API contracts.

## Core Decision

Start frontend planning now.

Start real frontend implementation when the auth API is stable enough to support
an integrated sign-in flow and the first post-auth API contracts are drafted.

In practice:

1. during backend auth work, document frontend rules, routes, app shell,
   design direction, auth session strategy, and integration expectations
2. after auth endpoints stabilize, create the frontend app foundation and wire
   it to the real backend auth flow
3. while backend builds Player Profile, the frontend builds auth shell, protected
   routes, profile onboarding, API client, and design system primitives
4. after that, each MVP module should have backend, frontend, and integrated
   validation work planned together

Do not wait for all backend modules to be complete before starting the frontend.
That would delay discovery of API shape, auth, CORS, cookie, state, loading,
error, and mobile UX problems.

Do not start every screen before the backend exists. Build ahead only when the
contract is clear or the screen can be safely mocked without creating product
decisions outside the source-of-truth docs.

Repository and runtime decision:

- the frontend app lives in `sandicts/reactjs-sandicts-web`
- local path is `apps/reactjs-sandicts-web`, sibling to
  `apps/nodejs-sandicts-api`
- use npm as the package manager, with Node.js 24 LTS and npm 11
- keep `.nvmrc`, `package.json` `engines`, `packageManager`,
  `package-lock.json`, README setup instructions, and CI validation aligned
- run the backend locally on port `3000` and the frontend locally on port
  `3001`

## Start Criteria

### Frontend Planning Can Start Now

Planning can start before the frontend repository exists.

Allowed now:

- define the page inventory and page behavior
- define product navigation
- define player, organization, academy, and Admin App areas
- define frontend stack rules
- define design tokens and visual direction
- define routing conventions
- define API integration conventions
- define form, error, loading, and empty-state behavior
- create Jira Epics and high-level Stories for frontend work
- create wireflow-level task descriptions

### Frontend Implementation Should Start When

Start the actual frontend app when these are true:

- backend auth module has stable endpoint names and response shapes
- local backend can run predictably for frontend integration
- CORS/cookie/session expectations are decided
- auth token or cookie storage approach is documented
- Swagger/OpenAPI or equivalent API contract is available for auth
- Player Profile API shape is drafted, even if not fully implemented
- deployment direction is clear enough for environment variable naming

### Frontend Should Not Wait For

Do not wait for:

- complete reservations implementation
- complete payments implementation
- open matches implementation
- V2 player progression
- tournaments
- final brand polish

Those should be refined through integrated product slices.

## Fullstack Delivery Model

Use thin vertical slices after auth.

A vertical slice means:

1. backend contract
2. backend behavior
3. frontend UI
4. frontend API integration
5. integrated validation
6. Jira issue status reflects the whole slice

For each feature module, avoid finishing a large backend surface before any UI
touches it. Frontend integration should test whether the backend API feels right
for the actual user workflow.

## Recommended Stack Direction

Decided stack:

- Next.js App Router with TypeScript
- shadcn/ui with Tailwind CSS and lucide-react
- TanStack Query for server state
- Zod with React Hook Form for forms
- Orval as the initial MVP OpenAPI generator for a client generated from the
  Nest Swagger contract
- Zustand only for local UI state, not API data
- Playwright for E2E tests
- Vitest with Testing Library for components and hooks

Rules:

- keep `sandicts/sandicts-docs` as the product and business-rule owner
- keep the Nest backend as the API contract and implementation owner
- do not store API data in Zustand
- use TanStack Query for server state and cache behavior
- generate frontend API types from backend contracts when practical
- track unresolved stack details as roadmap tasks instead of assumptions

Open stack details:

- implement the documented API/OpenAPI integration architecture in `KAN-73`
- CORS and credentialed browser behavior for the first integrated auth flow
- expired session UX, sign-out behavior, and post-login routing
- deployment target

For the full technical decision record, read
`docs/frontend/sandicts-frontend-tech-decisions.md`.

## Frontend App Areas

Separate navigation and permissions early.

KAN-65 navigation decision:

- Sandicts uses one login and one user identity.
- The account is not locked to a single type.
- A signed-in user may have a player profile, one or more organizations, one or
  more academies, and an Admin App context when authorized.
- Initial sign-up/onboarding lets the user start as Player, Organization, or
  Academy, but that choice only creates or opens the first active context.
- The app shell must include a context switcher when the user can access more
  than one context.
- Slugs are part of the route model from the start for organizations,
  academies, units, courts, classes, and public player profiles.
- `Organization` is the internal product/code name for a court or venue
  operator.
- `Academy` is the internal product/code name for training, classes, coaches,
  and student workflows.
- Organizations and Academies are independent top-level contexts. One account
  can own or work in both without one owning the other.

### Public Area

Purpose:

- allow unauthenticated users to understand and enter the app
- allow public discovery and public profile pages when visibility rules allow

Likely screens:

- sign-in
- Google One Tap entry
- public discovery landing if product chooses to expose it before auth
- public court and academy details
- public player profile when the player chooses public visibility

### Player Area

Purpose:

- help players find places, reserve courts, and join games
- let a player manage their own profile and public visibility

MVP screens:

- player home
- court discovery
- court detail
- reservation request flow
- player reservation history
- open match list
- open match detail
- create open match
- basic player profile

Later screens:

- public player profile
- friends-only player profile visibility
- player card
- progression/evolution
- tournaments
- rankings
- achievements

### Organization Area

Purpose:

- help organizations operate units, courts, availability, reservations, and
  payment state

MVP screens:

- organization dashboard
- organization profile
- unit management when one organization has multiple locations
- court management
- availability calendar
- agenda day view
- agenda week view
- reservation detail
- pending payments
- manual payment update

Later screens:

- memberships
- delinquency reports
- tournament management
- richer financial reports

Access model:

- organization owners/admins can see all organization units and courts
- staff can see or manage only assigned units and courts
- cross-organization access is forbidden

### Academy Area

Purpose:

- help academies manage training, classes, coaches, students, requests, and
  payment/plan state

Initial screens to reserve in the route model:

- academy dashboard
- academy profile
- class list and detail
- coach management
- student requests
- student list
- academy payments

MVP status:

- full academy/class operations remain V2 unless scope changes
- the navigation and account model reserve Academy as a first-class context now

Access model:

- academy owners/admins can see and manage all academy classes
- coaches can view academy classes but manage only classes assigned to them
- coaches can accept students only for assigned classes and only when the
  academy rule allows it
- cross-academy access is forbidden

### Admin App Area

Purpose:

- let internal Sandicts operators manage global setup, metrics, supply-side
  accounts, billing state, and support/audit workflows

MVP candidate screens:

- admin dashboard and metrics
- sports catalog
- organizations
- academies
- billing or subscription status
- audit/support context

## UX Rules To Define

The user should provide or approve rules for these areas.

### Brand And Visual System

Needed decisions:

- logo usage
- dark vs light default mode
- color tokens
- typography
- icon set
- illustration or photography style
- spacing and density
- card and surface style

Current direction from `sandicts-frontend-context.md`:

- minimal scorpion logo
- dark background
- primary color `#F59E0B`
- energetic contrast
- beach/lifestyle imagery when useful

### Navigation

Resolved direction:

- use one login and route users by active context after authentication
- restore `returnTo` when the user is authorized for the attempted route
- restore the last active context when there is no `returnTo`
- if the user has only one context, enter that context directly
- if the user has multiple contexts, show the context switcher/picker
- use slug routes for public and operational entity pages from the beginning
- keep player, organization, academy, and Admin App as separate app areas with
  shared auth/session foundations
- use a compact public header instead of a public bottom navigation bar
- use a five-destination bottom navigation bar for the compact Player area
- use a navigation sheet or drawer for compact Organization and Admin App
  navigation because their operational hierarchies exceed five destinations
- reserve the Organization adaptive navigation pattern for Academy V2
- adapt authenticated navigation to a rail at medium widths and a labeled
  sidebar at expanded widths
- show the mobile context switcher as a grouped modal bottom sheet or equivalent
  dialog, separate from navigation inside the active context
- derive active navigation from the URL instead of duplicating selection in
  React or Zustand state

The detailed destination map, responsive modes, access states, accessibility
requirements, and implementation handoff live in
`docs/frontend/sandicts-mobile-navigation.md`.

Needed decisions:

- exact empty states for missing profile, missing organization, missing academy,
  forbidden context, and suspended billing
- exact labels for public-facing Organization and Academy concepts in Brazilian
  Portuguese

Route direction:

- public courts use `/courts/:courtSlug`
- public academies use `/academies/:academySlug`
- public player profiles use `/players/:playerSlug` with visibility rules
- player app routes live under `/app`
- organization management routes live under `/organizations/:organizationSlug`
- academy management routes live under `/academies/:academySlug/manage`
- internal admin routes live under `/admin`

### Auth UX

Needed decisions:

- Google button placement
- Google One Tap behavior
- sign-out behavior
- expired session behavior
- refresh failure behavior
- exact public discovery depth before sign-in

### Forms

Needed decisions:

- field validation behavior
- inline errors vs toast errors
- save/cancel patterns
- optimistic updates
- dirty-state protection
- multi-step flow rules

### API And Error UX

Needed decisions:

- loading states
- empty states
- retry behavior
- error display for `validation_error`
- error display for `business_rule_violation`
- error display for `forbidden`
- error display for `resource_not_found`
- generic internal error behavior

### Date, Time, Money, And Locale

Needed decisions:

- default locale
- currency display
- timezone handling
- court slot display
- date picker behavior
- calendar density for organization agenda

### Testing

Needed decisions:

- unit/component test expectations
- integration test expectations
- e2e smoke flows
- visual QA expectations
- browser/device matrix

## MVP Frontend Roadmap

For the full MVP delivery roadmap, including docs, decision, prototype,
foundation, feature, and integration work, read
`docs/frontend/sandicts-mvp-delivery-roadmap.md`.

### F0: Frontend Planning And Rules

Purpose:

- define enough frontend rules to avoid rebuilding the app shell later
- make documentation, research, and decision work visible in the roadmap
- require a prototype or wireflow before implementing major MVP pages

Suggested Jira issues:

- `[Docs] Document frontend technology decisions`
- `[Docs] Align MVP frontend roadmap`
- `[Frontend] Define frontend architecture and app shell rules`
- `[UX] Define Sandicts MVP navigation model`
- `[UX] Define auth and role switching experience`
- `[UX] Prototype public, player, organization, academy, and Admin App shells`
- `[Design] Define MVP visual tokens and component direction`

Exit criteria:

- frontend repo/app location is decided
- stack choices are documented
- routes and app areas are drafted
- first design rules are documented
- auth integration assumptions are clear
- roadmap tracks docs, decision, prototype, implementation, and E2E work

### F1: Frontend App Foundation

Purpose:

- create the app shell that future MVP screens use

Suggested Jira issues:

- `[Frontend] Create Next.js app foundation`
- `[Frontend] Configure environment and API client foundation`
- `[Frontend] Build public and protected layout shell`
- `[Frontend] Implement auth session state`
- `[Frontend] Add base loading, empty, and error states`

Exit criteria:

- frontend runs locally
- frontend can call the local backend
- auth state is represented in the UI
- protected routes redirect correctly
- base visual tokens are applied

### F2: Integrated Auth

Purpose:

- prove real backend and frontend integration with Google sign-in

Suggested Jira issues:

- `[Frontend] Implement Google sign-in screen`
- `[Frontend] Implement Google One Tap entry`
- `[Frontend] Implement sign-out flow`
- `[E2E] Validate web auth happy path`
- `[E2E] Validate expired session handling`

Exit criteria:

- user can sign in through the frontend
- user can refresh or preserve an active session
- user can sign out
- auth errors are displayed predictably
- backend and frontend agree on auth contract

### F3: Player Profile

Purpose:

- create the first post-auth player experience

Suggested Jira issues:

- `[Frontend] Build player profile form`
- `[Frontend] Build main sport selection`
- `[Frontend] Build simple level selection by sport`
- `[E2E] Validate player profile onboarding`

Exit criteria:

- authenticated player can create or update basic profile
- profile validation errors are visible
- player state is available to later reservation and open match screens

### F4: Organization Foundation

Purpose:

- create organization-facing navigation and onboarding

Suggested Jira issues:

- `[Frontend] Build organization dashboard shell`
- `[Frontend] Build organization profile form`
- `[Frontend] Add organization access boundary states`
- `[E2E] Validate organization profile setup`

Exit criteria:

- organization area has a stable layout
- organization profile can be created or edited
- unauthorized, missing organization, and wrong-context states are clear

### F5: Court Management

Purpose:

- let organizations manage the supply side of the marketplace

Suggested Jira issues:

- `[Frontend] Build court list and detail screens`
- `[Frontend] Build court creation form`
- `[Frontend] Build supported sports selector`
- `[Frontend] Build court pricing and rules form`
- `[Frontend] Build court activation controls`
- `[E2E] Validate organization court setup`

Exit criteria:

- organization operator can create and manage courts through the UI
- validation errors map to backend responses
- inactive court state is visible

### F6: Availability Calendar

Purpose:

- make court availability obvious and editable

Suggested Jira issues:

- `[Frontend] Build organization availability calendar`
- `[Frontend] Build availability slot editor`
- `[Frontend] Build agenda day view`
- `[Frontend] Build agenda week view`
- `[E2E] Validate availability publishing`

Exit criteria:

- organization operator can publish available slots
- overlapping or invalid slots are handled clearly
- agenda views are usable on target devices

### F7: Discovery

Purpose:

- let players find courts by MVP filters

Suggested Jira issues:

- `[Frontend] Build player discovery screen`
- `[Frontend] Build sport filter`
- `[Frontend] Build availability filter`
- `[Frontend] Build price filter`
- `[Frontend] Build court and organization result cards`
- `[E2E] Validate court discovery filters`

Exit criteria:

- player can search by sport, availability, and price
- empty states guide the user
- discovery results link to court detail or reservation flow

### F8: Reservations

Purpose:

- let players request reservations and organizations manage them

Suggested Jira issues:

- `[Frontend] Build reservation request flow`
- `[Frontend] Build player reservation history`
- `[Frontend] Build organization reservation detail`
- `[Frontend] Build organization reservation confirmation flow`
- `[Frontend] Build reservation cancellation flow`
- `[E2E] Validate reservation happy path`
- `[E2E] Validate duplicate reservation prevention`

Exit criteria:

- player can request a reservation from discovery
- organization operator can confirm or cancel a reservation
- player can cancel when allowed
- duplicate slot errors are understandable

### F9: Manual Payments

Purpose:

- expose manual payment tracking without a gateway

Suggested Jira issues:

- `[Frontend] Build pending payments view`
- `[Frontend] Build manual payment status control`
- `[Frontend] Build payment status badges`
- `[E2E] Validate manual payment update`

Exit criteria:

- organization operator can see pending or overdue payments
- organization operator can update payment status when allowed
- reservation views reflect payment state

### F10: Open Matches

Purpose:

- make the community loop playable

Suggested Jira issues:

- `[Frontend] Build open match list`
- `[Frontend] Build open match detail`
- `[Frontend] Build create open match flow`
- `[Frontend] Build join and leave match actions`
- `[Frontend] Build match level filter`
- `[E2E] Validate open match participation`

Exit criteria:

- player can create, join, and leave open matches
- full, canceled, and completed states are visible
- duplicate join errors are handled clearly

## Backend And Frontend Parallel Rhythm

Use this rhythm for each module:

1. Product rule is confirmed in `sandicts/sandicts-docs:docs/product`
   or `sandicts/sandicts-docs:docs/business-rules`
2. Backend drafts the API contract and business-rule behavior
3. Frontend drafts the user flow and required states
4. Backend implements the first usable endpoint set
5. Frontend integrates against the real endpoint set
6. E2E or manual integrated validation proves the slice
7. Jira moves to review or done only after the integrated criteria are met

This prevents backend-only completion from hiding product or UX gaps.

## Frontend Jira Rules

Use the same product Epics as the backend whenever possible.

Recommended pattern:

```text
Epic: [MVP] Reservations
  Story: [Reservations] Player requests a court reservation
    Subtask: [Backend] Implement reservation request endpoint
    Subtask: [Frontend] Build reservation request flow
    Subtask: [E2E] Validate reservation request happy path
```

For foundation work, create frontend-specific Tasks:

```text
Epic: [MVP] Authentication and Account Access
  Task: [Frontend] Create Next.js app foundation
  Task: [Frontend] Implement auth session state
```

Avoid separate frontend Epics for every feature if the product Epic already
exists. Separate frontend Epics are useful only for cross-cutting frontend
foundation, design system, or app-shell work.

Treat non-feature frontend work as real roadmap work:

- use `[Spike]` or `[UX]` tasks for unresolved decisions
- use `[UX] Prototype ...` tasks before implementing unclear pages or flows
- use `[Docs]` tasks for stack decisions, page decisions, and roadmap docs
- use `[Frontend]` tasks for app foundation, architecture, and implementation
- use `[E2E]` tasks for integration gates

No MVP page should be implemented from the page inventory alone. The page spec
describes intent; the prototype or wireflow decides the first shippable shape.

## Integration Gates

Each MVP module should define an integration gate.

Examples:

- Auth gate: sign in, refresh or preserve session, sign out
- Player gate: create or update profile, choose sport, choose level
- Organization gate: create organization profile and load organization dashboard
- Court gate: create court and see it in organization court list
- Availability gate: publish slot and see it in discovery candidate data
- Discovery gate: filter courts by sport, availability, and price
- Reservation gate: request, confirm, cancel, and block duplicate reservation
- Payment gate: mark reservation paid and reflect payment state
- Open match gate: create, join, leave, and block duplicate join

No module should be considered product-complete until its gate is validated.

## Open Decisions

Capture the user's frontend rules here until they are moved into stable docs.

Decided:

- [x] Decide framework: Next.js App Router with TypeScript.
- [x] Decide UI component strategy: shadcn/ui with Tailwind CSS and lucide-react.
- [x] Decide server-state strategy: TanStack Query.
- [x] Decide form strategy: Zod with React Hook Form.
- [x] Decide API client strategy: generated OpenAPI client from Nest Swagger.
- [x] Decide local UI state strategy: Zustand only for local UI state.
- [x] Decide frontend test strategy: Playwright, Vitest, and Testing Library.
- [x] Decide frontend repository location: `sandicts/reactjs-sandicts-web`.
- [x] Decide package manager and Node.js version: npm, npm 11, and Node.js
  24 LTS.
- [x] Decide exact OpenAPI generator: Orval as the initial MVP generator.
- [x] Decide general application architecture and module boundaries:
  feature-oriented architecture with thin Next.js routes, `components/*`
  reusable UI boundaries, and `lib/*` frontend infrastructure.
- [x] Decide API/OpenAPI integration architecture: generated code is a
  contract adapter under `lib/api`, with semantic feature hooks, a Sandicts API
  runtime, in-memory access token storage, refresh cookies owned by the
  backend, normalized errors, and TanStack Query server-state ownership.
- [x] Decide auth session hydration flow: client bootstrap attempts
  `POST /auth/refresh` using the backend-owned refresh cookie, session reads use
  `GET /auth/me` when an access token exists in memory, and TanStack Query owns
  the public current-session projection.
- [x] Decide player, organization, academy, and Admin App navigation model: one
  login, one user identity, multiple accessible contexts, context switcher when
  needed, and slug-based routes from the start.
- [x] Decide account context model: a user can have a player profile, multiple
  organizations, multiple academies, and an internal Admin App context when
  authorized; the initial onboarding choice does not lock the account type.
- [x] Decide organization and academy relationship: Organization and Academy
  are independent top-level contexts, not parent/child entities.
- [x] Decide public profile direction: public court, academy, and player pages
  use slugs; player profile visibility supports public now in the route model
  and can expand to friends-only/private rules later.

Still open:

- [ ] Decide CORS and credentialed browser behavior for local, preview, and
  production environments.
- [ ] Decide expired session behavior.
- [ ] Decide sign-out behavior.
- [ ] Decide post-login routing details.
- [ ] Decide mobile-first breakpoints.
- [ ] Decide exact public discovery depth before sign-in.
- [ ] Decide exact public-facing labels for Organization and Academy in
  Brazilian Portuguese.
- [ ] Decide billing model for organizations and academies: fixed subscription,
  commission/percentage, or hybrid.
- [ ] Decide deployment target.
- [x] Decide first app-shell prototype. See
  `docs/frontend/prototypes/app-shells/README.md`.
- [ ] Decide which uncommitted docs are ready to commit as MVP source docs.

## Next Planning Step

Before creating frontend Jira issues, prepare a batch proposal that includes:

- documentation tasks for the current decisions and uncommitted docs
- bounded decision/spike tasks for unresolved choices
- prototype tasks for the first app shell and first pages
- frontend foundation issues
- auth integration issues
- first player profile frontend issues
- related backend dependencies
- integration gates

Do not create all MVP frontend subtasks at once. Create high-level roadmap
anchors first, then detailed frontend tasks only for the current and next module.
