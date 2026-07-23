---
title: Sandicts Local UI State
doc-type: frontend-state-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-local-ui-state.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-frontend-planning.md
  - docs/frontend/sandicts-google-one-tap-experience.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-mvp-visual-system.md
scope: frontend, architecture, react, state, zustand, nextjs
read-when:
  - deciding where frontend state belongs
  - introducing or reviewing a Zustand store
  - implementing UI state shared by multiple Client Components
  - deciding whether local UI state should persist
do-not-read-when:
  - changing backend-only behavior
  - implementing server state already owned by TanStack Query
---

# Sandicts Local UI State

## Purpose

Define how Sandicts chooses an owner for frontend state and the narrow boundary
where Zustand is allowed.

This document prevents local UI state, server state, form state, authentication,
and URL state from becoming duplicated sources of truth.

## Decision Summary

- Keep state in the smallest owner that can coordinate the required UI.
- Use React state before introducing a shared state library.
- Use the URL for state that users should be able to share, bookmark, or restore
  through browser navigation.
- Use React Hook Form for form values, validation, and submission state.
- Use TanStack Query and API hooks for server state.
- Keep authentication credentials and session bootstrap behavior in
  `src/lib/auth`; do not move them to Zustand.
- Use Zustand only for concrete client-side UI state that must be coordinated
  across components with a shared lifecycle.
- Do not install Zustand or create an example store before a real consumer
  exists.

## Dependency Adoption Decision

The initial state-boundary foundation does not introduce the `zustand`
dependency or an example store.

The current application has no concrete cross-component UI behavior that needs
a Zustand store. Creating one now would establish an abstraction without an
owner, lifecycle, or observable product behavior.

The first qualifying app-shell, navigation, overlay, or multi-step UI task may
add Zustand and its first store. That implementation must follow this document
and include the real consumer and tests in the same delivery.

This is the intended completion of the state-boundary foundation, not missing
configuration.

## State Ownership Matrix

| State kind | Default owner | Examples |
| --- | --- | --- |
| Component-only UI | React `useState` or `useReducer` | disclosure, hover detail, one dialog trigger |
| UI shared by nearby components | Closest common React parent | controlled tabs, sibling selection |
| Shareable navigation state | Next.js route or search parameters | filters, active public tab, pagination |
| Form state | React Hook Form | values, validation errors, dirty and submit state |
| Server state | TanStack Query and API hooks | profiles, courts, reservations, payments |
| Authentication runtime | `src/lib/auth` and the auth session query | access token, refresh bootstrap, current account |
| Cross-component local UI | Scoped Zustand store | shell navigation, coordinated overlays |

Context may pass stable dependencies or expose a scoped Zustand store. It
should not become a second unstructured application-wide state container.

## Zustand Entry Criteria

Create a Zustand store only when all of these conditions are true:

1. A concrete product behavior already needs the state.
2. The state is client-side UI state rather than server, form, URL, or
   authentication state.
3. Multiple components need to read or update the same state.
4. The components cannot be coordinated clearly by their closest common owner
   without excessive prop threading or an incorrectly broad component.
5. The state has one identifiable lifecycle and provider boundary.
6. The delivery includes the consumer and proportionate tests.

If any condition is false, keep the state in its existing narrower owner.

## Allowed Zustand State

Qualifying examples include:

- desktop sidebar or mobile navigation state shared by an app shell
- coordinated overlays that can be opened and closed by distant UI controls
- an active app-area switcher that is not route state
- a temporary multi-step UI draft that spans components but is not a persisted
  API resource or React Hook Form flow

An example is not automatically a reason to create a store. The real screen
must still satisfy the entry criteria.

## State That Must Stay Out Of Zustand

Do not store:

- API responses, records, collections, pagination, or loading status
- copies of TanStack Query data
- access tokens, refresh tokens, cookies, or authenticated account snapshots
- form values or validation errors already owned by React Hook Form
- route, filter, tab, or pagination state that should survive in the URL
- values that can be derived from props, query data, URL state, or other store
  fields
- server persistence queues or offline synchronization behavior

Zustand actions must not fetch or mutate Sandicts API resources. Feature hooks
and TanStack Query mutations own that work.

## Next.js Store Lifetime

Sandicts uses the Next.js App Router and Server Components by default.

Rules:

- Zustand stores are consumed only by Client Components.
- Server Components must not read from or write to a Zustand store.
- Do not export a module-level singleton store that can be shared across server
  requests.
- Create a vanilla Zustand store through a factory and expose it through a
  Client Component provider.
- Create the store once per mounted provider instance.
- Mount the provider at the narrowest layout or feature boundary that owns the
  state, not automatically at the application root.
- Keep initial state deterministic between server output and client hydration.
- Do not read `window`, browser storage, or device-only values while creating
  the initial store.
- Pass a server-resolved initial UI value through serializable provider props
  only when the UI behavior requires it; do not use this path to mirror server
  resources.
- Reset state by ending the provider lifecycle or through an explicit semantic
  reset action when the product flow requires it.

Provider scope defines ownership. Public, player, and Organization shells may
use separate store instances even when they use the same store factory.

## File And Naming Structure

Create one folder per cohesive UI concern:

```text
src/lib/ui-state/navigation/
├── navigation-store.ts
├── navigation-store-provider.tsx
├── navigation-store.types.ts
└── navigation-store.test.ts
```

Use:

- `createNavigationStore` for the vanilla store factory
- `NavigationStoreProvider` for the scoped provider
- `useNavigationStore(selector)` for the typed consumer hook
- semantic actions such as `openNavigation`, `closeNavigation`,
  `toggleNavigation`, and `resetNavigation`

Do not create one global application store or split a store into slices before
real complexity justifies that structure.

## State Shape And Actions

- Store only the minimum state needed to describe the UI.
- Keep related values together when they change as one transition.
- Avoid contradictory boolean combinations and impossible states.
- Prefer a discriminated status when one UI can be in mutually exclusive
  states.
- Store identifiers instead of duplicated objects.
- Calculate derived values in selectors or consuming code.
- Keep the state shape flat unless nesting communicates a real atomic unit.
- Expose semantic actions rather than the store's raw setter.
- Use functional updates when the next value depends on the previous value.
- Keep actions synchronous and limited to the store's UI responsibility.
- Include a reset action when the state can outlive a route, account context,
  test, or workflow.

## Selectors And Rendering

Every component must subscribe through a selector:

```ts
const isNavigationOpen = useNavigationStore(
  (state) => state.isNavigationOpen,
);
```

Rules:

- Do not subscribe a component to the complete store.
- Prefer selectors that return primitives or stable references.
- Use multiple focused selectors when that keeps component dependencies clear.
- Use `useShallow` only when a selector intentionally returns a computed object
  or array whose members can be compared shallowly.
- Do not introduce generated selectors until repeated stores prove that the
  extra abstraction improves the codebase.

These rules keep rerenders tied to the state each component actually consumes.

## Persistence

Persistence is disabled by default.

Persist local UI state only when the product explicitly requires the preference
to survive a reload, such as a confirmed shell display preference.

When persistence is approved:

- persist only the allowlisted fields with `partialize`
- use a stable, namespaced storage key
- add a schema version and migration strategy before the stored shape changes
- choose `localStorage` or `sessionStorage` according to the required lifetime
- define hydration behavior explicitly and prevent server/client output
  mismatches
- test first load, restored state, migration, invalid data, and reset behavior

Never persist authentication data, API resources, personal data, payment data,
or transient overlay state through Zustand.

### Google One Tap Exception

The approved One Tap behavior requires two narrow browser-storage records:

- a versioned `sessionStorage` attempt marker for the current tab
- a versioned `localStorage` suppression record containing only a reason
  category and expiry timestamp for 24 hours

These records are provider-prompt preferences, not authentication state, and do
not use Zustand. They must never contain a credential, token, account data,
route, query, `returnTo`, intended action, raw provider notification, or backend
error. Their schema, keys, reset behavior, and invalid-data handling live in
`docs/frontend/sandicts-google-one-tap-experience.md`.

## Testing Requirements

The first store and every store with meaningful transitions must include:

- unit tests created from a fresh store factory for each test
- initial-state tests
- semantic action and transition tests
- reset behavior when a reset action exists
- tests for invalid or idempotent transitions where relevant
- provider isolation tests when multiple instances may be mounted
- component tests that assert observable behavior through accessible UI

Avoid tests that depend on execution order, reuse a singleton store, or assert
implementation details without user-visible or state-transition value.

## Adoption Workflow

When a feature appears to need Zustand:

1. Identify the exact state and its single source of truth.
2. Classify it with the state ownership matrix.
3. Confirm every Zustand entry criterion.
4. Define the smallest provider lifecycle.
5. Add `zustand` only with the first qualifying implementation.
6. Add one cohesive store, its real consumer, and tests.
7. Document any approved persistence or lifecycle exception.
8. Run the repository quality and test gates.

## Review Checklist

- Does a concrete cross-component UI consumer exist?
- Is Zustand the narrowest valid owner?
- Is the state free of API, auth, form, and shareable URL data?
- Is there only one source of truth?
- Is the provider mounted at the smallest correct boundary?
- Are Server Components isolated from the store?
- Are initial state and hydration deterministic?
- Does every component use a focused selector?
- Are derived values calculated rather than duplicated?
- Are actions semantic and limited to UI transitions?
- Is persistence absent unless explicitly required and safely scoped?
- Do tests create isolated store instances?

## Primary References

- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Zustand: Setup with Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs)
- [Zustand: Prevent rerenders with useShallow](https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow)
- [Zustand: Persist middleware](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
