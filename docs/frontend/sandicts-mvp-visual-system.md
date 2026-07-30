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
consistently with shadcn/ui, Tailwind CSS, and Phosphor Icons.

This is a direction and decision document. It defines token roles, component
defaults, interaction states, and visual boundaries. It does not initialize
shadcn/ui, generate components, or replace feature-specific UX decisions.

## Decision Summary

- Ship one dark Sandicts theme for the MVP.
- Use semantic CSS variables as the public component styling API.
- Use the Stone/Amber foundation from shadcn preset `b6pMnd9eSI`.
- Use IBM Plex Sans for product UI, Montserrat for headings, and a system
  monospace stack for technical values.
- Use the standard Tailwind spacing scale and a `0.45rem` base radius.
- Keep player experiences energetic and comfortably spaced.
- Keep Organization experiences denser and operational without creating a
  second component system.
- Use shadcn/ui primitives as owned source code, not as an external visual
  dependency.
- Use Phosphor for interface icons and the Sandicts mark for brand identity.
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

The MVP uses a dark theme and does not include a theme switcher. The preset's
light values live in `:root`; dark values live in `.dark`; the document root
activates `.dark` explicitly. Both maps use the same semantic contract so a
future theme decision does not require component-specific colors.

Components must consume semantic utilities such as `bg-background`,
`text-foreground`, `bg-primary`, `border-border`, and `ring-ring`.

Brand palette names may be exposed for the logo, illustrations, or rare
brand-only accents. Shared component variants and feature states must not depend
on palette names such as `sand`, `mint`, or `water`.

## Color Foundation

The canonical foundation is the resolved OKLCH output of preset
`b6pMnd9eSI`:

- Nova component language on the Radix base
- Stone neutral surfaces
- Amber primary actions
- subtle menu accents
- default translucent menu surfaces
- Orange chart sequence

Exact light and dark values live in `src/app/globals.css`. Do not duplicate
them in JSX or feature CSS. Renderers that cannot consume CSS variables may use
the documented static serialization in `src/lib/visual-system`.

## Semantic Token Contract

### shadcn/ui Core Tokens

These tokens form the public visual contract for shared components.

| Token | Foundation | Meaning |
| --- | --- | --- |
| `background` / `foreground` | Stone | Default page surface and content |
| `card` / `card-foreground` | Stone | Cards, panels, and grouped sections |
| `popover` / `popover-foreground` | Stone | Menus, popovers, and floating panels |
| `primary` / `primary-foreground` | Amber | Primary actions and selected emphasis |
| `secondary` / `secondary-foreground` | Stone | Lower-emphasis filled actions |
| `muted` / `muted-foreground` | Stone | Subdued surfaces, metadata, and help |
| `accent` / `accent-foreground` | Stone subtle | Hovered rows and ghost controls |
| `destructive` / `destructive-foreground` | Preset red | Destructive action and content |
| `border` / `input` | Stone | Separators and control boundaries |
| `ring` | Stone/Amber-compatible | Visible keyboard focus |
| `radius` | `0.45rem` | Base radius used to derive the scale |
| `sidebar-*` | Stone/Amber | App-shell navigation surfaces and states |
| `chart-1` through `chart-5` | Orange | Reviewed chart sequence |

If a generated shadcn/ui component does not use one of these tokens by default,
adapt the locally owned component once. Do not compensate at every call site.

### Sandicts Status Tokens

Status colors communicate system meaning and must be paired with text or an
icon.

| Token family | Owner | Use |
| --- | --- | --- |
| `success`, `success-foreground`, `success-subtle`, `success-border` | Sandicts | Completed or confirmed outcomes |
| `warning`, `warning-foreground`, `warning-subtle`, `warning-border` | Sandicts | Attention and recoverable risk |
| `info`, `info-foreground`, `info-subtle`, `info-border` | Sandicts | Neutral operational information |
| `destructive` | Preset | Base destructive emphasis |
| `destructive-foreground`, `destructive-subtle`, `destructive-border` | Sandicts | Failure and destructive compositions |

Use the explicit subtle and border tokens for alerts and badges instead of
recreating opacity formulas at call sites. Status meaning must never rely on hue
alone.

### Deferred Tokens

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
- Keep `components.json` aligned to `radix-nova`, Stone, Phosphor,
  `default-translucent`, and `subtle`.

## Typography

Use the fonts loaded by the app:

- IBM Plex Sans for interface and body text
- Montserrat for headings and component titles
- the system monospace stack for identifiers, timestamps, or technical values
  where a monospace face materially improves scanning

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

- Set `--radius` to `0.45rem` and derive the shadcn/ui radius scale from it.
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
- destructive actions must use the `destructive` treatment rather than the
  primary action treatment

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

1. optional Phosphor icon
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

Use `@phosphor-icons/react` as the interface icon set.

Rules:

- use named imports
- use `1rem` icons in compact text or controls
- use `1.25rem` icons for default controls and navigation
- use `1.5rem` icons for prominent landmarks
- use approximately `2.5rem` to `3rem` icons in empty states
- use canonical `*Icon` exports and the shared `Icon` / `IconProps` types
- use regular weight by default; fill or bold may reinforce an already visible
  selected state
- mark decorative icons with `aria-hidden="true"`
- give icon-only controls an accessible name
- pair status icons with text
- do not use a Phosphor icon as the Sandicts logo
- do not mix a second general-purpose icon set into MVP product UI

## Accessibility Baseline

- Meet WCAG AA contrast for text, controls, and meaningful state indicators.
- Validate text pairs at `4.5:1` and UI/focus boundaries at `3:1` whenever the
  preset or Sandicts status extensions change.
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

## Implementation Contract From KAN-144

KAN-144 establishes:

1. the complete preset configuration and both token maps
2. the dark-only product activation
3. IBM Plex Sans, Montserrat, and system monospace fallbacks
4. the reconciled local primitives and semantic status extensions
5. Phosphor as the only general-purpose interface icon set
6. shared runtime/prototype token synchronization
7. keyboard focus, contrast, loading, disabled, invalid, and semantic-state
   validation

Later features must consume this contract rather than reintroducing palette
names, legacy font stacks, or a second interface icon library.

## Deferred Until After MVP

- a user-selectable light theme
- a complete marketing design language
- a broad illustration system
- high-fidelity prototypes for every page
- advanced motion and transitions
- a complete component catalog
- speculative Academy, Admin App, tournament, or Web3 visual states
- multiple density themes or user-selectable compact mode

## Review Checklist

Before approving shared visual work, confirm:

- semantic tokens are used instead of raw repeated colors
- component variants follow the directions in this document
- loading, empty, error, and success states are explicit
- focus, contrast, and keyboard behavior remain visible
- Organization density does not fork the component system
- Phosphor icons are accessible and not used as the brand mark
- a post-MVP refinement has not entered the foundation by accident

## Implementation References

- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Tailwind v4 guidance](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui component catalog](https://ui.shadcn.com/docs/components)
