---
title: Sandicts Expired Session Experience
doc-type: frontend-auth-ux-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-expired-session-experience.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-localization.md
  - docs/frontend/sandicts-page-functional-spec.md
  - docs/frontend/prototypes/global-states/README.md
scope: frontend, auth, session, protected-routes, forms, ux, e2e
read-when:
  - implementing or reviewing protected route behavior
  - handling authentication refresh failures
  - adding expired-session, unauthenticated, or forbidden UI
  - deciding whether an auth failure should preserve a return route or form draft
  - deriving auth lifecycle E2E scenarios
do-not-read-when:
  - changing backend token lifetime policy
  - changing provider-specific sign-in behavior without session UX impact
---

# Sandicts Expired Session Experience

## Purpose

Define the MVP user experience when an authenticated session ends, cannot be
refreshed, or no longer authorizes an attempted route.

This decision keeps expired, unauthenticated, forbidden, and temporarily
unverifiable states semantically distinct. It defines product behavior and the
contract expected by protected route and API request implementations; it does
not implement those boundaries or change backend token lifetime policy.

## Decision Summary

- A session is expired only when the browser had an authenticated session and a
  single refresh attempt is definitively rejected.
- Initial bootstrap without a valid session is unauthenticated, not expired.
- A refresh blocked by a network failure, timeout, or `5xx` response is a
  recoverable verification failure, not proof that the session expired.
- Confirmed expiry clears private auth state and replaces the current history
  entry with `/sign-in`, carrying a validated internal `returnTo` and the
  `session-expired` reason.
- The sign-in page uses a persistent inline message. It does not use a toast or
  a dedicated expired-session screen.
- MVP form drafts are not persisted or restored across reauthentication. The
  expired-session message states that unsaved changes were not retained.
- A resource-level `403` with a valid session remains inside the current
  authenticated shell and renders a forbidden state. An auth-level
  `account_auth_forbidden` uses a minimal access boundary instead of expired
  copy. Neither case becomes a silent context switch.
- Authorization is checked again before a post-login `returnTo` is resumed.

## State Classification

| State | Evidence | UX |
| --- | --- | --- |
| `checking` | Browser bootstrap or session verification is pending | Preserve expected layout geometry and show a non-interactive loading state |
| `authenticated` | A current session and access token are available | Render the protected route |
| `unauthenticated` | No in-memory session was established and refresh has no valid session | Use the public or minimal boundary and send gated actions to sign-in |
| `expired` | An established browser session receives `401` and its one refresh attempt is definitively rejected | Clear private auth state and replace-navigate to sign-in with reason and safe `returnTo` |
| `verification-failed` | Refresh or bootstrap cannot complete because of network, timeout, or `5xx` failure | Hide protected content, explain that the session could not be verified, and offer a safe retry |
| `forbidden` | A request returns `403` or an authorization check rejects the account or destination | Preserve the shell only when a valid session remains; otherwise use a minimal access boundary |

The backend remains the authority for authentication and authorization. The
frontend must not infer forbidden access from navigation visibility or treat a
missing navigation item as an access-control boundary.

### Definitive Refresh Rejection

A refresh is definitively rejected as expired when the backend returns `401`
with a stable terminal session/token code such as `invalid_refresh_token`,
`refresh_token_expired`, `refresh_token_reused`, `refresh_token_revoked`, or
`auth_session_inactive`.

An `account_auth_forbidden` response is terminal but semantic forbidden access,
not session expiry. It clears unusable private auth state and renders the
forbidden message in a public or minimal access boundary because no usable
authenticated context remains.

The authenticated request coordinator must attempt at most one shared refresh
for concurrent `401` responses. If refresh succeeds, it retries each eligible
original request once with the new access token. If refresh is definitively
rejected, it emits one expiry transition and must not create redirect or retry
loops.

### Initial Bootstrap

An initial browser bootstrap starts without evidence that this browser runtime
previously held an authenticated session. A rejected refresh at that point is
ordinary unauthenticated access, even if a stale or invalid cookie happened to
be present.

The expired label is reserved for a transition the current runtime can observe:
authenticated to no longer authenticated.

### Temporary Verification Failure

Network errors, timeouts, and `5xx` responses cannot prove whether the backend
session still exists. Protected content remains unavailable until verification
succeeds, but the UI must not claim that the session expired.

Recommended copy:

- title: `Não foi possível verificar sua sessão`
- description: `Confira sua conexão e tente novamente.`
- primary action: `Tentar novamente`
- secondary action when useful: `Ir para o início`

Retry repeats only the session verification. It does not automatically replay a
command whose outcome is unknown.

## Confirmed Expiry Flow

When expiry is confirmed:

1. Stop rendering private route content.
2. Clear the in-memory access token and authenticated session snapshot.
3. Remove private auth-dependent query data while preserving public discovery
   data.
4. Capture the attempted internal location as `returnTo` when it is safe.
5. Replace the current history entry with
   `/sign-in?reason=session-expired&returnTo=<encoded-internal-path>`.
6. Render the sign-in page in its public or minimal shell.
7. Show the approved inline expired-session message.
8. After successful authentication, validate authorization again before using
   `returnTo`.

Use replace navigation for the expiry transition so the browser Back action
does not immediately reopen a private route that no longer has a session.

If the sign-in page is already active, update its state without navigating to a
second sign-in URL. A malformed reason or destination falls back to the normal
sign-in experience.

## Sign-In Feedback

The expired-session notice is part of the sign-in page content and remains
visible until authentication succeeds or the user leaves the page.

Approved MVP copy:

- title: `Sua sessão expirou`
- description: `Entre novamente para continuar. Alterações não salvas não foram mantidas.`
- primary authentication action: `Entrar novamente`
- secondary navigation action when needed: `Ir para o início`

Use an inline `Alert` or equivalent sign-in composition. Do not use:

- a toast, because navigation can make it easy to miss
- a dedicated expired-session route, because sign-in is already the recovery
  destination
- raw backend, token, cookie, or provider terminology
- assertive announcement for a notice already present on initial page render

When expiry appears because of an interaction while the user remains on the
same rendered page momentarily, announce the new failure assertively before
navigation begins. Do not move focus into content that is about to unmount.

## Safe `returnTo` Contract

`returnTo` preserves a destination, never authorization or form values.

Accept a destination only when it:

- resolves to the Sandicts web origin
- is represented as an internal path beginning with one `/`
- does not begin with `//`
- is not `/sign-in`, an authentication callback, or another redirect endpoint
- contains no credentials, access token, refresh token, or reusable secret
- is within a reasonable implementation length limit

Use `URL` and `URLSearchParams` parsing and encoding rather than string
concatenation. Preserve a useful query string and hash only after the complete
destination passes validation.

After authentication:

1. Re-check the destination against the current account and contexts.
2. Resume it only when authorized.
3. Otherwise use the established fallback order: last active authorized
   context, only available context, then context picker.
4. Do not reveal whether a private resource exists.
5. Consume the expiry reason so it does not appear again during later normal
   sign-ins.

A caller-provided external or malformed `returnTo` is discarded and must never
be reflected into a redirect.

## Unsaved Form State

The MVP does not automatically persist form values when a session expires.

Consequences:

- React Hook Form remains the owner while the form is mounted.
- Expiry navigation unmounts the form and discards its current values.
- No form values are added to `returnTo`, query parameters, auth state,
  TanStack Query, Zustand, `localStorage`, or `sessionStorage`.
- The sign-in notice explicitly states that unsaved changes were not retained.
- After sign-in, `returnTo` can reopen the route, but the form starts from its
  normal server-backed or empty defaults.

This is an intentional MVP privacy and complexity tradeoff. A future feature
may restore a specific draft only after it defines an allowlisted schema,
storage lifetime, cleanup, migration, sensitive-field exclusions, and tests.
There is no generic global form-draft persistence mechanism.

For commands:

- a command rejected with `401` before authorization may be retried once after
  a successful refresh by the shared request runtime
- a definitively rejected refresh ends the command and navigates to sign-in
- a command with an unknown outcome after a network failure must not be replayed
  automatically; the owning feature provides the safe recovery path

## Forbidden Experience

Forbidden means the backend recognizes an account or session but rejects access
to the requested context, route, resource, action, or Sandicts authentication
itself.

Rules:

- do not attempt refresh in response to `403`
- do not clear a valid session for a resource-level `403`
- do not redirect to sign-in
- preserve the current authenticated shell and visible active context for a
  resource-level `403`
- replace only the content region with `PageState` when a valid session remains
- for auth-level `account_auth_forbidden`, clear unusable private auth state and
  render the same semantic access explanation in a public or minimal boundary
- do not silently switch organization, Player profile, or another context
- keep permission details general when specifics could disclose private data
- offer a known authorized destination or the context chooser

Recommended copy:

- title: `Você não tem acesso a esta área`
- description: `Use outro contexto ou volte para uma área disponível para sua conta.`
- primary action: `Escolher contexto`
- secondary action: `Voltar ao início`

The consuming feature owns the exact safe destinations and uses the shared
`PageState` composition with a warning or neutral tone. A forbidden response for
a private identifier may use the same neutral not-found treatment when
revealing existence would be sensitive.

## Protected Route Contract

The MVP protected route boundary is client-owned because access tokens live in
browser memory.

It must:

- render `checking` while bootstrap is unresolved
- avoid flashing protected content before authentication is proven
- render the route only for `authenticated`
- direct `unauthenticated` access to sign-in with a safe `returnTo` but without
  the expired-session reason
- handle `expired` through the confirmed expiry flow
- handle `verification-failed` with a recoverable minimal boundary
- render `forbidden` inside the authenticated shell
- coordinate concurrent expiry signals so navigation happens once
- re-check authorization after sign-in before resuming `returnTo`

Public routes remain available when session verification fails unless their
own reads fail. Middleware, hidden links, and the Server Component render are
not the source of current browser session truth for the MVP.

## Edge Cases

- Multiple protected requests return `401`: share one refresh and emit at most
  one redirect.
- Refresh succeeds but the retried request returns `401`: expire without a
  second refresh loop.
- The sign-in page receives `reason=session-expired` directly: show the safe
  notice; the reason grants no privilege.
- `returnTo` targets sign-in or an auth callback: discard it.
- Authorization changes while the user is away: do not resume the now-forbidden
  destination.
- A resource-level `403` follows successful refresh: show forbidden inside the
  authenticated shell.
- Refresh or sign-in returns `account_auth_forbidden`: show forbidden in a
  minimal boundary without expired copy or private navigation.
- The user signs out intentionally: use ordinary signed-out copy, not expired
  copy.
- Another tab signs out or invalidates the session: the next definitive
  authenticated failure follows the same expiry flow; cross-tab synchronization
  is not required by this decision.
- The browser reloads while a form is dirty: normal browser behavior applies;
  this decision does not introduce draft persistence.

## E2E Scenarios

The implementation task can derive at least these scenarios:

1. A visitor opens a protected route and reaches sign-in without an expiry
   notice.
2. A valid session opens the protected route without a private-content flash.
3. An authenticated request receives `401`, refresh succeeds, and the original
   request succeeds after one retry.
4. An authenticated request receives `401`, refresh is definitively rejected,
   and sign-in opens once with the expiry reason and safe `returnTo`.
5. Successful reauthentication resumes an authorized `returnTo`.
6. Successful reauthentication does not resume a destination that is now
   forbidden and uses the authorized fallback order.
7. A valid authenticated request receives resource-level `403`, remains in the
   shell, and shows forbidden actions without attempting refresh.
8. Refresh encounters a network or `5xx` failure and shows recoverable session
   verification copy rather than expired copy.
9. Concurrent `401` responses share one refresh and one expiry navigation.
10. A retried request that returns another `401` does not create a refresh loop.
11. Expiry during a dirty form discards the draft, communicates that outcome,
    and returns only to the route after sign-in.
12. An external, protocol-relative, callback, sign-in, or malformed `returnTo`
    is discarded.
13. Intentional sign-out does not display the expiry notice.
14. Refresh or sign-in returns `account_auth_forbidden` and renders forbidden
    copy in a minimal boundary without an expiry notice.

## Implementation Handoff

Runtime implementation remains outside KAN-81. Follow-up implementation should
keep responsibilities separated:

- `src/lib/api/runtime` classifies refresh as `refreshed`, `rejected`, or
  `temporarily-unavailable` and coordinates one retry
- `src/lib/auth` owns the in-memory session lifecycle and expiry signal
- the protected route boundary owns redirect and shell behavior
- the sign-in feature owns localized notice copy and authentication actions
- each forbidden feature owns safe destinations and composes `PageState`
- React Hook Form remains the owner of mounted form state

The existing boolean refresh outcome is insufficient to distinguish definitive
expiry from temporary verification failure. Its implementation task should
introduce a semantic result without moving auth state into Zustand or generated
API modules.

## Rejected Alternatives

- treating every refresh failure as confirmed expiry
- showing expired-session feedback only as a toast
- creating a dedicated expired-session page
- persisting every form automatically
- encoding form data in `returnTo`
- retrying `403` through refresh
- redirecting forbidden users to sign-in
- silently selecting another authenticated context
- allowing external or unvalidated return destinations

## Acceptance Checklist

- [x] Expired session behavior and copy are documented.
- [x] Unauthenticated, expired, temporarily unverifiable, and forbidden states
  are distinct.
- [x] Redirect, `returnTo`, shell, retry, and protected route behavior are
  defined.
- [x] Unsaved form state has an explicit MVP decision.
- [x] Security and privacy edge cases are documented.
- [x] E2E scenarios can be derived without reopening product decisions.
- [x] Runtime implementation and backend token policy remain out of scope.
