---
title: Sandicts Mobile Navigation
doc-type: frontend-ux-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-mobile-navigation.md
related:
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-frontend-planning.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - docs/frontend/sandicts-mvp-visual-system.md
  - docs/frontend/sandicts-post-login-routing.md
  - docs/frontend/sandicts-google-one-tap-experience.md
  - docs/frontend/prototypes/app-shells/README.md
  - docs/frontend/sandicts-page-functional-spec.md
  - docs/frontend/sandicts-local-ui-state.md
scope: frontend, ux, navigation, mobile, responsive, accessibility, mvp
read-when:
  - designing or implementing a Sandicts app shell
  - deciding mobile, tablet, or desktop navigation behavior
  - implementing the authenticated context switcher
  - reviewing route selection, navigation permissions, or responsive behavior
do-not-read-when:
  - changing backend-only behavior
  - implementing page content with no shell or navigation impact
---

# Sandicts Mobile Navigation

## Purpose

Define the responsive navigation model for the Sandicts public, Player,
Organization, Academy, and Admin App areas.

This document owns navigation presentation, hierarchy, context switching, route
selection, responsive behavior, and navigation accessibility. Page behavior and
route inventory remain in `docs/frontend/sandicts-page-functional-spec.md`.

## Decision Summary

- Use one adaptive navigation system rather than forcing one mobile component
  across every Sandicts area.
- Keep public navigation in a compact header.
- Use a persistent bottom navigation bar for the five primary Player
  destinations on compact viewports.
- Use a menu button and navigation sheet or drawer for the larger Organization
  hierarchy on compact viewports.
- Reserve the Organization operational pattern for Academy when its V2 shell is
  implemented.
- Use a navigation sheet or drawer for the Admin App on compact viewports.
- Adapt authenticated navigation to a rail at medium widths and a persistent
  labeled sidebar at expanded widths.
- Keep the context switcher separate from navigation inside the active context.
- Use the URL as the source of truth for the active destination.
- Keep actions, filters, and in-page tabs out of primary navigation.
- Do not introduce Zustand for route selection or for a single navigation
  trigger.

The older `partner` wording means operational Organization and Academy
contexts. New documentation and implementation must use the current domain
names.

## Navigation Layers

Sandicts has four distinct navigation layers:

1. **Global and account navigation**: public home, sign-in, account menu, and
   the authenticated context switcher.
2. **Primary context navigation**: the stable top-level destinations inside
   Player, Organization, Academy, or Admin App.
3. **Secondary navigation**: sibling sections inside one primary destination,
   such as settings sections or local tabs.
4. **Contextual actions**: create, edit, filter, reserve, join, pay, or submit
   actions related to the current page.

Do not promote an action into primary navigation. For example, `Create open
match` is an action inside Matches, not a Player navigation destination.

Do not use tab semantics for links that change routes between top-level product
areas. Route navigation uses links inside a `nav` landmark; tabs are reserved
for switching panels within the same page context.

## Responsive Modes

Use content-driven responsive modes with the current Tailwind breakpoints as
initial implementation tokens:

| Mode | Initial width | Navigation presentation |
| --- | --- | --- |
| Compact | below `48rem` | public header, Player bottom bar, operational navigation sheet |
| Medium | `48rem` to below `64rem` | public header, authenticated navigation rail |
| Expanded | `64rem` and above | public horizontal header, authenticated labeled sidebar |

KAN-68 may adjust a breakpoint when a shell prototype proves that content,
zoom, localization, or input constraints require it. A breakpoint change must
be recorded here before KAN-77 implements it.

Rules:

- use CSS viewport behavior, not device or user-agent detection
- support portrait and landscape layouts
- preserve navigation meaning when its presentation changes
- keep destination order consistent between bottom bar, rail, sidebar, and
  navigation sheet
- do not render desktop and mobile navigation as simultaneously focusable
  duplicate controls
- test narrow mobile widths from `320px`

## Public Navigation

Compact public pages use a header rather than a bottom navigation bar.

The header provides:

- Sandicts brand link to `/`
- the current public page title when orientation would otherwise be unclear
- access to discovery through `/discovery`
- sign-in when unauthenticated
- account or context access when authenticated

Public discovery filters, search controls, and view switches remain inside the
page. They are not global navigation.

Public detail pages keep browser back behavior and direct URLs. They must not
depend on a hidden client-side navigation stack.

Reason:

- the public MVP has too few stable peer destinations to justify a bottom bar
- public pages should preserve space for discovery and detail content
- sign-in and account controls are global actions, not peer content sections

## Player Navigation

Compact Player pages use a persistent bottom navigation bar with these
destinations and order:

| Label | Destination | Active for |
| --- | --- | --- |
| Início | `/app` | the Player home route only |
| Explorar | `/app/courts` | court discovery and court detail routes |
| Reservas | `/app/reservations` | reservation list, detail, and change-request routes |
| Partidas | `/app/open-matches` | open-match list, detail, and creation routes |
| Perfil | `/app/profile` | Player profile routes |

Rules:

- use a visible short label and a Phosphor icon for every destination
- keep all five destinations in the same order across regular Player pages
- derive the active destination from the current route
- use the most specific matching route group so only one destination is current
- keep a destination visible when its content is empty, unavailable, or needs
  onboarding; render the appropriate state inside the destination
- keep the bottom bar visible on regular list and detail pages
- treat hiding the bar for a future focused full-screen flow as an exception
  that requires an approved prototype and an explicit back or cancel path
- do not put create, filter, join, reserve, or edit actions in the bottom bar
- do not add V2 classes to the bottom bar until V2 navigation is planned

`/app/onboarding` is a focused account-completion route. It is not a sixth
destination. `missing` or `incomplete` Player completion enters it before
regular Player navigation renders. Completion may continue only to a
re-checked safe authorized Player destination.

## Organization Navigation

Organization work has more than five primary and secondary destinations and a
deeper operational hierarchy. Compact Organization pages therefore use:

- a top app bar with a clearly labeled menu button
- the current page title
- the current Organization context control when context switching is available
- a navigation sheet or drawer containing all authorized Organization
  destinations

The compact Organization navigation groups destinations in this order:

1. **Overview**
   - Painel
   - Agenda
   - Reservas
2. **Operation**
   - Unidades when enabled
   - Quadras
   - Disponibilidade
   - Pagamentos
3. **Management**
   - Perfil da organização
   - Membros and settings when enabled

Rules:

- show only destinations the authenticated membership can access
- keep group and destination order stable for the same permission set
- display the current destination inside the navigation sheet
- close the sheet after route navigation
- restore focus to the menu trigger when the sheet closes without navigation
- keep daily shortcuts on the dashboard as page actions rather than duplicating
  them into a second persistent navigation system
- use a rail at medium widths and a persistent labeled sidebar at expanded
  widths

The public Organization page and the authenticated Organization shell can share
an entity slug, but they must not share an ambiguous navigation presentation.
Authentication and route authorization determine whether operational
navigation is available.

## Academy Navigation

Academy management is V2. Reserve the Organization adaptive pattern:

- compact navigation sheet or drawer
- medium navigation rail
- expanded labeled sidebar
- separate Academy context in the context switcher

Likely Academy groups include overview, calendar, classes, coaches, students,
plans, and payments. KAN-66 does not promote these routes into the MVP or freeze
their final Portuguese labels.

Do not add Academy navigation to the MVP shell before an approved V2 prototype.

## Admin App Navigation

The Admin App has a broad internal hierarchy and does not use a compact bottom
bar.

When an Admin App page is included:

- compact viewports use a navigation sheet or drawer
- medium viewports use a navigation rail when the destinations remain clear
- expanded viewports use a persistent labeled sidebar
- only users with internal admin permission see the Admin App context or links

The absence of a complete Admin App UI in the MVP does not permit a
desktop-only or inaccessible fallback. Any shipped internal page must remain
usable at compact widths.

## Context Switcher

Context switching changes the active product area or operational entity. It is
not a Player bottom-navigation destination and is not mixed into an
Organization navigation group.

Availability:

- hide the switcher when only one usable context exists
- show it in the authenticated top app bar when multiple contexts exist
- keep account settings and sign-out in the account menu, not in the context
  list

Compact presentation:

- open a modal bottom sheet or equivalent dialog titled `Trocar contexto`
- identify the current context in text and visually
- group entries as Player, Organizations, Academies, and Admin App
- identify each Organization and Academy by display name
- keep the list scrollable without making the dialog header or close control
  unreachable
- place create Organization or create Academy actions after the context list
  when those actions are allowed
- close the sheet and navigate to the selected context home
- restore focus to the trigger when dismissed without changing context

Medium and expanded presentation may use an anchored popover or menu when it
can expose the same grouping, names, status, and keyboard behavior.

The context switcher does not restore an arbitrary nested page when the user
actively changes context. It navigates to the selected context home. Login
bootstrap may restore a safe authorized `returnTo`; otherwise it uses the last
active usable context, the only usable context, or the picker in that order.

## Routing And Browser History

The URL is the source of truth for navigation.

Rules:

- render navigation destinations as real links
- derive the selected destination from the pathname
- support direct entry, refresh, back, forward, open in new tab, and copied URLs
- keep search and filter state in search parameters when it should be
  shareable
- never keep a second selected-destination value in React state or Zustand
- do not intercept modified clicks that should open a new tab or window
- preserve `returnTo` when an unauthenticated user enters an auth-gated route
- after successful authentication, restore `returnTo` only when authorization
  still allows it
- discard malformed, external, auth-loop, callback, secret-bearing, and
  oversized `returnTo` values before resolving a destination
- when a structurally safe internal `returnTo` is unauthorized, use the normal
  authorized context fallback and show neutral feedback without naming the
  target
- route guards and the backend remain responsible for authorization; hiding a
  link is not an authorization control

Nested routes select their owning primary destination. For example, a
reservation detail selects `Reservas`, and an open-match creation route selects
`Partidas`.

## Authentication And Access States

| Situation | Navigation behavior |
| --- | --- |
| Unauthenticated public visitor | Show public navigation and sign-in |
| Unauthenticated access to protected route | Navigate to sign-in with safe `returnTo` |
| Valid last active context and no authorized `returnTo` | Enter that context home |
| One usable context after no valid last context | Enter it directly and hide the context switcher |
| Multiple usable contexts after no valid last context | Show the context picker |
| No usable contexts | Show the explicit no-context state |
| Missing or incomplete Player profile for a Player destination | Route to `/app/onboarding` before regular Player navigation and retain only a safe authorized Player continuation |
| Missing or incomplete Player profile for an operational destination | Enter the authorized Organization, Academy, or Admin App destination without Player onboarding |
| Safe internal but unauthorized post-login `returnTo` | Use authorized context fallback with neutral, non-disclosing feedback |
| Missing Organization or Academy | Do not invent an operational context; show creation entry when allowed |
| Direct forbidden route | Render forbidden state with a path to an allowed context |
| Access removed during a session | Remove unavailable links after session refresh and render forbidden state for the current route |
| Suspended operational context | Keep an authorized context identifiable, show its status, and route to the documented recovery or blocked state |
| Admin permission absent | Hide Admin App entry; direct access still returns forbidden |

Google One Tap is a public auth enhancement, not a navigation destination. It
may attempt only on the first eligible `/`, `/discovery`, or `/sign-in` route in
a browser tab. Desktop Chromium/Edge and Android Chromium top-level browsers use
One Tap; iOS, Safari/ITP, Firefox, and embedded webviews use the explicit
fallback defined in
`docs/frontend/sandicts-google-one-tap-experience.md`.

Do not silently redirect a forbidden operational route to a different entity.
The user must understand that access failed and have an explicit next path.
This direct-access rule is distinct from rejected post-login `returnTo`
fallback. The complete trigger and precedence rules live in
`docs/frontend/sandicts-post-login-routing.md`.

## Navigation State Ownership

Navigation selection belongs to the route.

Transient presentation such as whether one menu or sheet is open should remain
in the closest React component by default. KAN-77 may introduce a scoped
Zustand store only if multiple distant shell controls need to coordinate the
same transient UI state and every entry criterion in
`docs/frontend/sandicts-local-ui-state.md` is satisfied.

Never store:

- the current route
- the active context from the URL
- authorization or membership records
- API navigation data already owned by TanStack Query
- a duplicate selected-navigation identifier

## Accessibility Requirements

Target WCAG 2.2 AA and apply these requirements:

- use semantic `nav` elements for navigation landmarks
- give each distinct navigation landmark a unique accessible label
- mark the current route with `aria-current="page"`
- keep visible text labels with primary navigation icons
- never communicate current state through color alone
- provide a visible focus indicator
- preserve logical focus order when navigation presentation changes
- support keyboard activation without requiring touch gestures
- make Escape close an open sheet or drawer
- trap focus inside modal navigation and return focus to its trigger on close
- provide an early skip link to the main content
- use at least `44px` by `44px` interactive targets for primary mobile
  navigation, exceeding the WCAG `24px` minimum
- ensure a fixed bottom bar, app bar, sheet, or browser keyboard does not obscure
  focused content
- support text resize, `200%` zoom, and reflow without losing destinations
- reserve badges for important status and expose their meaning as text

## Safe Areas And Fixed Navigation

- include `env(safe-area-inset-bottom)` in compact bottom-navigation spacing
- include the bottom bar height and safe-area inset in the page content padding
- respect top display cutouts and browser chrome
- verify navigation with the software keyboard open
- do not make scrolling content unreachable behind a fixed bar
- do not depend on hover for discovery or operation
- keep motion subtle and respect reduced-motion preferences

## Prototype Handoff

KAN-68 must prototype:

- public compact header
- Player compact bottom navigation
- Organization compact navigation sheet
- context switcher with one and multiple operational entities
- medium rail and expanded sidebar transitions
- selected, focus, empty, forbidden, and suspended states
- `320px`, common phone widths, tablet width, landscape, zoom, and long-label
  behavior

The prototype may refine spacing, icon choice, sheet direction, and breakpoint
placement. It must not change navigation ownership, context separation, route
source of truth, or accessibility requirements without updating this document.

The approved KAN-68 direction and raw visual-reference classification live in
`docs/frontend/prototypes/app-shells/README.md`. Its repository-native prototype
is the handoff artifact for KAN-77 and later page implementation tasks.

## Implementation Handoff

KAN-77 must:

- keep route files thin and navigation configuration outside JSX duplication
- derive visible destinations from active context and capabilities
- derive selection from the route
- use Next.js links without breaking native browser behavior
- implement compact, medium, and expanded presentations from the same semantic
  destination definitions
- include focused component and browser-level tests for navigation behavior
- use local UI state according to
  `docs/frontend/sandicts-local-ui-state.md`

## Review Checklist

- Does the active area use the pattern defined for its hierarchy?
- Are primary destinations stable, labeled, and route-backed?
- Are actions and filters kept out of primary navigation?
- Is context switching separate from navigation inside a context?
- Does the current route remain correct after refresh, back, and forward?
- Are unauthorized links absent without treating hiding as authorization?
- Are empty, forbidden, suspended, and lost-access states understandable?
- Are compact controls reachable, keyboard operable, and large enough?
- Are navigation landmarks and current-page state exposed accessibly?
- Is fixed navigation clear of content, focus, safe areas, and the keyboard?
- Does one semantic destination definition drive responsive presentations?
- Has unnecessary Zustand state been avoided?

## Out Of Scope

- implementing navigation components
- final visual polish or icon selection
- page-specific content and business actions
- changing authentication or authorization rules
- adding Academy V2 pages to the MVP
- implementing a Zustand store without a concrete shell need

## Primary References

- [Android: Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- [Android: Navigation bar](https://developer.android.com/develop/ui/compose/components/navigation-bar)
- [Android: Adapt layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout)
- [Apple: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [W3C: WCAG 2.2 Understanding documents](https://www.w3.org/WAI/WCAG22/Understanding/)
- [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [W3C: Navigation Landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)
