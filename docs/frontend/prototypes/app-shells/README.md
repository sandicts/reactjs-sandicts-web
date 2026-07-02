---
title: Sandicts App Shell Prototypes
doc-type: frontend-ux-prototype
role: source-of-truth
priority: high
canonical: docs/frontend/prototypes/app-shells/README.md
related:
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-mvp-visual-system.md
  - docs/frontend/sandicts-page-functional-spec.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - KAN-68
scope: frontend, ux, prototype, app-shell, responsive, navigation, mvp
read-when:
  - implementing a public, Player, or Organization layout shell
  - reviewing responsive navigation or the context switcher
  - deciding whether a generated visual reference represents approved MVP scope
do-not-read-when:
  - implementing page-specific business logic without shell impact
  - treating generated screenshots as pixel-perfect specifications
---

# Sandicts App Shell Prototypes

## Purpose

Record the first shippable shell direction for the Sandicts public, Player, and
Organization areas before production implementation.

This directory is the KAN-68 prototype handoff. It contains:

- one repository-native interactive prototype
- the raw AI-generated visual references that informed the exploration
- the accepted layout and responsive decisions
- rejected or deferred ideas that must not silently expand the MVP
- unresolved product questions that remain owned by later decision tasks

The prototype validates hierarchy, navigation presentation, context switching,
responsive modes, operational density, and access-boundary states. It does not
freeze final page content or pixel-level polish.

## View The Prototype

Open [`index.html`](./index.html) directly in a browser, or serve the repository
root with any static file server and navigate to:

```text
/docs/frontend/prototypes/app-shells/index.html
```

Use the prototype toolbar to change:

- the active shell: Public, Player, or Organization
- the page state: content, empty, forbidden, or suspended
- whether the account has one or multiple usable contexts
- keyboard focus demonstration

Resize the viewport to exercise the compact, medium, and expanded navigation
presentations.

## Status And Authority

| Artifact | Status | Authority |
| --- | --- | --- |
| `index.html`, `styles.css`, `prototype.js` | Approved prototype direction | Canonical for KAN-68 shell structure |
| This document | Approved prototype handoff | Canonical for decisions and open questions |
| Files under `references/` | Raw exploration evidence | Non-canonical and not implementation specs |
| Page-specific content shown in the prototype | Representative only | Functional specs and business rules remain authoritative |

When the prototype and a raw screenshot disagree, follow the prototype and this
document. When the prototype and an existing product or business-rule document
disagree, stop and reconcile the documents before production implementation.

## Selected Shell Direction

### Public

- Use a compact header at narrow widths.
- Keep discovery search, filters, result controls, and view switching inside the
  page rather than global navigation.
- Keep sign-in visible without turning it into a peer destination.
- Use a horizontal public header at expanded widths.
- Do not add a public bottom navigation bar for the MVP.
- Keep public detail pages addressable by URL and compatible with browser back.

The generated mobile discovery screen is useful for content hierarchy. The
repository prototype adds the missing expanded public direction.

### Player

- Use the five KAN-66 destinations in stable order: `Início`, `Explorar`,
  `Reservas`, `Partidas`, and `Perfil`.
- Use a labeled bottom navigation bar in compact mode.
- Use an icon rail in medium mode.
- Use a persistent labeled sidebar in expanded mode.
- Keep creation, filtering, reserve, join, and edit actions inside the current
  page.
- Derive selected navigation from the URL in production. The prototype only
  simulates selection to demonstrate presentation.
- Preserve more space and a calmer information density than Organization
  screens.

The generated Player screenshots are useful layout references. Game-like
statistics, rankings, wallets, credits, and unrelated competitive terminology
inside those screenshots are not approved by this task.

### Organization

- Use a compact app bar with a clearly labeled menu trigger.
- Put authorized destinations in a modal navigation drawer at compact widths.
- Use an icon rail in medium mode.
- Use a persistent labeled sidebar in expanded mode.
- Keep the organization context control separate from navigation inside the
  active organization.
- Group destinations in this order:
  1. Overview: `Painel`, `Agenda`, `Reservas`
  2. Operation: `Unidades` when enabled, `Quadras`, `Disponibilidade`,
     `Pagamentos`
  3. Management: `Perfil da organização`, `Membros` and settings when enabled
- Keep authenticated application shells free of marketing footers.
- Use denser, scan-friendly panels without creating a second visual system.

The older Jira wording `partner/admin shell` maps to the current operational
Organization shell for the MVP. Academy and the internal Admin App remain
separate contexts and do not gain MVP pages from this prototype.

## Agenda Decision

The canonical Organization agenda is the court-by-time grid represented in the
repository prototype and the
[`organization-agenda.png`](./references/desktop/organization/organization-agenda.png)
reference.

Required structure:

- courts in columns
- times in rows
- day and week views
- date navigation
- filters for sport, court, and status
- summary metrics
- visible confirmed, pending, blocked, maintenance, and available states
- a primary `Nova reserva` action
- horizontal scrolling with an accessible region label when the grid does not
  fit compact viewports

The small Agenda block from the generated Organization dashboard is only a
summary and shortcut. It does not replace the operational Agenda route.

`Agenda`, `Reservas`, and `Disponibilidade` are separate concepts:

| Destination | Responsibility |
| --- | --- |
| Agenda | Temporal and spatial operation across courts |
| Reservas | Searchable records, details, and reservation operations |
| Disponibilidade | Recurring opening hours, blocks, and maintenance configuration |

## Context Switcher

- Hide the switcher when only one usable context exists.
- Show it in the authenticated top app bar when multiple contexts exist.
- Present multiple contexts in a grouped modal sheet or equivalent dialog on
  compact viewports.
- Keep Player, Organization, Academy, and Admin App as separate context groups.
- Selecting a context navigates to that context home rather than restoring an
  arbitrary nested route.
- Keep account settings and sign-out outside the context list.
- Preserve focus inside the dialog and return it to the trigger when dismissed.

The prototype demonstrates one-context visibility and a multi-context dialog
with Player and two Organization entries. Academy and Admin App groups appear
only when the authenticated account has those contexts.

## Responsive Contract

Use content-driven transitions with the KAN-66 widths as initial tokens:

| Mode | Initial width | Public | Player | Organization |
| --- | --- | --- | --- | --- |
| Compact | below `48rem` | Compact header | Bottom navigation | App bar and navigation drawer |
| Medium | `48rem` to below `64rem` | Horizontal header | Navigation rail | Navigation rail |
| Expanded | `64rem` and above | Horizontal header | Labeled sidebar | Labeled sidebar |

Validation widths:

- `320px` narrow mobile
- `390px` common phone
- `768px` tablet and medium rail boundary
- `1440px` expanded desktop
- compact landscape
- `200%` browser zoom
- long Portuguese labels

Rules:

- use CSS viewport behavior, not user-agent detection
- preserve destination order between presentations
- never keep mobile and desktop navigation simultaneously focusable
- keep touch targets at least `44px` by `44px`
- include safe-area padding for fixed compact navigation
- keep fixed UI from covering content, focus, or software-keyboard targets

## Prototype State Coverage

| State | Prototype treatment |
| --- | --- |
| Selected navigation | Explicit text, contrast, and `aria-current="page"` |
| Keyboard focus | Shared visible Sand Orange outline |
| Empty | Explanation and relevant next action |
| Forbidden | Reason plus a safe path to an allowed context |
| Suspended | Status, operational consequence, and recovery information |
| One context | Context switcher hidden; current context remains identifiable |
| Multiple contexts | Context dialog available from the authenticated app bar |

Loading, generic error, and not-found components remain owned by the dedicated
global state prototype and implementation tasks. KAN-68 only confirms that
shell navigation remains stable around those page states.

## Accessibility Notes

- The prototype uses semantic `header`, `nav`, `main`, `aside`, `table`, and
  native `dialog` elements.
- A skip link reaches the prototype content.
- Navigation landmarks have distinct accessible labels.
- Current destinations use `aria-current="page"`.
- Statuses combine text with visual treatment.
- Keyboard focus is visible and can be demonstrated from the toolbar.
- The Organization agenda uses table headers and a named scrollable region.
- Dialogs close with Escape through native dialog behavior.
- Reduced-motion preferences disable nonessential transitions.

Production implementation still needs component and browser tests for focus
return, route-derived selection, permissions, direct entry, back/forward,
safe-area behavior, and zoom/reflow.

## Raw Reference Inventory

The source files were copied on 2026-07-02. Uizard generated the mobile,
Player desktop, and most Organization desktop screens. The Organization agenda
reference came from v0.

### Mobile

| File | Useful for | Do not infer |
| --- | --- | --- |
| [`public-discovery.png`](./references/mobile/public-discovery.png) | Compact public discovery hierarchy | Approved colors, public bottom navigation |
| [`court-detail.png`](./references/mobile/court-detail.png) | Long-form public detail composition | Final amenities or policy fields |
| [`player-home.png`](./references/mobile/player-home.png) | Compact Player card rhythm | Credits, game statistics, or final notification scope |
| [`organization-dashboard.png`](./references/mobile/organization-dashboard.png) | Compact operational density | Organization bottom navigation |
| [`reservation-flow.png`](./references/mobile/reservation-flow.png) | Reservation flow exploration | Approved payment or split-payment scope |

### Player Desktop

| File | Useful for | Do not infer |
| --- | --- | --- |
| [`player-home.png`](./references/desktop/player/player-home.png) | Expanded home hierarchy | Game-server language or competitive statistics |
| [`player-discovery.png`](./references/desktop/player/player-discovery.png) | Search, filters, and result layout | Final card fields |
| [`player-reservations.png`](./references/desktop/player/player-reservations.png) | Reservation list density | Final cancellation policy |
| [`player-matches.png`](./references/desktop/player/player-matches.png) | Match section exploration | Esports scoreboards or referee workflows |
| [`player-profile.png`](./references/desktop/player/player-profile.png) | Expanded profile grouping | Ranking, XP, 2FA placement, or final profile fields |

### Organization Desktop

| File | Useful for | Do not infer |
| --- | --- | --- |
| [`organization-agenda.png`](./references/desktop/organization/organization-agenda.png) | Canonical court-by-time agenda structure | Final colors or event-card detail |
| [`organization-dashboard.png`](./references/desktop/organization/organization-dashboard.png) | Dashboard grouping | Academy and Organization being the same domain |
| [`organization-reservations.png`](./references/desktop/organization/organization-reservations.png) | Dense filters and reservation records | Duplicate top and side navigation |
| [`organization-courts.png`](./references/desktop/organization/organization-courts.png) | Court management concepts | Overlapping layout or decorative stock imagery |
| [`organization-finance.png`](./references/desktop/organization/organization-finance.png) | Future financial concepts | Reconciliation, invoices, delinquency, or scheduled reports in MVP |
| [`organization-settings.png`](./references/desktop/organization/organization-settings.png) | Future settings grouping | SSO, Stripe, Google Calendar, theme editor, or advanced audit UI in MVP |

## Rejected Or Deferred Generated Ideas

The following generated elements are explicitly non-canonical:

- neon green as the primary brand/action color
- light authenticated canvases mixed with the dark MVP theme
- duplicate top and side primary navigation
- compact Organization bottom navigation
- using `Academia` as a synonym for `Organization`
- giant marketing footers inside authenticated tools
- random decorative images in operational panels
- ranking, overall, XP, wallets, or game-server concepts
- SSO, advanced session management, Stripe setup, Google Calendar, and theme
  customization in the MVP shell
- bank reconciliation, CSV/OFX import, automated invoices, delinquency
  analytics, and scheduled financial reports in the MVP

These ideas may be reconsidered only through an explicit product decision or V2
task.

## Open Product Questions

The shell prototype intentionally does not resolve:

- whether `/` is marketing, discovery, or a hybrid
- whether Organization units are enabled in the first MVP slice
- whether reservation confirmation is always manual
- whether availability varies by court only or court and sport
- whether pricing is fixed by court or varies by period
- the exact MVP Organization profile and member-permission fields
- whether compact Agenda supports direct editing or opens a focused detail flow

These questions do not block shell implementation. Their owning feature tasks
must resolve them before building the affected page behavior.

## Implementation Handoff

The production app-shell task must:

- keep route files thin and destination configuration outside duplicated JSX
- derive current navigation from the URL
- derive visible Organization destinations from membership capabilities
- render compact, medium, and expanded navigation from the same semantic
  destination definitions
- use Next.js links without breaking native browser behavior
- use the existing semantic visual tokens and lucide-react icons
- keep context switching separate from primary navigation
- preserve public, Player, Organization, Academy, and Admin App boundaries
- add focused component tests and Playwright coverage
- avoid adding Zustand for route selection or a single drawer trigger

Page implementation should reference this handoff, the functional spec, and the
mobile navigation decision rather than copying generated screenshots.

## KAN-68 Completion Checklist

- [x] Public shell direction exists for compact and expanded widths.
- [x] Player shell direction exists for compact, medium, and expanded widths.
- [x] Organization shell direction exists for compact, medium, and expanded widths.
- [x] Organization compact navigation drawer is represented.
- [x] Context switcher covers one and multiple usable contexts.
- [x] The canonical Organization agenda direction is recorded.
- [x] Selected, focus, empty, forbidden, and suspended states are represented.
- [x] Responsive validation targets are documented.
- [x] Raw visual references are preserved and classified.
- [x] Accepted, rejected, deferred, and open decisions are documented.
- [x] Production implementation handoff is explicit.
