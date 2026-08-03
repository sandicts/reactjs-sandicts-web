---
title: Sandicts Post-Login Routing
doc-type: frontend-auth-ux-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-post-login-routing.md
related:
  - docs/frontend/prototypes/auth-magic-link/README.md
  - docs/frontend/sandicts-expired-session-experience.md
  - docs/frontend/sandicts-google-one-tap-experience.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-page-functional-spec.md
  - docs/frontend/prototypes/auth-sign-in/README.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
  - KAN-82
scope: frontend, auth, post-login, return-to, contexts, player-profile, ux, security, e2e
read-when:
  - implementing or reviewing post-login routing
  - handling successful Google Sign-In, One Tap, or magic-link consumption
  - deciding what passive session refresh may navigate
  - implementing a protected route return flow
  - routing an account with multiple contexts
  - gating Player routes on profile completion
do-not-read-when:
  - changing backend token lifetime policy
  - changing provider-specific prompt placement without routing impact
  - implementing a feature that does not participate in authentication or context entry
---

# Sandicts Post-Login Routing

## Purpose

Define where an authenticated Sandicts account goes after explicit sign-in,
magic-link consumption, passive session hydration, or a protected-route
handoff.

Sandicts has one account identity and multiple possible contexts: Player,
Organization, Academy, and Admin App. Routing therefore resolves an authorized
destination; it must not infer a permanent account type from the authentication
provider or from the presence of a Player profile.

This decision documents product and security behavior for KAN-82. It does not
implement the router, context inventory, profile onboarding, or protected route
boundary.

## Decision Summary

- Google Sign-In, Google One Tap, and magic-link consumption use one
  provider-independent post-login resolver after they hydrate the same session
  snapshot.
- Passive refresh is navigation-neutral on regular public pages.
- Passive refresh on a protected route verifies and unlocks that same route; it
  does not send the user to an unrelated default context.
- Passive refresh on `/sign-in` runs the post-login resolver so an authenticated
  account is not stranded on the sign-in screen.
- A safe, authorized `returnTo` has priority over context defaults.
- A Player destination requires `GET /players/me` completion state. `missing`
  and `incomplete` route to `/app/onboarding`; a non-Player destination does not
  require Player onboarding.
- Without an authorized `returnTo`, use the last active usable context, then the
  only usable context, then a context picker. Render an explicit no-context
  state when none exists.
- A structurally valid internal `returnTo` that is no longer authorized is not
  opened. The account uses the normal authorized fallback and receives neutral
  feedback that does not reveal the target resource.
- An external, malformed, auth-loop, callback, or secret-bearing `returnTo` is
  discarded and never reflected into a redirect.
- A direct resource-level forbidden response during a valid session remains a
  forbidden state in the active shell. It is not converted into a post-login
  fallback or silent context switch.
- Last-active context and `returnTo` are routing hints, never authorization.

## Required Inputs

The resolver needs semantic inputs rather than provider-specific response
objects:

| Input | Meaning |
| --- | --- |
| Trigger | Explicit authentication, passive refresh on public, passive refresh on sign-in, or passive refresh on protected route |
| Session | Hydrated account, session, access token, and expiry snapshot |
| Current location | The browser pathname, query string, and hash |
| Safe return destination | A structurally validated internal `returnTo`, when present |
| Usable contexts | Current authorized Player, Organization, Academy, and Admin App entries |
| Last active context | A non-authoritative context preference, when available |
| Player completion | `missing`, `incomplete`, or `complete` from `GET /players/me`, loaded only for a Player target |

The current auth response exposes the account and session but does not expose
usable contexts or the last active context. Full multi-context routing depends
on a semantic context inventory contract. Until that contract exists, the
resolver must treat unavailable context data as unresolved rather than invent a
context from a URL, hidden link, or account field.

## Trigger Classification

### Explicit Authentication

These successful flows run the post-login resolver:

- explicit Google Sign-In on `/sign-in`
- Google One Tap credential exchange
- magic-link token consumption
- reauthentication after confirmed session expiry

The provider only creates the Sandicts session. It does not select a Player,
Organization, Academy, or Admin App destination.

### Passive Refresh On A Regular Public Route

A successful browser bootstrap on a regular public route:

- hydrates the authenticated session
- refreshes auth-aware navigation and account controls
- keeps the current public URL
- does not run context fallback

This preserves public discovery, direct links, browser history, and the user's
current reading position.

### Passive Refresh On `/sign-in`

When passive refresh proves that `/sign-in` already has a valid session, run
the normal post-login resolver. A safe `returnTo` still has priority; otherwise
use context fallback.

### Passive Refresh On A Protected Route

The current protected URL is the destination being verified:

1. keep private content hidden while session and authorization are unresolved
2. hydrate the session
3. verify the current route against the current account and contexts
4. apply the Player completion gate when the route belongs to Player
5. render the same route when authorized

If the current protected route is directly forbidden after passive hydration,
render the approved forbidden treatment. Do not silently replace it with
another context. This is direct route access, not an unsuccessful post-login
`returnTo`.

Temporary verification failure and definitive expiry follow
`docs/frontend/sandicts-expired-session-experience.md`.

## Routing Precedence

Use this order after explicit authentication or an authenticated `/sign-in`
bootstrap:

1. Wait until session hydration succeeds.
2. Load the usable context inventory.
3. Parse and structurally validate `returnTo`.
4. Re-check route- and context-level authorization for a safe internal
   `returnTo`.
5. If the authorized destination is Player, load Player completion.
6. Route a `missing` or `incomplete` Player profile to `/app/onboarding` while
   retaining the safe intended Player destination as a continuation.
7. Otherwise resume the authorized `returnTo`.
8. If no authorized `returnTo` remains, resolve the last active context only
   when it is still usable.
9. Otherwise enter the only usable context.
10. Otherwise show the context picker when multiple usable contexts remain.
11. Otherwise render the no-context state.

When a fallback context is Player, apply the same completion gate before its
home route. Organization, Academy, and Admin App fallbacks do not query or gate
on Player completion.

## Context Homes

The resolver returns a context home, not an arbitrary remembered nested page:

| Context | Home |
| --- | --- |
| Player | `/app`, subject to Player completion |
| Organization | `/organizations/:organizationSlug` |
| Academy | `/academies/:academySlug/manage` |
| Admin App | `/admin` |

An explicit context-switcher action also navigates to the selected context
home. Remembering an arbitrary nested page is limited to an authorized
`returnTo`, not normal context switching or last-context restoration.

### Last Active Context

The last active context:

- is considered only after no authorized `returnTo` remains
- must be present in the current usable context inventory
- is ignored when access was removed, the entity is unavailable, or the value
  is malformed
- records context identity, not an arbitrary nested destination
- is updated only after an authorized context entry succeeds
- grants no permission and cannot suppress backend authorization

The persistence owner may be a future server preference or a constrained local
preference. That architecture choice must preserve the behavior above. When no
preference source exists, continue with the only-context or picker steps
instead of blocking authentication.

## Player Profile Completion

`GET /players/me` is the authority for Player completion:

| State | Routing behavior |
| --- | --- |
| `missing` | Enter `/app/onboarding` |
| `incomplete` | Enter `/app/onboarding` |
| `complete` | Enter the authorized Player destination |

The current API completion contract derives missing fields from
`displayName`, `mainSportCode`, and `mainSportLevel`. Post-login routing depends
on the completion state, not a duplicated frontend list of required fields.

Rules:

- query completion only after the selected destination is known to be Player
- do not force Player onboarding before an Organization, Academy, or Admin App
  destination
- retain only a safe, authorized Player continuation through onboarding
- do not put profile values, form drafts, credentials, or provider tokens in
  the continuation URL or auth state
- after onboarding succeeds, invalidate or update Player profile state and
  re-check the continuation before navigating
- if the continuation is no longer authorized, use the normal fallback and
  neutral feedback

Onboarding is a focused flow at `/app/onboarding`; it is not the editable
profile route and is not a sixth Player navigation destination.

## Safe `returnTo`

The structural contract from
`docs/frontend/sandicts-expired-session-experience.md` applies to initial
protected access, expiry recovery, explicit sign-in, and onboarding
continuations.

Accept a destination only when it:

- resolves to the configured Sandicts web origin
- is represented as an internal path beginning with one `/`
- does not begin with `//`
- is not `/sign-in`, an auth callback, a magic-link consumption route, or
  another redirect endpoint
- contains no credentials, Google credential, magic-link token, access token,
  refresh token, or reusable secret
- remains within the implementation length limit after parsing

Use `URL` and `URLSearchParams`; do not validate through string-prefix checks or
concatenation. Normalize before evaluating origin and path. Query strings and
hashes may be retained only after the complete destination passes validation.

### Structurally Invalid

For an external, malformed, auth-loop, callback, secret-bearing, or oversized
value:

- discard the value
- never navigate to or reflect it
- do not reveal validation details
- continue through the normal authorized context fallback

### Structurally Valid But Unauthorized

For an internal route that the current account or context cannot use:

- do not open the route
- do not reveal whether a private entity or resource exists
- continue through last active context, only context, picker, or no-context
- show general feedback such as `Não foi possível abrir o destino solicitado.`
- keep the rejected destination out of the feedback and future URLs

Exact visual composition and localization belong to the sign-in/auth prototype
and localization catalog. The feedback must be persistent enough to explain the
fallback and must not be a technical authorization message.

### Direct Forbidden Access

If a valid authenticated session directly visits a route or receives a
resource-level `403`:

- do not refresh in response to `403`
- do not redirect to sign-in
- do not select another Organization, Academy, Player, or Admin context
- preserve the authenticated shell when the session remains usable
- render forbidden or privacy-safe not-found content with an explicit safe path

This distinction prevents a post-login fallback rule from hiding an actual
authorization failure.

## Provider Handoff

### Google Sign-In And One Tap

Both Google entry points:

1. receive a Google credential
2. exchange it through the same Sandicts auth hook and endpoint
3. hydrate the common in-memory session snapshot
4. refresh the public auth-session query
5. invoke the common post-login resolver

One Tap placement, suppression, browser fallback, and provider lifecycle remain
owned by `docs/frontend/sandicts-google-one-tap-experience.md`.

### Magic Link

Magic-link request does not authenticate and does not run routing.

Successful consumption:

1. extracts the token into transient memory
2. immediately removes the token-bearing URL from browser history through
   replace behavior
3. consumes the token exactly once through the backend contract
4. hydrates the same session snapshot as Google
5. keeps the callback route clean for failure recovery
6. invokes the common post-login resolver
7. replace-navigates from the clean callback route to the authorized result

The token, consumption URL, and raw provider state are never accepted as
`returnTo`.

Exact request, resend, consume, failure, recovery, and token-cleanup UX lives in
`docs/frontend/prototypes/auth-magic-link/README.md`.

## Routing Matrix

| Scenario | Result |
| --- | --- |
| First Player login with missing profile | `/app/onboarding` |
| First login selecting an authorized Organization | Organization home without Player onboarding |
| Returning complete Player with authorized `returnTo` | Resume `returnTo` |
| Returning incomplete Player with authorized Player `returnTo` | Onboarding, then re-check and resume |
| Partner or Admin with authorized operational `returnTo` | Resume operational route |
| No `returnTo`, valid last context | Enter that context home |
| No valid preference and one context | Enter its home |
| No valid preference and multiple contexts | Show context picker |
| No usable contexts | Show no-context state |
| Invalid or external `returnTo` | Discard and use context fallback |
| Internal but unauthorized `returnTo` | Use context fallback with neutral feedback |
| Passive refresh on public discovery | Stay on discovery |
| Passive refresh on protected authorized route | Render the same route |
| Passive refresh on protected forbidden route | Render forbidden; do not switch context |
| Passive refresh on `/sign-in` | Run post-login precedence |
| Google or One Tap success | Common post-login resolver |
| Magic-link consume success | Clean token URL, then common resolver |

## Browser History And Cleanup

- Confirmed expiry uses replace navigation as defined by KAN-81.
- Successful routing away from sign-in or a magic-link consumption route uses
  replace navigation so Back does not reopen an auth recovery or token URL.
- Consume `reason`, invalid-destination feedback, and continuation state when
  their transition completes.
- Do not create a redirect chain between sign-in, onboarding, and the final
  destination.
- Browser Back and Forward remain authoritative for ordinary public and
  authenticated page navigation after the auth transition finishes.

## Authorization And Privacy

- The backend remains authoritative for membership, role, context, and
  resource access.
- Context inventory filters candidate homes but does not replace endpoint
  authorization.
- A slug, last-context preference, route classification, or visible navigation
  item grants no permission.
- Cross-Organization and cross-Academy access must fail without private data
  disclosure.
- An Admin App route requires current internal admin permission.
- Removed access invalidates the corresponding context and any continuation.
- Resource authorization may still return `403` after a route-level context
  check; render the direct forbidden experience in that case.

## Delivery Dependencies And Task Boundaries

Established inputs:

- KAN-65 and KAN-66 own the multi-context and responsive navigation models
- KAN-79 and KAN-80 own the auth contract and session hydration foundation
- KAN-81 owns expiry classification, safe return-route structure, form-draft
  behavior, and direct forbidden UX
- KAN-93 and KAN-97 own the Player profile API and completion contract

Downstream consumers:

| Task | KAN-82 handoff |
| --- | --- |
| KAN-83 | One Tap owns placement and suppression but delegates its successful credential exchange to this resolver |
| KAN-84 | Sign-in and expiry prototypes need the no-context, unauthorized-return feedback, and onboarding transitions |
| KAN-85 | The auth session shell needs trigger classification and a single resolver boundary |
| KAN-86 | Google Sign-In success must hydrate the common session and invoke the resolver |
| KAN-88 | Protected routes need passive hydration, safe handoff, Player gating, and direct-forbidden distinction |
| KAN-90 | The web auth happy-path suite needs the provider-independent routing matrix |
| KAN-104 | The magic-link prototype defines token cleanup, failure states, and the shared success handoff |
| KAN-105 | Magic-link consumption success must clean browser history and invoke the resolver |
| KAN-106 | Magic-link E2E must assert common session creation and post-login routing |

Conflicts to avoid:

- do not weaken or duplicate the KAN-81 structural `returnTo` contract
- do not add provider-specific destination logic to KAN-83, KAN-86, or KAN-105
- do not replace the central route policy introduced for KAN-83 with scattered
  pathname checks
- do not duplicate the KAN-93/KAN-97 Player required-field list in routing code
- do not treat placeholder shell context data as the usable context inventory

Full context fallback is blocked until an API or semantic data source exposes
the current usable Player, Organization, Academy, and Admin App contexts. Last
active restoration additionally needs an approved persistence owner. Those are
implementation dependencies, not reasons to infer authorization from a route
or select the first placeholder context.

## Implementation Handoff

Runtime work remains outside KAN-82. Keep responsibilities separated:

- `src/lib/routes`: structural `returnTo` validation and centralized route
  classification
- `src/lib/auth`: session lifecycle, bootstrap state, and non-visual auth
  signals
- `src/features/auth`: provider-independent destination resolution and sign-in
  orchestration
- semantic context feature/API hook: usable context inventory
- Player feature hook: current profile and completion
- protected layouts: checking, unauthenticated, authenticated,
  verification-failed, expired, and direct forbidden behavior
- onboarding feature: safe continuation after successful completion
- sign-in feature: neutral fallback feedback and provider actions

Do not place routing precedence inside generated OpenAPI modules, provider SDK
callbacks, individual pages, Zustand, or duplicated pathname checks.

Current contract gaps:

- auth responses do not list usable contexts
- no current endpoint or semantic hook provides the full context inventory
- no current contract provides a last-active context preference
- Academy and Admin App shells/routes are not yet implemented

These gaps must be explicit dependencies of the implementation tasks. They do
not permit routing from unverified slugs or placeholder shell data.

## Test And Validation Matrix

### Pure Routing

- every precedence step has a table-driven unit case
- provider identity does not change the selected destination
- context order does not override `returnTo`
- stale last-context values are ignored
- Player completion gates only Player destinations
- onboarding completion re-checks the continuation
- zero, one, and multiple usable-context cases are deterministic

### `returnTo` Security

- external origins are rejected
- protocol-relative and malformed inputs are rejected
- sign-in, callback, redirect, and magic-consume loops are rejected
- secret-bearing and oversized inputs are rejected
- encoded query strings and hashes survive only after full validation
- an internal unauthorized target never appears in feedback

### Session And Providers

- passive public refresh does not navigate
- passive protected refresh unlocks the same authorized route
- authenticated `/sign-in` runs post-login routing
- Google button and One Tap share the same resolver
- magic-link success removes the token URL before routing
- magic-link failure remains on a clean callback URL
- refreshing a cleaned callback without an in-memory token requires a new link
- temporary verification failure does not become a post-login fallback
- confirmed expiry retains only the safe route behavior from KAN-81

### Authorization And Completion

- removed Organization or Academy access invalidates return and last-context
  hints
- missing Admin permission cannot select `/admin`
- direct resource-level `403` stays forbidden in the authenticated shell
- `missing`, `incomplete`, and `complete` Player states follow the documented
  gate
- Organization, Academy, and Admin destinations never force Player onboarding

## Rejected Alternatives

- redirecting every successful passive refresh
- silently favoring Player for every authenticated account
- forcing Player onboarding before operational contexts
- treating last active context as authorization
- routing a multiple-context account to an arbitrary first array item
- silently opening another Organization after authorization fails
- keeping an unauthorized internal destination without user feedback
- reflecting rejected destinations in copy or URLs
- embedding magic-link or provider credentials in `returnTo`
- implementing separate routing rules per authentication provider
- storing routing or auth server state in Zustand

## Acceptance Checklist

- [x] Post-login routing precedence is documented.
- [x] First-time users, returning Players, and partner/Admin users are covered.
- [x] Protected-route return behavior is explicit.
- [x] Passive refresh, Google, One Tap, and magic link use clear trigger rules.
- [x] Player profile completion is scoped to Player destinations.
- [x] Invalid and unauthorized `returnTo` behavior is security-safe.
- [x] Direct forbidden access remains distinct from post-login fallback.
- [x] Context and API dependencies are documented.
- [x] Runtime implementation and provider/backend changes remain out of scope.
