---
title: Sandicts MVP Visual System
doc-type: frontend-visual-system
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-mvp-visual-system.md
related:
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-mvp-screens-spec.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - sandicts/sandicts-docs:docs/product/sandicts-product-context.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-functional-spec.md
scope: frontend, design, tokens, components, states, accessibility, mvp
read-when:
  - configuring shadcn/ui or Tailwind CSS
  - creating or reviewing shared UI components
  - implementing a new frontend screen or global state
  - deciding whether a visual refinement belongs in the MVP
do-not-read-when:
  - changing backend-only behavior
  - deciding feature-specific product behavior with no visual-system impact
---

# Sandicts MVP Visual System

## Purpose

Define the smallest durable visual contract needed to build the Sandicts MVP
consistently with shadcn/ui, Tailwind CSS, and lucide-react.

This is a direction and decision document. It defines token roles, component
defaults, interaction states, and visual boundaries. It does not initialize
shadcn/ui, generate components, or replace feature-specific UX decisions.

## Decision Summary

- Ship one dark Sandicts theme for the MVP.
- Use semantic CSS variables as the public component styling API.
- Preserve Sand Orange as the primary brand and action color.
- Use Geist Sans for product UI and Geist Mono only for technical values.
- Use the standard Tailwind spacing scale and a `0.625rem` base radius.
- Keep player experiences energetic and comfortably spaced.
- Keep Organization experiences denser and operational without creating a
  second component system.
- Use shadcn/ui primitives as owned source code, not as an external visual
  dependency.
- Use lucide-react for interface icons and the Sandicts mark for brand identity.
- Require an explicit loading, empty, error, forbidden, and not-found treatment
  for every data-driven screen.

## Product Character

The interface should feel:

- energetic, grounded, and practical
- connected to sand sports and beach lifestyle
- suitable for committed amateur athletes
- clear enough for fast operational work
- recognizable without depending on decorative effects

The interface should not feel:

- like a generic booking administration template
- like a passive social feed
- overly promotional inside authenticated workflows
- dependent on gradients, glass effects, or animation for hierarchy
- like a complete bespoke design system before the MVP proves its flows

## Theme Model

The MVP uses a dark theme by default and does not include a theme switcher.
Dark values live in `:root`, and the document root should declare a dark color
scheme. A future light theme must override the same semantic tokens rather than
introducing component-specific colors.

Components must consume semantic utilities such as `bg-background`,
`text-foreground`, `bg-primary`, `border-border`, and `ring-ring`.

Brand palette names may be exposed for the logo, illustrations, or rare
brand-only accents. Shared component variants and feature states must not depend
on palette names such as `sand`, `mint`, or `water`.

## Color Foundation

The following values are the human-readable MVP color references. KAN-72 may
store equivalent values as OKLCH when configuring shadcn/ui and Tailwind CSS,
provided contrast and visual intent remain equivalent.

| Reference | Value | Role |
| --- | --- | --- |
| Deep night | `#071211` | App background |
| Dark surface | `#0D1B19` | Cards and grouped content |
| Raised surface | `#122823` | Popovers and stronger surface separation |
| Border green | `#21413B` | Borders, separators, and interactive tint |
| Control border | `#47776B` | Inputs and outline controls that need a clear boundary |
| Chalk | `#F8FAF5` | Primary text and icons |
| Muted sage | `#9CA99F` | Secondary text and placeholders |
| Sand Orange | `#F59E0B` | Primary action and brand emphasis |
| Sand ink | `#161108` | Content placed on Sand Orange |
| Court mint | `#34D399` | Success |
| Water blue | `#38BDF8` | Informational state |
| Coral red | `#FB7185` | Destructive and error emphasis |

Do not add arbitrary hexadecimal colors in JSX. A repeated color or a color
with semantic meaning belongs in the token layer.

## Semantic Token Contract

### shadcn/ui Core Tokens

These tokens form the public visual contract for shared components.

| Token | Initial reference | Meaning |
| --- | --- | --- |
| `background` | Deep night | Default page and app-shell background |
| `foreground` | Chalk | Default text and icon color |
| `card` | Dark surface | Cards, panels, and grouped sections |
| `card-foreground` | Chalk | Content on cards |
| `popover` | Raised surface | Menus, popovers, and floating panels |
| `popover-foreground` | Chalk | Content on floating panels |
| `primary` | Sand Orange | Primary actions, selected states, brand emphasis |
| `primary-foreground` | Sand ink | Content on primary surfaces |
| `secondary` | Raised surface | Lower-emphasis filled actions and surfaces |
| `secondary-foreground` | Chalk | Content on secondary surfaces |
| `muted` | Dark surface | Subdued backgrounds and skeleton foundations |
| `muted-foreground` | Muted sage | Helper text, placeholders, and metadata |
| `accent` | Border green | Hovered rows, ghost controls, and active support |
| `accent-foreground` | Chalk | Content on accent surfaces |
| `destructive` | Coral red | Destructive actions and error emphasis |
| `destructive-foreground` | `#4C0519` | Content on filled destructive surfaces |
| `border` | Border green | Default border and separator |
| `input` | Control border | Form-control and outline-control boundary |
| `ring` | Sand Orange | Visible keyboard focus |
| `radius` | `0.625rem` | Base radius used to derive the radius scale |

If a generated shadcn/ui component does not use one of these tokens by default,
adapt the locally owned component once. Do not compensate at every call site.

### Sandicts Status Tokens

Status colors communicate system meaning and must be paired with text or an
icon.

| Token pair | Initial reference | Use |
| --- | --- | --- |
| `success` / `success-foreground` | `#34D399` / `#052E2B` | Completed or confirmed outcomes |
| `warning` / `warning-foreground` | `#F59E0B` / `#161108` | Attention and recoverable risk |
| `info` / `info-foreground` | `#38BDF8` / `#082F49` | Neutral operational information |
| `destructive` / `destructive-foreground` | `#FB7185` / `#4C0519` | Failure, cancellation, or destructive action |

Use low-opacity status surfaces for alerts and badges when a filled color would
be too dominant. Status meaning must never rely on hue alone.

### Deferred Tokens

- Add `sidebar-*` tokens when the first approved sidebar is implemented.
- Add `chart-1` through `chart-5` only when a real chart needs a reviewed
  categorical palette.
- Add calendar-slot tokens with the availability feature, where domain statuses
  are known.
- Do not create tokens for speculative Admin App, academy, tournament, or V2
  states.

## Tailwind And shadcn/ui Rules

- Configure shadcn/ui to use CSS variables.
- Expose semantic CSS variables to Tailwind through `@theme inline`.
- Keep shadcn/ui primitives in `src/components/ui`.
- Keep cross-feature compositions such as `EmptyState` or `StatusBadge` in
  `src/components/shared`.
- Keep feature-only variants and state mapping inside the owning feature.
- Treat generated component code as locally owned code that can be adapted to
  this contract.
- Do not create a wrapper component that only renames a shadcn/ui primitive.
- Do not generate the entire component catalog in advance.
- Use the current supported shadcn/ui registry style during setup; the registry
  style name is not a Sandicts product decision.

## Typography

Use the fonts already loaded by the app:

- Geist Sans for interface text
- Geist Mono for identifiers, timestamps, or technical values where a
  monospace face materially improves scanning

Use semibold instead of bold for most headings and actions. Avoid extra-light
text on dark surfaces.

| Role | Tailwind direction | Use |
| --- | --- | --- |
| Display | `text-4xl sm:text-5xl font-semibold tracking-tight` | Public hero only |
| Page title | `text-3xl font-semibold tracking-tight` | Main screen heading |
| Section title | `text-xl font-semibold` | Major screen section |
| Component title | `text-base font-semibold` | Cards, dialogs, and list groups |
| Body | `text-base leading-7` | Primary content |
| Supporting | `text-sm leading-6 text-muted-foreground` | Metadata and help |
| Caption | `text-xs leading-5 text-muted-foreground` | Compact labels and timestamps |

Feature screens may choose a smaller title on constrained mobile layouts, but
they must preserve the same role hierarchy.

## Spacing And Layout Density

Use Tailwind's standard `0.25rem` spacing scale. Do not create custom CSS
spacing tokens until a repeated layout need cannot be expressed clearly with
the standard scale.

Default direction:

- use `gap-2` or `gap-3` inside compact controls and metadata
- use `gap-4` for default component composition
- use `p-4` on compact cards and `p-5` or `p-6` on primary panels
- use `gap-6` or `gap-8` between screen sections
- preserve a minimum `1rem` mobile page gutter
- constrain reading content instead of stretching text across wide screens

Player surfaces may use more breathing room and stronger imagery. Organization
surfaces may reduce card padding and row spacing for scanning, but must reuse
the same typography, tokens, focus treatment, and control variants.

Default interactive controls use a `2.5rem` height. Primary mobile actions and
isolated icon controls should provide a target close to `2.75rem`. Compact
Organization controls may be smaller only when pointer and keyboard use remain
clear and the control is not a primary mobile action.

## Radius, Borders, And Elevation

- Set `--radius` to `0.625rem` and derive the shadcn/ui radius scale from it.
- Use medium radii for buttons and fields.
- Use the base or larger derived radius for cards, dialogs, and empty states.
- Reserve full pills for badges, avatars, and genuinely circular controls.
- Prefer borders and surface contrast over heavy shadows.
- Use a restrained shadow only when a floating surface needs separation from
  the layer below it.
- Do not use glow effects as a default focus or brand treatment.

## Component Direction

Defining a component direction does not require generating the component before
a real screen needs it.

### Buttons

Supported baseline variants:

- `default`: primary action using `primary`
- `secondary`: lower-emphasis filled action
- `outline`: neutral action on the current surface
- `ghost`: low-emphasis toolbar or navigation action
- `destructive`: an action with destructive consequences
- `link`: inline navigation where a button shape would add noise

Rules:

- one visually primary action per local decision area
- use a leading or trailing icon only when it improves recognition
- icon-only buttons require an accessible name and, when the meaning is not
  universal, a tooltip
- loading buttons preserve their width, expose busy state, and prevent duplicate
  submission
- disabled buttons are not a substitute for explaining unmet requirements
- destructive actions must not use the primary Sand Orange treatment

### Forms

Use the shadcn/ui field, label, input, textarea, select, checkbox, and related
primitives as needed by real forms.

Rules:

- every control has a persistent visible label
- placeholder text demonstrates format or gives an example; it does not replace
  the label
- helper text appears before validation fails when it can prevent an error
- validation text appears beside the responsible field
- a form-level alert summarizes submission or service failures when field
  messages are insufficient
- required, optional, disabled, and read-only states remain visually distinct
- focus uses the shared `ring` token
- error state uses color plus message or icon
- keep form actions close to the fields they submit

### Cards And Surfaces

- use cards for meaningful grouping, not for every piece of content
- default cards use `card`, `card-foreground`, and `border`
- selected or interactive cards need a visible hover, focus, and selected state
- public and player cards may be more spacious
- Organization panels favor compact headers and scan-friendly alignment

### Tables And Lists

- use a semantic table for dense comparable Organization data
- use list items or cards for player-facing results and mobile-first browsing
- provide a deliberate mobile representation instead of forcing every wide
  table into horizontal scrolling
- keep row actions grouped and keyboard reachable
- align numbers and short statuses for scanning
- loading rows should preserve the expected table or list structure
- empty results use the shared empty-state pattern, not a blank table

### Badges And Statuses

- badges carry short labels, categories, or statuses
- status badges combine a semantic token with explicit text
- use outline or subtle-tint badges by default
- reserve filled high-emphasis badges for states that require immediate
  attention
- map backend statuses to visual variants inside the owning feature
- do not infer domain status from color in a generic UI primitive

### Alerts

Use inline alerts for information that must remain visible while the user
decides or acts.

Supported meanings:

- neutral information
- success
- warning
- destructive or error

An alert contains a concise title when needed, a useful description, and a next
action when recovery is possible. Transient notifications must not be the only
place where validation, business-rule failure, or destructive consequences are
communicated.

### Dialogs

- use `Dialog` for a focused task that benefits from preserving page context
- use `AlertDialog` for destructive or irreversible confirmation
- keep titles and descriptions explicit
- place the safe cancel action before the confirming action
- move complex or multi-step workflows to a page instead of growing a modal
- do not nest dialogs
- preserve keyboard focus and return it to the triggering control on close

### Empty States

Use a consistent composition:

1. optional lucide-react icon
2. short title describing the absence
3. one sentence explaining context
4. primary next action when the user can resolve the state
5. optional secondary link when it offers a genuinely different path

Text and icon are sufficient for MVP empty states. Custom illustrations are
deferred. Search with no results may offer filter reset; first-use emptiness may
offer creation; a legitimate completed state may need no action.

## Common State Matrix

| State | Default treatment |
| --- | --- |
| Initial page loading | Skeleton shaped like the expected content; preserve layout |
| Action loading | Spinner or progress inside the initiating control; prevent duplicates |
| Empty | Shared empty-state composition with a relevant next action |
| Success | Persistent updated UI plus optional inline success confirmation |
| Field validation | Message beside the field and invalid control treatment |
| Business-rule error | Message near the blocked action with a safe next step |
| Service or network error | Alert or error boundary with retry when retry is safe |
| Forbidden | Simple explanation and safe route back to the correct context |
| Not found | Neutral state that does not disclose private resource existence |
| Disabled | Lower emphasis while retaining readable label and state |

Loading, error, and empty states must occupy the same structural region as the
content they replace. Avoid full-screen blocking spinners for local reads or
mutations.

## Icon Direction

Use lucide-react as the interface icon set.

Rules:

- use named imports
- use `1rem` icons in compact text or controls
- use `1.25rem` icons for default controls and navigation
- use `1.5rem` icons for prominent landmarks
- use approximately `2.5rem` to `3rem` icons in empty states
- keep the default stroke style unless a reviewed component needs a local
  adjustment
- mark decorative icons with `aria-hidden="true"`
- give icon-only controls an accessible name
- pair status icons with text
- do not use a lucide-react icon as the Sandicts logo
- do not mix a second general-purpose icon set into MVP product UI

## Accessibility Baseline

- Meet WCAG AA contrast for text, controls, and meaningful state indicators.
- The initial text and filled-state pairs in this document exceed `4.5:1`;
  recheck them if KAN-72 converts or adjusts their values.
- Keep keyboard focus visible through `ring-ring`.
- Do not remove outlines without an equivalent visible focus treatment.
- Use semantic HTML before adding ARIA.
- Keep labels and error relationships programmatically discoverable.
- Do not communicate status, selection, or validation with color alone.
- Respect reduced-motion preferences.
- Keep touch targets practical on mobile.
- Ensure dialogs, menus, and popovers can be completed with a keyboard.
- Keep muted text readable; muted does not mean low contrast.

## Motion And Feedback

Use short transitions, generally `150ms` to `200ms`, for hover, focus, and
surface changes. Motion should explain interaction state, not decorate static
content.

Advanced page transitions, parallax, animated backgrounds, and custom loading
sequences are outside the MVP.

## Image And Brand Asset Direction

- Use the Sandicts mark for brand recognition in shells and entry surfaces.
- Use beach or sport photography only when it contributes context or discovery
  value.
- Do not require photography for operational Organization workflows.
- Avoid decorative stock imagery in empty and error states.
- Treat marketing art direction and a complete logo system as post-MVP work.

## Implementation Handoff To KAN-72

KAN-72 should:

1. initialize shadcn/ui with CSS variables and existing `@/*` aliases
2. expose the core semantic and status tokens through Tailwind `@theme inline`
3. replace draft palette-facing utilities with semantic utilities
4. set the MVP dark theme and derived radius scale
5. preserve Geist Sans and Geist Mono
6. add only the first primitives needed to prove layout and form usage
7. demonstrate a button, field, surface, alert, and lucide-react icon through
   existing shared or shell UI
8. keep table, dialog, alert-dialog, and feature-specific primitives
   demand-driven
9. verify keyboard focus, contrast, loading, disabled, and invalid states

The current `sand`, `mint`, `water`, `surface`, `surface-raised`, and `line`
variables are implementation drafts. KAN-72 should migrate their consumers to
the semantic contract in this document rather than preserving palette names as
the shared component API.

## Deferred Until After MVP

- a user-selectable light theme
- a complete marketing design language
- a broad illustration system
- high-fidelity prototypes for every page
- advanced motion and transitions
- a complete component catalog
- speculative Academy, Admin App, tournament, or Web3 visual states
- chart palettes without real chart requirements
- multiple density themes or user-selectable compact mode

## Review Checklist

Before approving shared visual work, confirm:

- semantic tokens are used instead of raw repeated colors
- component variants follow the directions in this document
- loading, empty, error, and success states are explicit
- focus, contrast, and keyboard behavior remain visible
- Organization density does not fork the component system
- lucide-react icons are accessible and not used as the brand mark
- a post-MVP refinement has not entered the foundation by accident

## Implementation References

- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Tailwind v4 guidance](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui component catalog](https://ui.shadcn.com/docs/components)
