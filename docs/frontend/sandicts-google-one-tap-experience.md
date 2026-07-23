---
title: Sandicts Google One Tap Experience
doc-type: frontend-auth-ux-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-google-one-tap-experience.md
related:
  - docs/frontend/sandicts-expired-session-experience.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-local-ui-state.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-page-functional-spec.md
  - src/lib/routes/route-access-policy.ts
scope: frontend, auth, google-one-tap, public-routes, protected-routes, privacy, ux, e2e
read-when:
  - implementing or reviewing Google One Tap
  - changing which routes are public or protected
  - changing which public routes may prompt for sign-in
  - handling Google prompt dismissal, cancellation, failure, or suppression
  - prototyping sign-in fallback behavior
do-not-read-when:
  - changing backend Google token verification
  - adding another identity provider
  - changing the approved expired-session classification
---

# Sandicts Google One Tap Experience

## Purpose

Define where and how Google One Tap may appear in the MVP web app without
interrupting protected flows or repeatedly prompting a visitor during public
browsing.

This decision separates three concerns that must not be inferred from each
other:

- route access: public, protected, or not yet classified
- Google One Tap eligibility: eligible or ineligible
- search indexing: indexable or non-indexable

A public route is not automatically eligible for One Tap or search indexing.
The route policy is explicit so a future public detail page can be introduced
without spreading pathname checks through components.

## Decision Summary

- Google One Tap is eligible on exactly `/`, `/discovery`, and `/sign-in` for
  the MVP.
- Only the first eligible route visited in a browser tab may attempt the prompt.
- Public detail pages and public-home descendants are ineligible until product
  explicitly adds them to the route policy.
- Protected layouts never initialize or render One Tap.
- An unauthenticated or expired protected flow reaches `/sign-in` through the
  approved auth boundary before One Tap can be considered.
- The explicit Google Sign-In button remains available on `/sign-in`
  independently of One Tap.
- Desktop Chromium/Edge and Android Chromium top-level browsers receive One Tap.
  iOS, Safari/ITP, Firefox, and embedded webviews use the explicit fallback.
- A skipped prompt, application cancellation, or failed credential exchange
  suppresses automatic One Tap for 24 hours.
- Provider/script unavailability suppresses retry only for the current tab.
- A successful Google sign-in through either entry point clears local
  suppression.
- FedCM is enabled, automatic sign-in is disabled, and the GIS script is loaded
  only after the route is eligible and the browser session is known to be
  unauthenticated.

## Route Policy

`src/lib/routes/route-access-policy.ts` is the machine-readable frontend
registry for route access and One Tap eligibility.

The registry uses ordered, segment-aware patterns, and the first matching policy
wins. Exact policies must be placed before broader subtrees. A dynamic segment
such as `:organizationSlug` matches one non-empty path segment.

The MVP policy is:

| Policy | Pattern | Match | Access | Google One Tap |
| --- | --- | --- | --- | --- |
| `public-home` | `/` | exact | public | eligible |
| `public-discovery-home` | `/discovery` | exact | public | eligible |
| `public-sign-in` | `/sign-in` | exact | public | eligible |
| `player-legacy-redirect` | `/player` | exact | protected | ineligible |
| `player-app` | `/app` | subtree | protected | ineligible |
| `organization-app` | `/organizations/:organizationSlug` | subtree | protected | ineligible |

An unmatched pathname resolves to `unknown` and is One Tap ineligible. Unknown
does not grant public access. A route implementation must classify the new
surface before auth promotion or future route boundaries consume it.

### Adding A Future Public Detail Page

To make a detail page public later:

1. Add its canonical route builder or pattern to `src/lib/routes/app-routes.ts`.
2. Add an exact public policy to
   `src/lib/routes/route-access-policy.ts`.
3. Keep One Tap `ineligible` unless product separately approves the detail page
   as a prompt surface.
4. Place an exact public entity policy before an existing protected subtree
   when both share a namespace.
5. Add route-policy tests for the public root, protected descendants, query
   strings, and unknown siblings.
6. Decide search indexing separately in `src/lib/seo`; public access alone must
   not add a route to the sitemap.
7. Update the public page inventory and navigation documentation.

For example, a future public `/organizations/:organizationSlug` page can use an
exact public policy while operational descendants remain protected. The public
page implementation and authorization of operational descendants still belong
to their owning tasks.

## Eligibility Gate

One Tap can initialize only when every condition is true:

- the route policy marks the normalized pathname as `eligible`
- auth bootstrap has completed
- no usable authenticated session exists
- the current tab has not attempted One Tap
- no unexpired 24-hour Sandicts suppression record exists
- the browser is an approved top-level platform
- Google Identity Services configuration is present
- privacy/compliance prerequisites for the environment are satisfied

While auth is `checking`, the app must not load or display the prompt. This
prevents an authenticated visitor from seeing a sign-in flash before session
hydration completes.

When auth becomes authenticated while a prompt is active, the integration
cancels the prompt and does not retry it.

## Route And Context Matrix

| Route or context | One Tap behavior | Fallback |
| --- | --- | --- |
| `/` | Attempt once if the eligibility gate passes | Public navigation remains usable; sign-in CTA goes to `/sign-in` |
| `/discovery` | Attempt once if the eligibility gate passes | Discovery remains usable; gated actions go to `/sign-in` |
| `/sign-in` | Attempt once if no prior eligible route attempted in the tab | Official Google Sign-In button remains visible |
| `/sign-in?returnTo=...` | Same policy as `/sign-in`; the query does not create another attempt | Button uses the same safe post-login routing contract |
| `/sign-in?reason=session-expired...` | Eligible after the approved inline expiry notice mounts | Expiry notice remains persistent; explicit reauthentication remains available |
| Public detail route | Ineligible until separately approved | Public browsing and normal sign-in CTA |
| Auth callback or magic-link verification | Ineligible | Continue the active auth flow without competing prompts |
| Protected route in `checking` | Ineligible | Render the approved non-interactive checking state |
| Protected route in `unauthenticated` | Never prompt inside the boundary | Navigate to `/sign-in` with safe `returnTo` |
| Protected route in `expired` | Never prompt inside the boundary | Follow the confirmed KAN-81 expiry flow |
| Protected `verification-failed` | Ineligible | Retry session verification without claiming expiry |
| Resource-level `forbidden` | Ineligible | Preserve the authenticated shell and render forbidden UX |
| Auth-level `account_auth_forbidden` | Ineligible | Use the approved minimal forbidden boundary |
| Any route with an authenticated session | Ineligible | Keep or restore authenticated navigation |

One Tap is an enhancement, never a navigation or access-control boundary.
Failure to display it must not block public content or protected-route recovery.

## Public Navigation

The app attempts One Tap at most once per browser tab.

Examples:

- If `/` attempts One Tap, navigation to `/discovery` and `/sign-in` in the same
  tab does not prompt again.
- If a visitor opens `/discovery` directly, that page owns the tab attempt.
- If the first route is ineligible, the first later eligible route may attempt.
- Reloading the same tab does not reset the attempt.
- A new tab has an independent attempt, subject to the shared 24-hour
  suppression record and Google/browser cooldown.

The prompt must not replace, delay, or cover a required public action. Public
pages remain fully usable after dismissal, provider unavailability, or failure.

## Protected Routes

Protected route groups do not load the GIS prompt and do not embed provider UI.

They keep the KAN-81 contract unchanged:

- `unauthenticated` navigates to `/sign-in` with a validated internal
  `returnTo`
- `expired` uses the approved reason, inline notice, and replace navigation
- `verification-failed` offers session verification retry
- a resource-level `forbidden` remains inside the authenticated shell
- `account_auth_forbidden` uses a minimal access boundary

After navigation reaches `/sign-in`, that public route evaluates One Tap using
the normal once-per-tab and suppression rules. Authentication success delegates
to the post-login routing decision; One Tap does not choose a destination.

## Platform Policy

### One Tap Enabled

- latest supported desktop Chrome and Edge versions
- latest supported Chromium browser on Android
- top-level browsing contexts only
- FedCM where the browser supports it

### Explicit Fallback Only

- iOS browsers
- Safari, including ITP-restricted contexts
- Firefox
- unsupported or outdated browsers
- browsers where third-party sign-in is disabled

### Unsupported Embedded Context

Android and iOS webviews are not supported sign-in surfaces for the MVP. The UX
should direct the user to a supported system browser rather than repeatedly
retrying One Tap.

The explicit button implementation must validate its own iOS redirect
requirements. That behavior belongs to the Google Sign-In integration task and
must not be simulated by One Tap.

Official constraints:

- https://developers.google.com/identity/gsi/web/guides/supported-browsers
- https://developers.google.com/identity/gsi/web/guides/fedcm-migration

## Prompt And Fallback States

| State | Meaning | Required behavior |
| --- | --- | --- |
| `idle` | Eligibility not evaluated | Render no provider prompt |
| `checking-auth` | Browser session bootstrap is pending | Preserve page geometry and wait |
| `loading-provider` | Eligible route is loading GIS | Do not block public content |
| `prompted` | GIS was asked to display One Tap | Mark the tab attempt before invoking the prompt |
| `skipped` | Prompt ended without a credential | Write 24-hour suppression and leave the page usable |
| `cancelled` | The application cancelled the prompt | Write 24-hour suppression unless cancellation follows successful auth cleanup |
| `credential-received` | Google returned a credential | Cancel competing UI and exchange it through the existing auth hook |
| `signing-in` | Sandicts session creation is pending | Prevent duplicate exchanges |
| `failed` | Credential exchange failed | Show safe auth feedback and write 24-hour automatic-prompt suppression |
| `suppressed` | A tab or durable rule prevents prompting | Do not initialize One Tap; keep explicit fallback |
| `unsupported` | Platform, privacy setting, or provider cannot support the prompt | Use explicit Google Sign-In or supported-browser guidance |
| `succeeded` | Sandicts session was created | Clear suppression, hydrate auth state, and use post-login routing |

FedCM does not provide reliable display-moment or detailed skipped-reason
signals for every browser. The integration must not require
`isNotDisplayed()`, `getNotDisplayedReason()`, or `getSkippedReason()` to make a
user-visible fallback available.

## Suppression And Persistence

Two independent records are required:

### Per-Tab Attempt

- storage: `sessionStorage`
- key: `sandicts.auth.google-one-tap.attempt.v1`
- lifetime: current browser tab
- value: schema version and attempt timestamp only
- written before invoking the prompt to prevent remount or navigation races

### Durable Automatic-Prompt Suppression

- storage: `localStorage`
- key: `sandicts.auth.google-one-tap.suppression.v1`
- lifetime: 24 hours from the triggering event
- allowlisted fields:
  - `version`
  - `reasonCategory`
  - `suppressedUntil`
- allowed reason categories:
  - `prompt-skipped`
  - `application-cancelled`
  - `credential-exchange-failed`

Do not persist:

- Google credential or token
- Sandicts access or refresh token
- account ID, email, display name, or provider subject
- pathname, query string, hash, `returnTo`, or intended action
- raw Google notification or backend error payload

An invalid, unknown-version, or expired record is discarded. Successful Google
authentication through One Tap or the explicit button clears both Sandicts
records.

Provider/script loading failure records only the per-tab attempt. A later tab
may try again because an infrastructure failure is not evidence of user
dismissal.

If browser storage is unavailable, use an in-memory attempt guard for the
current mount and keep the explicit fallback. Do not fail the page or move these
records into the auth session store, TanStack Query, or Zustand.

Google and browser cooldowns remain authoritative and may suppress the prompt
longer than the Sandicts 24-hour record.

## Explicit Google Sign-In Fallback

The official Google Sign-In button is always rendered on `/sign-in` once its
provider state is available.

Rules:

- public home pages keep the normal Sandicts sign-in CTA rather than embedding a
  Google button
- the button remains usable when One Tap is suppressed or skipped
- prompt status callbacks do not control whether the button exists
- button and One Tap credentials use the same frontend auth hook and backend
  endpoint
- success through either flow clears One Tap suppression
- failure copy remains provider-safe and exposes no token or Google internals
- unsupported embedded browsers receive supported-browser guidance

Visual layout, exact fallback copy, loading treatment, and button states belong
to KAN-84 and the explicit Google Sign-In implementation task.

## Privacy, Consent, And Security

MVP configuration:

- enable FedCM for One Tap
- disable automatic sign-in and `auto_select`
- load `https://accounts.google.com/gsi/client` only after the eligibility gate
  passes
- load GIS from Google; do not self-host the script
- require HTTPS outside supported localhost development
- configure each environment's authorized JavaScript origin
- keep the Google client ID in validated public environment configuration
- verify every returned credential on the backend
- never decode a credential to establish frontend trust
- never log or persist credentials
- request no Google Calendar or other authorization scopes during sign-in
- keep app name, homepage, privacy policy, support contact, and optional terms
  accurate in Google OAuth branding

If the applicable consent policy does not classify the identity script as
functional authentication, the integration must gate loading behind the
approved consent mechanism. In that configuration One Tap remains disabled
until consent exists, while the explicit sign-in path follows its approved
interaction policy.

CSP may need `script-src`, `connect-src`, `frame-src`, and `style-src` entries
for Google Identity Services. Non-FedCM popup fallback may also need
`Cross-Origin-Opener-Policy: same-origin-allow-popups`. These headers must be
validated in local, preview, and production environments.

Official setup and policy references:

- https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance

## KAN-84 Ownership Boundary

KAN-83 owns:

- eligible route and state rules
- once-per-tab behavior
- suppression triggers and duration
- explicit fallback availability
- platform and privacy constraints
- the machine-readable route policy

KAN-84 owns:

- sign-in composition and responsive layout
- exact non-expired copy for loading, cancellation, failure, and unavailable
  states
- visual relationship between prompt guidance and explicit button
- supported-browser guidance presentation
- accessibility and focus behavior in the prototype

KAN-84 must preserve the expired-session copy and flow already approved by
KAN-81. It must not add a route to One Tap eligibility or change suppression
duration through a prototype-only decision.

## Implementation Handoff

Runtime implementation remains in the dedicated frontend tasks.

Suggested ownership:

- `src/lib/routes/route-access-policy.ts`: route access and One Tap eligibility
- `src/features/auth`: GIS adapter, prompt lifecycle, suppression storage, and
  credential handoff
- `src/features/auth/hooks/use-google-sign-in.ts`: shared Sandicts credential
  exchange and session mutation behavior
- sign-in feature: explicit button and user-visible auth states
- auth session boundary: authenticated, unauthenticated, expired,
  verification-failed, and forbidden transitions
- `src/lib/env`: typed Google client ID and feature-disable configuration
- `next.config.ts` or deployment headers: CSP and COOP

Do not place pathname checks directly in page components, public-shell
navigation, provider callbacks, or protected layouts. Consumers resolve the
central route policy.

## Test And Validation Matrix

### Route Policy

- `/`, `/discovery`, and `/sign-in` are public and One Tap eligible
- query strings, hashes, and trailing slashes resolve to the same route policy
- `/discovery/*` and planned public detail pages remain unknown and ineligible
- `/app/*`, `/player`, and current Organization routes are protected and
  ineligible
- unknown routes fail closed for One Tap
- a future exact public entity rule can precede a protected subtree rule

### Prompt Lifecycle

- the first eligible route attempts once per tab
- later eligible navigation in the same tab does not prompt
- an ineligible first route does not consume the tab attempt
- authenticated and checking states do not prompt
- success clears local suppression
- skip, cancellation, and credential-exchange failure suppress for 24 hours
- malformed, expired, and unknown-version storage records are discarded
- unavailable storage degrades without blocking the page

### Browser And Privacy

- desktop Chromium/Edge and Android Chromium exercise the One Tap path
- iOS, Safari/ITP, Firefox, and webviews exercise fallback behavior
- disabled third-party sign-in and blocked provider script leave a usable page
- CSP and COOP allow approved provider flows
- no credential, personal data, route, or backend error payload reaches storage
  or logs

### Auth Integration

- One Tap and explicit button use the same backend credential exchange
- successful sign-in hydrates the approved in-memory session snapshot
- safe `returnTo` and KAN-81 expiry behavior remain unchanged
- protected routes never flash provider UI or protected content
- `account_auth_forbidden` remains forbidden rather than expired

## Rejected Alternatives

- enabling One Tap on every public route
- enabling public detail pages implicitly from a broad prefix
- re-prompting after each public navigation
- mounting provider UI inside protected layouts
- showing the explicit button only after a prompt callback
- relying only on detailed Google skip reasons
- persisting credentials, account data, routes, or auth state with suppression
- treating public access, One Tap eligibility, and SEO indexing as one flag
- defaulting an unknown route to public or One Tap eligible
- enabling automatic sign-in for the MVP

## Acceptance Checklist

- [x] Eligible routes and route contexts are explicit.
- [x] Public navigation attempts at most once per tab.
- [x] Protected and approved expired-session flows remain unchanged.
- [x] Mobile, desktop, ITP, and webview behavior is documented.
- [x] Dismissal, cancellation, failure, duration, and storage are defined.
- [x] The explicit Google Sign-In fallback is always available on `/sign-in`.
- [x] Privacy, consent, browser, CSP, COOP, and OAuth constraints are recorded.
- [x] Route access and One Tap eligibility have a centralized tested policy.
- [x] KAN-84 and runtime implementation ownership boundaries are explicit.
