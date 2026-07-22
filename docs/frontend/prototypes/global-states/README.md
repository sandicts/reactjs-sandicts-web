---
title: Sandicts Global States Prototype
doc-type: frontend-ux-prototype
role: source-of-truth
priority: high
canonical: docs/frontend/prototypes/global-states/README.md
related:
  - docs/frontend/prototypes/app-shells/README.md
  - docs/frontend/sandicts-expired-session-experience.md
  - docs/frontend/sandicts-mvp-visual-system.md
  - docs/frontend/sandicts-page-functional-spec.md
  - KAN-69
  - KAN-78
scope: frontend, ux, prototype, loading, empty, error, access, responsive, mvp
read-when:
  - implementing or reviewing shared loading, empty, error, access, or not-found UI
  - adding a Next.js loading, error, not-found, or forbidden-style boundary
  - deciding whether retry, reset, sign-in, or navigation is the safe next action
do-not-read-when:
  - implementing feature business rules that do not change page-state behavior
  - looking for domain-specific API status mappings
  - treating prototype copy as a translated production message catalog
---

# Sandicts Global States Prototype

## Purpose

Define the reusable state language for Sandicts before production screens add
one-off loading, empty, error, unauthenticated, forbidden, and not-found
treatments.

This directory is the KAN-69 implementation-ready UX handoff. It contains:

- a repository-native interactive catalog
- representative Public, Player, and Organization contexts
- accepted state anatomy, copy, action, semantic, and responsive decisions
- explicit ownership boundaries for KAN-78
- validation criteria for production components and route boundaries

The prototype decides behavior and composition. It does not add production
React components, API integration, authentication behavior, or feature state
machines.

## View The Prototype

Open [`index.html`](./index.html) directly in a browser, or serve the repository
root and navigate to:

```text
/docs/frontend/prototypes/global-states/index.html
```

The toolbar controls:

- context: Public, Player, or Organization
- canonical state
- expected content shape for initial loading and empty states
- long Portuguese copy stress testing

Selections are written to query parameters so a scenario can be copied,
reloaded, and revisited with browser back and forward.

Example:

```text
index.html?context=organization&state=loading-page&shape=calendar
```

## Artifact Organization

The prototype remains dependency-free and can be opened directly from the
filesystem. Files are split by responsibility without introducing a build
step:

```text
global-states/
├── index.html                 # semantic document and local SVG sprite
├── styles.css                # tokens, reset, focus, and shared controls
├── prototype-toolbar.css     # prototype-only scenario controls
├── prototype-shell.css       # Public, Player, and Organization shells
├── prototype-states.css      # loading, empty, error, and access compositions
├── prototype.catalog.js      # immutable contexts, navigation, copy, and actions
├── prototype.renderers.js    # shell, skeleton, state, and content-shape rendering
├── prototype.js              # URL state, events, dialog behavior, and bootstrap
└── README.md                 # decisions, validation, and KAN-78 handoff
```

Classic deferred scripts intentionally share one `SandictsGlobalStates`
namespace. ES modules were not introduced because this artifact must continue
to work when `index.html` is opened directly with a `file://` URL.

## Status And Authority

| Artifact | Status | Authority |
| --- | --- | --- |
| Files under `global-states/` | KAN-69 interactive prototype | Canonical for state behavior and responsive composition |
| This document | KAN-69 handoff | Canonical for ownership, semantics, and implementation rules |
| App-shell prototype | Approved KAN-68 direction | Canonical for navigation and shell presentation |
| Production shells | Delivered by KAN-77 | Canonical implementation reference |
| Copy shown here | Implementation-ready pt-BR direction | Input to localization ownership, not a permanent global catalog |

When this prototype and KAN-68 disagree about navigation, follow KAN-68 and the
production shell. When feature requirements require a different action or
message, preserve the state rules here while keeping feature behavior with the
owning feature.

## Selected State Model

Sandicts uses nine canonical examples:

| State | Meaning | Default treatment |
| --- | --- | --- |
| Initial page loading | A read required for the content region is pending | Skeleton shaped like the expected content |
| Action loading | A user-triggered command is pending | Progress inside the initiating control |
| First-use empty | The user has not created or completed the first relevant item | Explain the starting point and offer one useful action |
| No results | Data may exist, but active filters returned nothing | Explain the filter effect and offer reset |
| Legitimate empty | The absence is valid and needs no correction | Inform without forcing an action |
| Recoverable error | A safe read or operation can be attempted again | Explain briefly and offer retry only when safe |
| Unauthenticated | No valid session can continue the intended action | Sign-in action with validated return destination |
| Forbidden | A valid session lacks authorization | Preserve understandable context and offer a safe authorized path |
| Not found | A route or resource is unavailable | Neutral copy that does not disclose private existence |

Success, field validation, business-rule failures, suspended accounts, and
domain statuses remain separate concerns:

- success should become persistent updated UI, with optional inline
  confirmation
- field validation stays beside the responsible field
- business-rule failure stays near the blocked action
- suspended or restricted entities need feature-owned consequences and recovery
- domain status badges map stable API codes inside the owning feature

## Representative Coverage

The prototype intentionally uses representative scenarios rather than
generating every state for every page.

| Context | Page reference | Representative coverage |
| --- | --- | --- |
| Public | Discovery | Card/list loading and empty, no results, recoverable error, and not found |
| Player | Reservations and open matches | Card/list loading and empty, first-use empty, recoverable error, and unauthenticated |
| Organization | Dashboard, agenda, and reservations | Dashboard, calendar, and table loading and empty; operational empty; forbidden |
| Global access | Intended destination | Unauthenticated and privacy-safe not found |

The toolbar allows every state in every context to test language and layout,
but those combinations do not create new product requirements.

## Shared Anatomy

Non-loading state composition uses:

1. optional Lucide-direction icon
2. short state category label
3. direct title
4. one useful explanatory sentence
5. one primary action when the user can resolve the state
6. one optional secondary action only when it offers a genuinely different path
7. optional implementation note in the prototype, not in production UI

Rules:

- the page retains one logical heading hierarchy
- an in-page state sits below the page heading
- a route-level state without an existing page heading promotes its state title
  to the page `h1`
- icon, title, and color never communicate status independently
- state copy does not expose stack traces, request IDs, internal error messages,
  authorization rules, or resource existence
- custom illustrations and decorative stock imagery remain out of MVP

## Loading Decisions

### Initial Page Or Section Loading

- Replace only the region whose read is pending.
- Preserve the expected content geometry.
- Use card/list skeletons for public and Player browsing.
- Use table skeletons for dense comparable Organization records.
- Use a court-by-time skeleton for the Organization agenda.
- Use metric and panel skeletons for dashboards.
- Keep shell navigation, topbar, page title, and safe independent actions
  stable.
- Mark visual skeletons as decorative.
- Expose concise accessible status text and `aria-busy` on the pending region.
- Do not use a full-screen spinner for a local read.

### Action Loading

- Keep progress inside the initiating button or control.
- Preserve the control width.
- Set busy and disabled state while preventing duplicate submission.
- Keep the surrounding form or summary visible.
- Do not claim success before the server confirms it.
- Keep cancel available only when cancellation is real and safe.

## Empty Decisions

### First Use

Explain what will appear and offer creation, onboarding, or discovery only when
the current user can perform that action.

Examples:

- Player with no reservations: explore courts
- Organization with no configured court: create the first court
- Public area with no published venue: explore another region

### No Results

State that the current filter combination returned nothing. The primary action
resets filters while preserving the page and context.

Do not use first-use language when records may exist outside the current query.

### Legitimate Empty

Use calm informational language. A free schedule or completed period does not
need a forced call to action.

The normal page action may remain available without being repeated inside the
empty state.

## Error And Retry Decisions

- Explain that the content could not be loaded.
- Avoid blaming the user or displaying technical details.
- Show retry only for an idempotent read or otherwise safe operation.
- Preserve filters and local context across retry.
- Use the Next.js `reset` callback only when repeating the render/read is safe.
- Do not map all `4xx` or `5xx` responses to the same generic error.
- Authentication, forbidden, not found, validation, conflict, rate limit, and
  unavailable dependency states need their correct semantic branch.

An error already present when a route loads should use a heading and normal
reading order. An assertive live announcement is reserved for a failure that
appears after the user initiated an interaction.

## Access Decisions

### Unauthenticated

- Explain that sign-in is required.
- Preserve only a validated internal `returnTo`.
- Do not place credentials or reusable tokens in the return URL.
- Re-check authorization after authentication.
- When no session is known, use a public or minimal access boundary instead of
  exposing private navigation.
- Keep unauthenticated distinct from forbidden.

Confirmed session-expiry classification, sign-in copy, safe `returnTo`, form
draft behavior, and auth-level forbidden behavior live in
`docs/frontend/sandicts-expired-session-experience.md`.

### Forbidden

- Keep the active authenticated context understandable.
- Never silently switch organization, player profile, or resource.
- Offer a context chooser or a known authorized destination.
- Do not reveal data from the forbidden resource.
- Keep permission details general unless the user can safely act on them.

## Not-Found Decisions

- Use the same neutral treatment for an unavailable private resource and an
  unknown identifier when revealing existence would be sensitive.
- Give a safe route back to the relevant context.
- Do not offer retry when the problem is not expected to be temporary.
- Use the Public destination for unknown global routes and the current allowed
  app home for in-shell routes.

## Shell Preservation

In-shell loading, empty, recoverable error, forbidden, and not-found examples
replace only the content region.

The following stay stable:

- selected destination
- Public header or authenticated topbar
- Player compact bottom navigation
- Player and Organization medium rail
- Player and Organization expanded sidebar
- visible organization or Player context

Unauthenticated is the deliberate exception when no session is available. The
prototype falls back to the public/minimal shell while still naming the intended
destination.

## Responsive Contract

Use the KAN-68 and KAN-77 shell transitions:

| Mode | Width | Public | Player | Organization |
| --- | --- | --- | --- | --- |
| Compact | below `48rem` | Compact header | Bottom navigation | App bar and menu/drawer |
| Medium | `48rem` to below `64rem` | Horizontal header | Icon rail | Icon rail |
| Expanded | `64rem` and above | Horizontal header | Labeled sidebar | Labeled sidebar |

Validation widths:

- `320px`
- `390px`
- `768px`
- `1440px`
- compact landscape
- `200%` browser zoom
- long Portuguese labels

Rules:

- no page-level horizontal overflow
- calendar and wide-table regions may scroll horizontally when named
- fixed or absolute compact navigation must not cover content or focus
- hidden navigation must not remain focusable
- actions reflow to full width when compact content requires it
- touch targets remain at least `44px` by `44px`
- long labels wrap instead of truncating the decision
- safe-area insets protect compact bottom navigation

## Accessibility Contract

| Concern | Decision |
| --- | --- |
| Landmarks | Stable header, navigation, and main landmarks |
| Bypass | Skip link reaches the shell content |
| Heading | One logical document/page heading followed by state heading |
| Dynamic demo | Polite live region announces toolbar changes without moving focus |
| Initial loading | `aria-busy` plus concise status text |
| Skeletons | Decorative and hidden from assistive technology |
| Errors | Assertive announcement only when a new interactive failure appears |
| Icons | Decorative unless the icon itself is the named control |
| Focus | Visible Sand Orange indicator and logical source order |
| Hidden UI | `hidden` or unmounted, never merely transparent |
| Color | Text or icon accompanies every semantic color |
| Motion | Reduced-motion preference removes shimmer and nonessential transitions |
| Drawer | Native modal semantics, Escape support, and focus return |

The prototype does not replace assistive-technology testing of production
components.

## Copy And Action Direction

Use Brazilian Portuguese that:

- starts with what happened
- gives one sentence of context
- names the safest useful next action
- avoids false certainty
- avoids internal terminology
- avoids promising that retry will succeed
- distinguishes absent data, filtered data, missing session, missing permission,
  and unavailable resource

Action hierarchy:

1. primary action resolves or safely advances the state
2. secondary action provides a distinct escape path
3. no action is preferable to a decorative or redundant button

The long-copy toggle deliberately stretches descriptions and action labels. Its
extra wording is test content, not approved product copy.

## Implementation Handoff To KAN-78

KAN-78 should implement small ownership boundaries rather than one universal
state machine.

## KAN-78 Production Implementation

KAN-78 turns the prototype rules into focused production building blocks:

```text
src/components/shared/page-state/       # non-loading state composition
src/components/shared/loading-region/   # aria-busy wrapper for pending reads
src/components/shared/pending-button/   # user-triggered pending action button
src/components/shared/status-badge/     # semantic status presentation wrapper
src/app/not-found.tsx                   # global privacy-safe 404 route state
```

These components intentionally stay below business logic:

- `PageState` owns layout, icon placement, heading level, action slots, tone,
  and optional live-region semantics. Consumers own the copy and decide whether
  retry, sign-in, creation, reset, or navigation is valid.
- `LoadingRegion` owns `aria-busy` and concise accessible status text. Features
  and route areas still compose skeleton shapes that match their real content.
- `PendingButton` owns duplicate-submit protection, busy state, spinner
  presentation, and preserved button width for command loading.
- `StatusBadge` maps a semantic tone to the shared badge primitive. Features
  map API/domain status codes to `{ label, tone }` and provide a neutral
  fallback for unknown runtime values.
- `Alert` no longer uses `role="alert"` by default. Assertive announcements are
  opt-in and should be used only for newly surfaced interactive failures.

Production route boundaries remain thin. The global `not-found.tsx` uses the
public shell and neutral copy for unknown URLs, while in-shell not-found,
forbidden, unauthenticated, loading, and recoverable error states should be
added by the feature or route segment that owns the context.

### Shared Composition

A focused shared composition can own:

- icon placement
- title and description layout
- primary and secondary action slots
- semantic tone used only for presentation
- responsive spacing

It should accept copy and actions from its consumer. It must not own a global
catalog of feature messages or decide whether retry, sign-in, creation, or
navigation is valid.

Suggested focused boundary:

```text
src/components/shared/page-state/
├── page-state.tsx
├── page-state.types.ts
└── page-state.test.tsx
```

The final KAN-78 name is `PageState`. Do not create parallel `empty-state`,
`error-state`, and `access-state` folders when one composition and semantic
props are sufficient.

### Loading Ownership

- `src/components/ui/skeleton.tsx` remains the low-level primitive.
- Features and route areas own skeleton compositions shaped like their content.
- A table, calendar, or dashboard skeleton should not become a bag of generic
  boolean props.
- `loading.tsx` files compose the appropriate skeleton and preserve the shell.
- Mutation hooks expose pending state to the initiating control.

### Next.js Boundaries

- `loading.tsx` owns route-segment initial loading.
- `error.tsx` composes a recoverable state and uses `reset` only when safe.
- `not-found.tsx` uses the privacy-safe neutral treatment.
- forbidden-style boundaries remain explicit until the application has a
  stable authorization boundary convention.
- route files stay thin; feature copy and behavior stay in the owning feature.

### Status Badges

- the shared badge accepts a semantic visual variant
- each feature maps stable API status codes to label and variant
- generic UI must not infer business meaning from color
- unknown statuses need a safe fallback instead of an impossible exhaustive
  assertion against runtime data

### Localization Sequence

KAN-126 should establish the pt-BR message boundary before KAN-78 spreads new
production state copy.

Recommended order:

1. KAN-69 state decisions
2. KAN-126 localization foundation
3. KAN-78 production components

## Accepted Decisions

- Use one shared non-loading composition with consumer-owned behavior.
- Keep content-shaped skeletons near the feature or route.
- Preserve in-shell navigation around local states.
- Use a public/minimal boundary when no session exists.
- Keep no-results distinct from first-use and legitimate empty.
- Keep forbidden distinct from unauthenticated.
- Treat privacy-safe not found as neutral.
- Keep action loading inside the initiating control.
- Use local SVGs following Lucide direction in the prototype.
- Keep the prototype dependency-free and directly openable.
- Split JavaScript into catalog, rendering, and orchestration boundaries instead
  of growing one prototype script.
- Split CSS by toolbar, shell, and state responsibility instead of introducing
  a generic shared prototype folder.
- Use ordered classic scripts and one explicit namespace so direct `file://`
  access remains possible without a build step.
- Render empty states inside the selected card/list, table, calendar, or
  dashboard structure instead of showing the same detached panel everywhere.
- Keep table and calendar overflow inside labelled, keyboard-focusable regions
  instead of allowing horizontal page overflow.

## Rejected Alternatives

- one full-screen spinner for every pending operation
- one component with an enum that owns every message and action
- empty states that always force a primary action
- using `robots`, redirects, or hidden navigation as access control
- retry for commands that may already have succeeded
- silently switching organization on forbidden access
- revealing whether a private identifier exists
- raw API messages, stack traces, or request internals in user copy
- custom illustrations or decorative photography for MVP states
- copying the complete KAN-68 shell into a second navigation specification

## Deferred Questions

- whether a future framework-level forbidden file convention is adopted
- feature-specific retry policies
- domain-specific status badge mappings
- analytics and observability events for state impressions and retry actions

## Validation Record

Validated on 2026-07-06 with the repository served on `127.0.0.1`.

- [x] JavaScript syntax validated with `node --check`
- [x] Static HTTP loading has no console errors
- [x] Query parameters restore and browser history revisits scenarios
- [x] Native controls, visible focus, and dialog focus paths reviewed
- [x] Organization drawer closes with Escape and returns focus
- [x] All 27 context/state combinations render without runtime failures
- [x] Empty card/list, table, calendar, and dashboard frames are selectable
- [x] `320px` and `390px` compact layouts validated
- [x] `768px` medium rail layout validated
- [x] `1440px` expanded sidebar layout validated
- [x] Compact landscape and effective `200%` zoom/reflow width validated
- [x] Long Portuguese copy does not clip actions or state text
- [x] Page-level horizontal overflow is absent
- [x] Reduced-motion behavior is represented in CSS
- [x] Color pairs used by the prototype meet at least `4.5:1` contrast
- [x] Accessible names, landmarks, headings, busy state, and live region reviewed
- [x] `git diff --check` and `npm run quality` pass
- [x] `npm test` passes with 63 tests
- [x] `npm run build` completes successfully
- [x] `npm audit --audit-level=moderate` reports zero vulnerabilities

The browser automation could not change the browser's native zoom level. The
layout was therefore validated at `640px`, the effective reflow width of a
`1280px` viewport at `200%` zoom. A final manual check at native `200%` zoom is
recommended during PR review; this is a verification note, not an
implementation gap.

## KAN-69 Completion Checklist

- [x] Public, Player, and Organization context controls exist.
- [x] Initial loading and action loading are distinct.
- [x] Card/list, table, calendar, and dashboard skeletons exist.
- [x] Card/list, table, calendar, and dashboard empty structures exist.
- [x] First-use, no-results, and legitimate empty are distinct.
- [x] Recoverable error, unauthenticated, forbidden, and not found are distinct.
- [x] Shell preservation and unauthenticated exception are explicit.
- [x] Action hierarchy and pt-BR copy direction are explicit.
- [x] Accessibility and responsive contracts are explicit.
- [x] KAN-78 component and ownership handoff is explicit.
- [x] Rejected and deferred alternatives are documented.
