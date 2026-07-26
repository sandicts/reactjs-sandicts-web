---
title: Sandicts Page Functional Specification
doc-type: frontend-functional-spec
role: working-draft
priority: high
canonical: docs/frontend/sandicts-page-functional-spec.md
related:
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-expired-session-experience.md
  - docs/frontend/sandicts-post-login-routing.md
  - docs/frontend/sandicts-google-one-tap-experience.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - docs/frontend/sandicts-frontend-planning.md
  - sandicts/sandicts-docs:docs/product/sandicts-product-context.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
  - sandicts/sandicts-docs:docs/product/sandicts-v2-backlog.md
  - sandicts/sandicts-docs:docs/business-rules/sandicts-business-rules.md
scope: frontend, pages, product-rules, user-flows, mvp, v2, backlog
read-when:
  - defining Sandicts pages or routes
  - planning frontend Jira issues
  - planning fullstack product slices
  - deciding MVP versus V2 page scope
  - mapping frontend behavior to backend business rules
do-not-read-when:
  - changing backend-only implementation details with no page or user-flow impact
---

# Sandicts Page Functional Specification

## Purpose

This document consolidates the page and flow descriptions provided by the user
into a functional page specification.

It intentionally focuses on:

- user roles
- pages
- page behavior
- business rules
- permissions
- open decisions
- MVP, V2, and future placement

It intentionally does not treat architecture suggestions from the source summary
as final decisions. Architecture, stack, state management, repository layout, and
implementation patterns must be decided separately.

Current frontend stack decisions live in
`docs/frontend/sandicts-frontend-tech-decisions.md`. Delivery sequencing,
prototype tasks, documentation tasks, and implementation gates live in
`docs/frontend/sandicts-mvp-delivery-roadmap.md`.

## How To Use This Document

Use this document before creating Jira Epics, Stories, Tasks, or Subtasks for
frontend and fullstack work.

Planning order:

1. read the MVP and business-rule docs
2. read this page spec
3. classify each page as MVP, V2, future, or open decision
4. define the route and user flow
5. define the backend contract needed by the page
6. create Jira issues only after the user approves the batch

This document is a working draft. When a rule becomes a backend invariant, copy
or reconcile it into `sandicts/sandicts-docs:docs/business-rules/sandicts-business-rules.md` or the MVP
scope docs as appropriate.

## Scope Classification

Use these labels:

- `MVP`: confirmed by current MVP scope or necessary for the MVP flow
- `MVP candidate`: useful for MVP, but needs explicit product confirmation
- `V2`: confirmed or strongly aligned with V2 scope
- `Future`: later than V2 or explicitly excluded from MVP
- `Open decision`: cannot be classified safely yet

Important current MVP constraints:

- geolocation is not MVP
- tournaments are not MVP
- full academy/class management is not MVP
- students, memberships, coaches, and classes are V2
- payment gateway, split, and payout automation are not MVP
- player evolution, card, overall, rankings, and achievements are not MVP
- manual reservation payment status is MVP
- player-created open matches are MVP

## Roles

### Visitor

Phase:

- MVP

Definition:

- A person who is not authenticated.

Can:

- view public court discovery
- view public organization or venue information
- view public academy information if academy discovery is enabled
- view public player profiles when the profile visibility allows it
- view available time slots
- filter public discovery by basic filters
- open detail pages

Cannot:

- reserve a court
- join an open match
- create an open match
- schedule a class
- express operational intent that requires follow-up
- access private profile pages
- access player, organization, academy, or admin operational areas

Rules:

- Public viewing can be allowed.
- Any practical action requires login.
- The product should avoid blocking discovery too early.
- When a visitor attempts a gated action, redirect to sign-in and resume the
  attempted flow after authentication when possible.

Open decisions:

- whether public discovery includes only courts or also academies
- whether public users can see all available slots or only summary availability
- whether contact actions are MVP and whether they require login

### Authenticated Account

Phase:

- MVP

Definition:

- A signed-in Sandicts user identity.

Can:

- complete or use a player profile
- create or access one or more organizations when authorized
- create or access one or more academies when authorized
- access Admin App only when the internal admin permission exists
- switch between accessible contexts through the app shell

Rules:

- Login is unified at `/sign-in`; Sandicts does not create separate login pages
  by user type.
- Account type is not permanent. The onboarding choice only creates or opens
  the first context.
- A user may have Player, Organization, Academy, and Admin App contexts at
  the same time.
- After explicit authentication, the app uses a safe authorized `returnTo`,
  then the last active usable context, then the only usable context, then a
  context picker. It renders an explicit no-context state when none exists.
- `missing` or `incomplete` Player completion gates only Player destinations;
  Organization, Academy, and Admin App destinations do not require Player
  onboarding.
- Context routes use stable IDs internally and slugs in user-facing URLs from
  the start.

Context switcher:

- Player
- each Organization by display name and slug
- each Academy by display name and slug
- Admin App when authorized
- create Organization or create Academy entry points when allowed

On compact viewports, multiple contexts are presented in a grouped modal bottom
sheet or equivalent dialog. Selecting a context closes the switcher and
navigates to that context home. The complete responsive and accessible behavior
lives in `docs/frontend/sandicts-mobile-navigation.md`.

Open decisions:

- exact onboarding copy for "start as Player, Organization, or Academy"
- whether personal player profile creation is automatic for every signed-in
  account or explicit after login

### Player

Phase:

- MVP

Definition:

- An authenticated user who uses Sandicts to play, reserve courts, or join open
  matches.

Can:

- complete a basic player profile
- search courts
- filter by sport
- view available slots
- request reservations
- view own reservations
- cancel reservations when allowed
- create open matches
- join open matches
- leave open matches
- view public player profiles
- view friends-only player profiles when friendship rules allow it
- view own activity history when implemented

MVP profile fields:

- display name
- city
- main sport
- simple self-declared level by sport

Candidate or V2 profile fields:

- academy where the player trains
- preferred court side: left, right, both
- dominant foot: right, left, both
- public profile
- visibility: public, friends-only, or private
- player photo
- bio
- nationality
- full athlete card
- fundamentals
- overall score
- achievements

Rules:

- Simple level is self-declared.
- Simple level is a filter and expectation, not an official ranking.
- The player can only see their own private reservation history.
- The player cannot access organization, academy, or admin operational areas
  unless granted that context.
- Public player profile URLs use `/players/:playerSlug`.
- Player profile visibility can start with public/private and expand to
  friends-only rules later.

Open decisions:

- whether court side belongs in MVP or V2
- whether dominant foot belongs in MVP or V2
- whether player city is required or optional in MVP

### Student

Phase:

- V2

Definition:

- A player linked to an academy plan or class operation.

Can:

- view available classes for the week
- choose classes according to plan limits
- view own classes
- request or use extra classes if approved
- see class cancellation and choose another time when needed

Rules:

- Student behavior depends on academy, plan, payment, and class modules.
- Current MVP docs place students, memberships, coaches, and classes in V2.
- Student pages should not block MVP reservation or open match delivery.

Open decisions:

- whether any lightweight academy affiliation belongs in MVP profile
- whether class selection is V2 or should be pulled earlier
- whether unpaid students are automatically blocked or only flagged

### Organization Owner Or Admin

Phase:

- MVP

Definition:

- A user with permission to manage one Organization context.

Can:

- create or edit organization profile
- create or edit organization units
- create courts
- define sports accepted by court
- define court rules
- define prices
- define availability
- manage reservations
- confirm or cancel reservations
- update manual payment status
- view operational agenda
- configure simple services or amenities
- invite or manage organization staff if permission is enabled

Cannot in MVP:

- process online payments
- use payment gateway integration
- automate split or payouts
- run advanced financial reports
- manage full inventory
- run automated maintenance alerts
- manage academy class operations unless academy scope is explicitly pulled
  forward

Rules:

- Organizations are the source of truth for court availability.
- An organization owner/admin can see all units and courts in that
  organization.
- An organization can own multiple units across cities.
- Cross-organization access is forbidden.
- Manual payment state changes should be auditable.
- Organization management routes use `/organizations/:organizationSlug`.

Open decisions:

- whether organization reservation confirmation is always manual in MVP
- whether any reservation can be automatically confirmed
- whether availability is defined by court only or by court and sport
- whether price is fixed by court or varies by period
- exact MVP organization profile fields

### Organization Staff

Phase:

- MVP candidate

Definition:

- A user who works for an Organization but should only access assigned units or
  courts.

Can:

- view assigned unit agenda
- view or update assigned court reservations when permitted
- update payment status when permitted
- see only the operational data needed for their assignment

Rules:

- Staff access is scoped by Organization and by assigned unit/court.
- Staff must not see all Organization data unless promoted to owner/admin.
- Staff actions should remain auditable.

Open decisions:

- exact staff permission levels
- whether staff invitation/management is MVP or immediately after MVP

### Academy Owner Or Admin

Phase:

- V2

Definition:

- A user with permission to manage one Academy context.

Can:

- create academy profile
- create coaches
- organize calendar by coach
- create classes
- set class theme
- set minimum and maximum level
- set minimum and maximum students
- control student allocation
- cancel classes when minimum is not reached
- allow students to choose classes according to plan
- block class scheduling when payment is not valid
- approve extra classes when allowed

Rules:

- An Academy is independent from an Organization.
- A user who owns an Academy can later also create or access an Organization
  under the same account.
- Academy logic includes students, coaches, plans, classes, and payment blocks.
- Academy management routes use `/academies/:academySlug/manage`.
- Full academy/class management remains V2 unless product scope changes.
- Cross-academy access is forbidden.

Open decisions:

- whether coaches have their own login in V2
- whether extra classes are V2 or future
- whether coach approval alone can allow an extra class
- whether academy approval is required for every exception

### Coach

Phase:

- V2

Definition:

- A user who teaches for an Academy.

Can:

- view academy classes
- manage only assigned classes
- accept students into assigned classes when academy rules allow it
- request or record class-level changes when permitted

Rules:

- Coaches are not Academy owners by default.
- Coach permissions are scoped to assigned classes.
- Student acceptance must follow Academy rules.

Open decisions:

- exact coach permission levels
- whether coaches can see all student details or only class-level details
- whether coach-facing screens are V2 or later

### Admin App

Phase:

- MVP candidate for sports catalog, metrics, billing state, and support
  operations; full admin is future

Definition:

- Internal Sandicts operator or owner.

Can:

- manage global data if admin tooling exists
- view marketplace metrics
- manage sports catalog
- review organizations and academies
- inspect billing or subscription status
- inspect support context
- review audit logs
- resolve operational issues

Rules:

- Build admin UI only when there is a real MVP operational need.
- Internal operations can start manually if that is faster and safe.
- Auditability is still important even if no admin UI exists yet.

Open decisions:

- whether the MVP needs a full admin area
- whether sports are seeded/configured manually or managed through UI
- whether supply-side billing is fixed subscription, commission/percentage, or
  hybrid
- which support actions need UI versus database/script/manual operation

## Public Pages

### Public Home And Discovery

Suggested route:

- `/`
- `/discovery`

Phase:

- MVP

Purpose:

- Let visitors and authenticated users discover courts and possibly academies
  before committing to an action.

Users:

- visitor
- player

Content:

- court list
- academy list if enabled
- public player profile entry points when visibility/search rules allow it
- sports available
- available slots
- basic filters
- sign-in CTA for gated actions

Allowed without login:

- view courts
- view organization or venue details
- view academies if public academy discovery is enabled
- view player profiles when visibility allows it
- view available slots
- filter by basic filters
- open details

Blocked without login:

- reserve
- join open match
- create open match
- contact operationally if contact is enabled
- schedule class
- express booking or class intent

Rules:

- Discovery helps acquisition.
- Login should be required only at the point of practical action.
- MVP discovery uses simple filters, not geolocation.
- Public academy discovery is allowed only as a display concept unless academy
  operations are pulled into MVP.
- Public player profile pages use slugs and must respect player visibility.

Open decisions:

- whether the root page is a marketing page, discovery page, or hybrid
- whether academy cards appear in MVP discovery
- whether visitors can see exact time slots

### Sign In

Suggested route:

- `/sign-in`

Phase:

- MVP

Purpose:

- Authenticate users with low friction.

Users:

- visitor
- expired authenticated user

Actions:

- sign in with Google
- use Google One Tap
- request or consume a magic link when that flow is available
- sign out from an authenticated state
- refresh or preserve session

Post-auth routing:

- wait for the common session snapshot and usable context inventory
- if a structurally safe `returnTo` exists and the account is authorized,
  resume that route
- otherwise restore the last active context only when it remains usable
- otherwise enter the only usable context
- otherwise show the context picker when multiple contexts remain
- otherwise show the no-context state
- `missing` or `incomplete` Player completion goes to `/app/onboarding` before
  entering a Player destination and retains only a safe authorized Player
  continuation
- Player completion never blocks an Organization, Academy, or Admin App
  destination
- user attempting reservation returns to reservation flow
- user attempting class scheduling returns to class flow if academy module exists

States:

- session checking and provider loading
- explicit Google Sign-In ready and pending
- Google One Tap prompted, fallback, suppressed, or unsupported
- cancelled explicit sign-in
- invalid Google credential
- provider or Sandicts service unavailable
- external identity conflict and rate limit
- expired session and temporary verification failure
- authentication-level forbidden
- already signed in and post-login routing
- unauthorized intended destination
- Player onboarding handoff
- context picker and no available context

Rules:

- Auth should preserve the user's intended action when possible.
- Explicit Google Sign-In, Google One Tap, magic-link consumption, and
  reauthentication use the same provider-independent post-login resolver.
- Passive refresh keeps a regular public page in place, verifies and unlocks
  the current protected route, and runs the post-login resolver on
  `/sign-in`.
- An invalid or external `returnTo` is discarded. A safe internal but
  unauthorized `returnTo` uses the normal authorized fallback with neutral,
  non-disclosing feedback.
- Google One Tap is eligible only on `/`, `/discovery`, and `/sign-in`, and may
  attempt only on the first eligible route visited in a browser tab.
- Public detail pages do not inherit One Tap eligibility from public access.
- Protected layouts never mount provider prompts; they reach `/sign-in` through
  the approved unauthenticated or expired-session flow first.
- The explicit Google Sign-In button remains available on `/sign-in` when One
  Tap is skipped, cancelled, suppressed, unavailable, or fails.
- Exact route policy, 24-hour suppression, platform, fallback, storage, and
  privacy behavior live in
  `docs/frontend/sandicts-google-one-tap-experience.md`.
- A rejected initial bootstrap without a previously established in-memory
  session is unauthenticated, not expired.
- A confirmed expired session redirects to sign-in with a validated internal
  `returnTo`; a temporary verification failure provides retry without claiming
  that the session expired.
- Expired-session feedback is persistent inline sign-in content, not a toast or
  a dedicated screen.
- MVP form drafts are discarded during expiry navigation and are not persisted
  in the return URL or browser storage.
- Forbidden access preserves the authenticated shell and never silently signs
  the user out or switches context.
- Auth errors should be understandable without exposing provider internals.
- The sign-in page is shared by Player, Organization, Academy, and Sandicts
  Admin users.
- Exact responsive composition, copy, action hierarchy, Google fallback,
  loading, failure, forbidden, and post-login handoff states live in
  `docs/frontend/prototypes/auth-sign-in/README.md`.
- Magic-link-specific email entry, sent, resend, expired, invalid, already-used,
  and token-consumption states remain outside the KAN-84 prototype boundary.

Implementation ownership:

- session hydration uses the frontend auth decision: browser bootstrap attempts
  `POST /auth/refresh`, current-session reads use `GET /auth/me`, and access
  tokens stay in memory
- exact state classification, expired-session copy, safe `returnTo`, draft,
  redirect, and E2E behavior live in
  `docs/frontend/sandicts-expired-session-experience.md`
- exact trigger classification, destination precedence, context fallback,
  Player completion gate, and unauthorized `returnTo` behavior live in
  `docs/frontend/sandicts-post-login-routing.md`
- exact sign-in and auth-state visual handoff lives in
  `docs/frontend/prototypes/auth-sign-in/README.md`

## Player Pages

### Player Home

Suggested route:

- `/app`

Phase:

- MVP

Purpose:

- Act as the authenticated player dashboard.

Content:

- upcoming reservations
- open match suggestions
- shortcuts to court discovery
- shortcut to create open match
- reservation history shortcut
- classes only if academy module is enabled

Rules:

- The regular Player home renders only after `GET /players/me` reports
  `complete`. `missing` and `incomplete` route to `/app/onboarding` first.
- The MVP home should not become a social feed.
- Tournament, ranking, and progression widgets are not MVP.

Open decisions:

- whether upcoming classes appear before academy module is implemented

### Profile Onboarding

Suggested route:

- `/app/onboarding`

Phase:

- MVP for basic fields; V2 for extended sport identity

Purpose:

- Collect the minimum data needed for reservations and open matches.

MVP fields:

- display name
- main sport
- simple level

Candidate fields:

- preferred court side
- dominant foot
- academy where the player trains
- profile visibility if public profile is pulled into MVP

Actions:

- save profile
- edit later

Rules:

- Onboarding should not ask for too much.
- `GET /players/me` is the completion authority. The frontend must use its
  `missing`, `incomplete`, or `complete` state instead of duplicating required
  field logic.
- On successful completion, re-check any retained safe authorized Player
  continuation before navigating.
- No photo, bio, ranking, achievements, or athlete card in MVP.
- The goal is to enable reservation, open match, and later class flows.

Open decisions:

- whether city is collected as an optional MVP field
- whether side and dominant foot are MVP
- whether academy affiliation is MVP
- whether profile visibility is MVP or V2

### Player Profile

Suggested route:

- `/app/profile`
- public profile route reserved as `/players/:playerSlug`

Phase:

- MVP for basic editable profile

Purpose:

- Let the player edit basic personal and sport data.

Content:

- display name
- city
- main sport
- levels by sport
- academy link if enabled
- profile visibility if enabled
- preferred court side if enabled
- dominant foot if enabled
- summary history if useful

Actions:

- edit profile
- update main sport
- update level
- update academy link if enabled
- update public visibility if enabled

Out of MVP:

- full public athlete card
- ranking
- overall
- detailed fundamentals
- athlete card
- achievements
- media upload

Rules:

- Level is self-declared in MVP.
- Profile changes should not create official ranking claims.
- Public player profile pages must respect visibility: public now in the route
  model, with friends-only and private rules available later.

### Discover Courts

Suggested route:

- `/app/courts`
- `/discovery`

Phase:

- MVP

Purpose:

- Let players find reservable courts.

Filters:

- sport
- organization or venue
- date
- time
- price
- availability

List should show:

- organization or venue name
- court name
- accepted sports
- price
- available slots
- status
- simple amenities such as food and beverage icons

Actions:

- open detail
- choose time
- start reservation

Rules:

- inactive courts are not reservable
- unavailable slots cannot be reserved
- price must be visible before reservation request
- no geolocation in MVP unless product scope changes

Open decisions:

- whether exact time selection starts in list or detail
- whether amenities affect filtering or are display-only in MVP

### Court Or Venue Detail

Suggested route:

- `/app/courts/:courtSlug`
- `/courts/:courtSlug`

Phase:

- MVP

Purpose:

- Show enough information for a player to decide whether to reserve.

Content:

- venue name
- court name
- accepted sports
- price
- court rules
- available slots
- amenities
- textual location data
- public contact information if enabled

Actions:

- select slot
- request reservation
- contact venue if contact is enabled and user is authenticated

Rules:

- Visitor can view public details.
- Reservation requires login.
- Contact or operational intent requires login if enabled.
- Court rules should be visible before reservation.

### Reservation Request

Suggested route:

- `/app/reservations/new`
- `/app/courts/:courtSlug/reserve`

Phase:

- MVP

Purpose:

- Confirm reservation details before creating a reservation.

Screen should show:

- organization or venue
- court
- sport
- date
- start time
- end time
- price
- rules
- initial reservation status

Actions:

- confirm request
- cancel before submitting

Reservation statuses:

- `pending_payment`
- `confirmed`
- `canceled`
- `expired`
- `completed`

Rules:

- Reservation cannot be created for inactive court.
- Reservation cannot be created for unavailable slot.
- Reservation cannot duplicate an active confirmed reservation.
- Payment is not online in MVP.
- Payment status is controlled manually by organization or authorized operator.

Open decisions:

- whether reservation status starts as `pending_payment` or another pending state
- whether organization confirmation is always required
- whether any automatic confirmation exists in MVP

### My Reservations

Suggested route:

- `/app/reservations`
- `/app/reservations/:reservationId`

Phase:

- MVP

Purpose:

- Let players track their own reservations.

Content:

- future reservations
- past reservations
- reservation status
- payment status
- court data
- date and time

Actions:

- open detail
- cancel if allowed
- request time change if enabled
- view updated status

Rules:

- A player sees only their own reservations.
- Cancellation depends on the policy that still needs definition.
- Time change is a request, not an automatic mutation, unless product rules
  explicitly change.

Open decisions:

- cancellation window
- whether time-change request is MVP
- whether players can cancel confirmed reservations directly

### Reservation Time Change Request

Suggested route:

- `/app/reservations/:reservationId/change-request`

Phase:

- MVP candidate

Purpose:

- Let a player request a reservation time change.

Flow:

1. player opens reservation
2. player chooses a new available slot
3. player submits request
4. organization operator accepts or rejects
5. calendar changes only if accepted

Rules:

- Cannot request a move to an unavailable slot.
- Organization approval is required.
- The request should record who requested and who approved or rejected.
- Moving a confirmed reservation must validate conflicts.

Open decisions:

- whether this belongs in MVP
- whether rejection requires a reason
- whether the old slot remains blocked while change is pending

### Open Matches

Suggested route:

- `/app/open-matches`
- `/app/open-matches/:openMatchId`

Phase:

- MVP

Purpose:

- Let players find or join open groups.

List should show:

- sport
- place
- date
- time
- expected level
- total spots
- filled spots
- status

Filters:

- sport
- level
- date
- court or venue if applicable

Actions:

- join match
- leave match
- create match
- cancel match if creator

Statuses:

- `open`
- `full`
- `canceled`
- `completed`

Rules:

- Player cannot join the same match twice.
- Player cannot join a full match.
- Player cannot join a canceled or completed match.
- Level is an expectation, not necessarily a hard block.
- Organization-created open matches are V2 unless scope changes.

Open decisions:

- whether level mismatch blocks joining or only warns
- whether open match must be tied to a court or can use free-text place

### Create Open Match

Suggested route:

- `/app/open-matches/new`

Phase:

- MVP

Purpose:

- Let a player organize a playable group.

Fields:

- sport
- place
- date
- time
- participant limit
- expected level
- optional note

Actions:

- create
- edit if allowed
- cancel

Rules:

- An open match does not replace a court reservation unless the flows are
  explicitly connected.
- Match place may start as an organization/court reference or simple text.

Open decisions:

- whether creator joins automatically
- whether editing is allowed after participants join
- whether open match can reserve a court in the same flow

### Choose Classes For The Week

Suggested route:

- `/app/classes`

Phase:

- V2

Purpose:

- Let a student choose classes according to their academy plan.

Users:

- student linked to an academy

Content:

- available classes for the week
- coach
- class theme
- min and max level
- available spots
- minimum students required
- class status

Actions:

- choose class
- swap class
- cancel participation if allowed
- choose another time if class is canceled

Rules:

- Student can choose only within plan limits.
- Academy may block scheduling if payment is not valid.
- Class may be canceled if minimum students is not reached.
- Canceled class should let the student choose another time.

### My Classes

Suggested route:

- `/app/classes/my`

Phase:

- V2

Purpose:

- Let a student see selected classes.

Content:

- upcoming classes
- canceled classes
- coach
- theme
- time
- location
- status

Statuses:

- `confirmed`
- `waiting_minimum`
- `canceled`
- `completed`

Rules:

- Class can depend on minimum student count.
- Canceled classes should clearly tell the student to choose another time.

## Organization Pages

### Organization Dashboard

Suggested route:

- `/organizations/:organizationSlug`

Phase:

- MVP

Purpose:

- Provide an operational overview for court management.

Content:

- today's reservations
- pending payments
- active units
- active courts
- available slots
- basic alerts
- shortcuts to calendar, courts, reservations, payments, and profile

Actions:

- open calendar
- create court
- view pending reservations
- update payment status

Future:

- financial projection
- maintenance alerts
- inventory control
- advanced reports

Rules:

- Dashboard shows only the active organization's operational data.
- Organization owners/admins can see all units and courts.
- Staff can see only assigned units and courts.
- Cross-organization visibility is forbidden.

### Organization Profile

Suggested route:

- `/organizations/:organizationSlug/profile`

Phase:

- MVP

Purpose:

- Configure public and operational organization information.

Fields:

- name
- short description
- city
- textual address
- contact
- offered sports
- available amenities
- food and beverage availability
- general rules
- opening hours

Actions:

- edit profile
- activate or deactivate visibility
- switch to another accessible context

Rules:

- Organization profile should exist before court registration.
- Private data must not appear publicly.
- Public data appears in discovery.
- Public organization pages use `/organizations/:organizationSlug` or a later
  dedicated public route if product chooses to separate public and operational
  URLs.

Open decisions:

- required fields for MVP
- whether organization profile approval is manual
- whether visibility can be disabled independently from court activation

### Organization Units

Suggested route:

- `/organizations/:organizationSlug/units`
- `/organizations/:organizationSlug/units/:unitSlug`

Phase:

- MVP candidate

Purpose:

- Represent multiple physical locations under one Organization.

Content:

- unit name
- city
- address
- active courts
- assigned staff

Rules:

- One Organization can have multiple units, including units in different cities.
- Owners/admins can see all units.
- Staff access may be scoped to assigned units.

Open decisions:

- whether a single-location organization creates an implicit default unit in MVP
- whether unit management UI is MVP or immediately after MVP

### Court Management

Suggested route:

- `/organizations/:organizationSlug/courts`

Phase:

- MVP

Purpose:

- List and control the organization's courts.

List should show:

- court name
- accepted sports
- price
- status: active or inactive
- next available slots
- quick actions

Actions:

- create court
- edit court
- activate or deactivate
- configure availability
- view court reservations

Rules:

- Inactive court cannot receive reservations.
- Inactive court can remain visible to organization admin.
- Each court must have at least one sport.
- Court routes use court slugs in user-facing URLs.

### Create Or Edit Court

Suggested route:

- `/organizations/:organizationSlug/courts/new`
- `/organizations/:organizationSlug/courts/:courtSlug/edit`

Phase:

- MVP

Purpose:

- Configure reservable court data.

Fields:

- court name
- accepted sports
- base price
- specific rules
- periods if enabled
- active or inactive status

Rules:

- Price should be defined before court becomes reservable.
- Sports must come from the allowed sport catalog.
- Court rules must be visible to the player before reservation.

Open decisions:

- whether price is required at court creation or before activation
- whether periods are MVP

### Availability And Period Configuration

Suggested route:

- `/organizations/:organizationSlug/courts/:courtSlug/availability`
- `/organizations/:organizationSlug/calendar/configuration`

Phase:

- MVP

Purpose:

- Define when each court can be reserved.

Fields:

- court
- day
- start time
- end time
- period
- specific price if enabled
- sport if availability is sport-specific

Rules:

- Start time must be before end time.
- Invalid overlaps must be prevented.
- Availability must be compatible with reservation conflict rules.

Open decisions:

- availability by court only or by court and sport
- fixed court price or price by time/period
- recurring availability versus manually created slots

### Court Calendar

Suggested route:

- `/organizations/:organizationSlug/calendar`

Phase:

- MVP

Purpose:

- Provide visual operational control of court reservations and availability.

Layout:

- columns represent courts
- rows represent times
- reservation blocks appear in the grid
- free slots appear as available
- occupied slots appear blocked or reserved

Actions:

- create availability
- view reservation
- move reservation if enabled
- confirm reservation
- cancel reservation
- update payment status
- accept time change request

Rules:

- Moving a reservation must validate conflicts.
- Moved reservation should record who moved it.
- Player may request a move, but organization approves if change request flow
  exists.
- Confirmed reservation blocks the slot.

Open decisions:

- drag-and-drop in MVP or later
- whether move can happen directly from calendar
- whether move requires a reason

### Organization Reservation Detail

Suggested route:

- `/organizations/:organizationSlug/reservations/:reservationId`

Phase:

- MVP

Purpose:

- Let an organization operator manage a reservation.

Content:

- player
- court
- sport
- date
- time
- price
- reservation status
- payment status
- action history

Actions:

- confirm
- cancel
- reschedule if enabled
- mark as paid
- mark as pending
- mark as failed or overdue when applicable

Rules:

- Organization operator manages only reservations for accessible units/courts.
- Status changes must respect valid transitions.
- Payment is manual in MVP.
- Sensitive changes should be auditable.

### Manual Payments

Suggested route:

- `/organizations/:organizationSlug/payments`

Phase:

- MVP

Purpose:

- Track reservation payments without a payment gateway.

List should show:

- reservation
- player
- court
- amount
- date
- payment status

Statuses:

- `pending`
- `paid`
- `failed`
- `overdue`

Actions:

- mark as paid
- mark as pending
- update status
- open related reservation

Rules:

- No online payment in MVP.
- No refund operational flow in MVP.
- Payment control is manual.
- Payment changes should be auditable.

### Services And Amenities

Suggested route:

- part of `/organizations/:organizationSlug/profile`
- part of court or venue detail pages

Phase:

- MVP candidate

Purpose:

- Show simple place differentiators to players.

Possible fields:

- sells water
- sells food
- sells drinks
- has bathroom
- has parking
- has lighting
- rents equipment

Display:

- simple icons in cards and details

Rules:

- Do not turn amenities into a complex catalog in MVP.
- Use amenities as quick decision information for players.

Open decisions:

- exact MVP amenity list
- whether amenities are searchable filters or display-only

### Organization Member Management

Suggested route:

- `/organizations/:organizationSlug/settings/members`

Phase:

- MVP candidate

Purpose:

- Control who can manage an organization account.

Content:

- current owners, admins, and staff
- permissions
- history
- primary owner

Actions:

- add member
- remove member
- transfer ownership
- view logs

Rules:

- Every sensitive action should have an audit record.
- Ownership transfer must be explicit.
- Cross-organization access is forbidden.

Open decisions:

- whether member management UI is MVP
- permission levels
- whether logs are visible in the UI

## Academy Pages

Academy pages are V2 unless product scope changes. They are documented here so
the frontend and domain model can avoid decisions that block them later.

### Academy Dashboard

Suggested route:

- `/academies/:academySlug/manage`

Phase:

- V2

Purpose:

- Provide an operational overview of classes.

Content:

- today's classes
- active coaches
- classes below minimum students
- students with pending payment
- upcoming classes
- shortcuts to calendar, coaches, students, classes, and payments

Rules:

- Academy dashboard is different from organization court dashboard.
- If the same user has Player, Organization, and Academy contexts, the UI should
  support context switching.
- Public Academy profile pages can use `/academies/:academySlug`; operational
  Academy pages use `/academies/:academySlug/manage`.

### Academy Profile

Suggested route:

- `/academies/:academySlug/manage/profile`

Phase:

- V2

Purpose:

- Configure academy data.

Fields:

- academy name
- description
- sports taught
- city and address
- contact
- rules
- class policy
- replacement policy if defined

Actions:

- edit data
- activate or deactivate academy
- configure plans

### Coaches

Suggested route:

- `/academies/:academySlug/manage/coaches`

Phase:

- V2

Purpose:

- Manage academy coaches.

List should show:

- name
- sports
- schedule
- status
- linked classes

Actions:

- create coach
- edit coach
- deactivate coach
- view coach agenda

Rules:

- Coach can start as an operational entity.
- Coach login is a V2 decision.

### Academy Calendar

Suggested route:

- `/academies/:academySlug/manage/calendar`

Phase:

- V2

Purpose:

- Organize classes by coach.

Layout:

- columns represent coaches
- rows represent times
- blocks represent classes
- clicking a block opens allocated students

Block content:

- sport
- class theme
- level
- student count
- minimum required students
- status

Statuses:

- `open`
- `waiting_minimum`
- `confirmed`
- `full`
- `canceled`
- `completed`

Actions:

- create class
- edit class
- cancel class
- view students
- move class
- change coach
- change theme

Rules:

- Class can require a minimum number of students.
- Class can be canceled if minimum is not reached.
- Students need a way to choose another class when canceled.
- Academy can limit classes by level.
- Academy owners/admins can manage all classes.
- Coaches can view classes but manage only assigned classes.

### Create Or Edit Class

Suggested route:

- `/academies/:academySlug/manage/classes/new`
- `/academies/:academySlug/manage/classes/:classSlug/edit`

Phase:

- V2

Purpose:

- Configure a class or group lesson.

Fields:

- coach
- sport
- date
- time
- duration
- class theme
- minimum level
- maximum level
- minimum students
- maximum students
- notes

Example themes:

- defense
- attack
- serve
- reception
- positioning
- specific fundamental
- guided game

Rules:

- Class level should match allowed student levels.
- Minimum students define whether the class can happen.
- Maximum students defines capacity.
- Theme helps organize teaching methodology.

### Class Detail

Suggested route:

- `/academies/:academySlug/manage/classes/:classSlug`

Phase:

- V2

Purpose:

- Manage students in a class.

Content:

- coach
- time
- theme
- level
- registered students
- remaining spots
- status
- student payment context if needed

Actions:

- add student
- remove student
- cancel class
- confirm class
- approve extra class
- view students

Rules:

- Class may be canceled if minimum is not reached.
- Student should be able to reallocate after cancellation.
- Academy controls manual exceptions.
- Coaches can accept students only for classes assigned to them and only when
  academy rules allow it.

### Students

Suggested route:

- `/academies/:academySlug/manage/students`

Phase:

- V2

Purpose:

- Manage students linked to an academy.

List should show:

- name
- level
- plan
- payment status
- classes this week
- status

Actions:

- link student
- remove link
- update plan
- block or unblock scheduling
- view class history

Rules:

- Student can be a normal app user.
- Academy can block scheduling if payment is pending.
- Plan defines how many classes the student can choose.

### Plans And Weekly Classes

Suggested route:

- `/academies/:academySlug/manage/plans`

Phase:

- V2

Purpose:

- Control how many classes a student can take.

Fields:

- plan name
- classes per week
- validity
- payment status
- replacement rules if defined

Rules:

- Student chooses classes according to plan.
- If weekly limit is used, student cannot schedule more.
- Extra class is an exception.

### Extra Classes

Suggested route:

- part of class or student flows

Phase:

- V2 or future

Purpose:

- Allow controlled exceptions.

Possible flow:

1. student requests extra class
2. coach or academy approves
3. class appears in calendar
4. extra charge may or may not be generated

Open decisions:

- whether extra class belongs in V2
- whether coach alone can approve
- whether academy approval is required
- whether extra class creates separate payment

### Academy Payments

Suggested route:

- `/academies/:academySlug/manage/payments`

Phase:

- V2

Purpose:

- Control whether a student can schedule classes.

Content:

- student
- plan
- status
- due date
- released classes
- scheduling block

Statuses:

- `paid`
- `pending`
- `overdue`
- `blocked`

Rules:

- No payment integration in MVP.
- Academy payment control is manual.
- Academy may prevent scheduling if student has not paid.

## Admin App Pages

### Admin Dashboard

Suggested route:

- `/admin`

Phase:

- MVP candidate only if operationally necessary

Purpose:

- Internal platform overview.

Possible content:

- users
- organizations
- academies
- sports
- billing or subscriptions
- metrics
- reservations
- audit logs
- operational issues

Rules:

- Build only if needed for MVP operations.
- If not needed, start with manual operation and backend records.

### Sports Catalog

Suggested route:

- `/admin/sports`

Phase:

- MVP candidate

Purpose:

- Manage sports.

Initial sports:

- `futevolei`
- `beach_tennis`
- `beach_volleyball`

Out of MVP:

- `altinha`

Actions:

- create sport
- edit public name
- activate or deactivate
- order display

Rules:

- Frontend and backend should use the same sport catalog.
- Avoid hardcoding in a way that blocks future sports.

Open decisions:

- sports admin UI versus seeded backend catalog in MVP

### Audit Logs

Suggested route:

- `/admin/audit`
- organization or academy scoped logs where appropriate

Phase:

- MVP candidate for backend audit records; UI can be later

Purpose:

- Track sensitive operational actions.

Events that should generate log:

- court creation
- availability edit
- reservation creation
- reservation confirmation
- reservation cancellation
- reservation move
- payment status change
- administrator transfer
- admin added or removed
- class change
- class cancellation

Log data:

- actor
- timestamp
- action
- affected entity
- previous value when relevant
- new value when relevant

Rules:

- Audit records protect operational trust.
- UI can wait if backend records exist and support workflows are manual.

## Navigation Draft

This route map records the KAN-65 navigation decision. Public and operational
entity pages use slugs from the start. Backend APIs can still use stable IDs
internally. KAN-66 presentation, responsive behavior, context switching, and
route-selection rules live in `docs/frontend/sandicts-mobile-navigation.md`.

Public:

- `/`
- `/sign-in`
- `/discovery`
- `/courts/:courtSlug`
- `/organizations/:organizationSlug`
- `/academies/:academySlug`
- `/players/:playerSlug`

This product route inventory includes planned surfaces. Current runtime access
and Google One Tap eligibility are classified separately in
`src/lib/routes/route-access-policy.ts`. A new public detail page must receive
an explicit route policy; public status does not make it One Tap eligible or
indexable.

Player:

- `/app`
- `/app/onboarding`
- `/app/profile`
- `/app/courts`
- `/app/courts/:courtSlug`
- `/app/reservations`
- `/app/reservations/:reservationId`
- `/app/reservations/:reservationId/change-request`
- `/app/open-matches`
- `/app/open-matches/:openMatchId`
- `/app/open-matches/new`
- `/app/classes`
- `/app/classes/my`

Organization:

- `/organizations/:organizationSlug`
- `/organizations/:organizationSlug/profile`
- `/organizations/:organizationSlug/units`
- `/organizations/:organizationSlug/units/:unitSlug`
- `/organizations/:organizationSlug/courts`
- `/organizations/:organizationSlug/courts/new`
- `/organizations/:organizationSlug/courts/:courtSlug/edit`
- `/organizations/:organizationSlug/courts/:courtSlug/availability`
- `/organizations/:organizationSlug/calendar`
- `/organizations/:organizationSlug/reservations`
- `/organizations/:organizationSlug/reservations/:reservationId`
- `/organizations/:organizationSlug/payments`
- `/organizations/:organizationSlug/settings/members`

Academy:

- `/academies/:academySlug/manage`
- `/academies/:academySlug/manage/profile`
- `/academies/:academySlug/manage/coaches`
- `/academies/:academySlug/manage/calendar`
- `/academies/:academySlug/manage/classes`
- `/academies/:academySlug/manage/classes/new`
- `/academies/:academySlug/manage/classes/:classSlug`
- `/academies/:academySlug/manage/classes/:classSlug/edit`
- `/academies/:academySlug/manage/students`
- `/academies/:academySlug/manage/plans`
- `/academies/:academySlug/manage/payments`

Admin App:

- `/admin`
- `/admin/metrics`
- `/admin/sports`
- `/admin/users`
- `/admin/organizations`
- `/admin/academies`
- `/admin/billing`
- `/admin/audit`

## MVP Page Map

Confirmed or likely MVP pages:

| Area | Page | Phase |
| --- | --- | --- |
| Public | Public home and discovery | MVP |
| Public | Sign in | MVP |
| Public | Court or venue detail | MVP |
| Public | Public academy detail | V2 or MVP candidate |
| Public | Public player profile | V2, route reserved |
| Player | Player home | MVP |
| Player | Profile onboarding | MVP basic |
| Player | Player profile | MVP basic |
| Player | Discover courts | MVP |
| Player | Reservation request | MVP |
| Player | My reservations | MVP |
| Player | Open matches | MVP |
| Player | Create open match | MVP |
| Organization | Organization dashboard | MVP |
| Organization | Organization profile | MVP |
| Organization | Organization units | MVP candidate |
| Organization | Court management | MVP |
| Organization | Create or edit court | MVP |
| Organization | Availability configuration | MVP |
| Organization | Court calendar | MVP |
| Organization | Reservation detail | MVP |
| Organization | Manual payments | MVP |
| Organization | Amenities | MVP candidate |
| Admin App | Sports catalog | MVP candidate |
| Admin App | Audit records | MVP candidate backend, UI later |
| Admin App | Organizations and academies | MVP candidate |
| Admin App | Billing status | MVP candidate |

V2 or later pages:

| Area | Page | Phase |
| --- | --- | --- |
| Player | Choose classes for week | V2 |
| Player | My classes | V2 |
| Academy | Academy dashboard | V2 |
| Academy | Academy profile | V2 |
| Academy | Coaches | V2 |
| Academy | Academy calendar | V2 |
| Academy | Create or edit class | V2 |
| Academy | Class detail | V2 |
| Academy | Students | V2 |
| Academy | Plans | V2 |
| Academy | Extra classes | V2 or future |
| Academy | Academy payments | V2 |
| Admin App | Full admin dashboard | MVP candidate or future |

## Business Rules Extracted From Page Descriptions

Authentication and access:

- Public discovery is allowed.
- Practical actions require login.
- After login, the app should resume the attempted action when possible.
- A single account may have Player, Organization, Academy, and Admin App
  contexts.
- Context switching is required when the user has more than one accessible
  context.
- Slugs are used in user-facing entity routes from the start.
- Profile completion may block practical actions.

Player profile:

- Simple level is self-declared.
- Simple level is used for filtering and expectations, not ranking.
- Athlete card, overall, and technical evolution are not MVP.
- Public player profiles use `/players/:playerSlug` and must respect public,
  friends-only, or private visibility rules.

Courts and availability:

- Organization controls court availability.
- Inactive courts cannot be reserved.
- Unavailable slots cannot be reserved.
- Court rules must be visible before reservation.
- Price must be visible before reservation.
- Organization owners/admins can see all units and courts.
- Organization staff can be scoped to assigned units/courts.

Reservations:

- Reservation status must be explicit.
- Confirmed reservation blocks the slot.
- Duplicate active confirmed reservation for the same court and time is
  forbidden.
- Organization manages reservation confirmation or cancellation.
- Payment is manual in MVP.
- Time change request requires organization approval if the feature exists.

Payments:

- Manual payment states are operational records.
- MVP payment statuses are `pending`, `paid`, `failed`, and `overdue`.
- No online payment, refund flow, split, or payout automation in MVP.
- Payment status changes should be auditable.

Open matches:

- Player-created open matches are MVP.
- Player cannot join the same match twice.
- Player cannot join a full match.
- Player cannot join canceled or completed match.
- Level is expectation, not verified ranking.

Academy and classes:

- Academy logic is different from court reservation logic.
- Academy module includes coaches, students, plans, classes, and payment blocks.
- Class can require minimum and maximum students.
- Student plan can limit weekly class choices.
- Academy can block scheduling if payment is not valid.
- Academy owners/admins can manage all classes.
- Coaches can view classes but manage only assigned classes.
- Coaches can accept students into assigned classes only when academy rules
  allow it.
- Academy module is V2 unless product scope changes.

Admin App and audit:

- Sensitive administrative and operational actions should be auditable.
- Cross-organization and cross-academy access is forbidden.
- Full admin UI should exist only if operationally necessary.
- Billing model for organizations and academies remains flexible: fixed
  subscription, commission/percentage, or hybrid.

## Open Decisions

Product scope:

- Should visitors see only courts or also academies?
- Should public users see exact available slots?
- Should academy discovery exist in MVP as display-only?
- Should class scheduling remain V2?
- Should reservation time-change request be MVP?
- Should amenities be searchable filters or display-only?
- Should admin management UI be MVP?
- Should sports catalog have admin UI or be seeded/configured manually?
- Should public player profile visibility controls ship in MVP or V2?

Profile:

- Is city required in MVP?
- Does preferred court side belong in MVP?
- Does dominant foot belong in MVP?
- Does academy affiliation belong in MVP profile?

Reservations:

- Does organization always confirm reservations manually?
- Is automatic confirmation allowed in MVP?
- What is the cancellation window?
- Can players cancel confirmed reservations directly?
- Does the old slot remain blocked during a change request?

Courts and availability:

- Is availability defined by court only or by court and sport?
- Is price fixed by court or variable by time/period?
- Are recurring availability rules MVP?
- Is drag-and-drop reservation moving MVP?

Open matches:

- Does creator join automatically?
- Is editing allowed after participants join?
- Can open match reserve a court in the same flow?
- Is level mismatch a hard block or only a warning?

Academy:

- Does coach have login in V2?
- Are extra classes V2 or future?
- Can coach approve extra classes alone?
- Does extra class create a separate payment?

Permissions and audit:

- What permission levels exist between owner and admins?
- What staff permission levels exist inside an Organization?
- What coach permission levels exist inside an Academy?
- Which audit logs need UI versus backend records only?

Billing:

- Do Organizations and Academies pay fixed subscriptions, a commission or
  percentage, or a hybrid model?

## Next Step Before Jira

Before creating Jira issues, use this document to produce a page inventory batch:

1. confirm MVP pages
2. confirm V2 pages
3. resolve the most important open decisions
4. define the first fullstack route/API slices
5. only then create Epics, Stories, Tasks, and Subtasks in Jira
