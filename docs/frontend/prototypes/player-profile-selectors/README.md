---
title: Sandicts Player Profile Sport And Level Selectors
doc-type: frontend-ux-prototype
role: source-of-truth
priority: high
canonical: docs/frontend/prototypes/player-profile-selectors/README.md
related:
  - docs/frontend/sandicts-mvp-visual-system.md
  - docs/frontend/sandicts-localization.md
  - docs/frontend/sandicts-post-login-routing.md
  - docs/frontend/prototypes/global-states/README.md
  - src/lib/api/generated/sandicts-api/players/players.ts
  - src/lib/api/generated/sandicts-api/sports/sports.ts
  - KAN-93
  - KAN-94
  - KAN-96
scope: frontend, ux, prototype, player-profile, sport, level, onboarding, responsive, accessibility, mvp
read-when:
  - implementing or reviewing the Player profile onboarding sport and level step
  - implementing or reviewing sport and level editing in the Player profile
  - evolving the API contract for sports, level scales, or Player sport history
  - deciding how generated visual exploration relates to approved product behavior
do-not-read-when:
  - implementing extended public-profile fields or progression features
  - treating a v0 output as production code or a pixel-perfect specification
---

# Sandicts Player Profile Sport And Level Selectors

## Purpose

Record the approved KAN-96 behavioral prototype for selecting the Player's main
sport and self-assessed level. This document is the implementation handoff for
KAN-94 and for the API, persistence, and generated-client tasks required by the
dynamic level-scale direction.

The prototype is intentionally documented instead of committed as generated UI
code. It freezes product rules, interaction, states, copy, accessibility,
responsive behavior, component boundaries, and the target data contract while
leaving implementation details open to the production task.

AI-generated screens and user-provided images used during discovery were visual
references only. They are not canonical artifacts and must not override this
document, the MVP visual system, or an implemented API contract.

## Status And Authority

| Artifact | Status | Authority |
| --- | --- | --- |
| This document | Approved KAN-96 behavioral prototype | Canonical for selector behavior and KAN-94 handoff |
| KAN-93 and the generated OpenAPI client | Implemented current contract | Canonical until the follow-up contract is delivered |
| Dynamic contract in this document | Approved target direction | Not yet an implemented API |
| v0 output and attached images | Exploration evidence | Non-canonical; do not copy as production code |
| MVP visual-system documentation | Approved shared presentation rules | Canonical for tokens, primitives, and global state language |

If the production API has not yet adopted the target contract, the frontend
must use the current generated client and must not hand-edit generated files or
pretend dynamic fields exist.

## Approved Scope

The MVP has exactly one active main sport per Player. The level belongs to that
sport, not directly to the Player.

The selector serves two contexts:

- onboarding, where neither sport nor level starts selected
- future profile editing, where the current sport and level load selected

The initial catalog contains:

- Futevôlei
- Beach Tennis
- Vôlei de Praia

All three initially use the same reusable level scale. The model must allow a
sport to reference a different scale later without a frontend or backend
deployment merely to change, reorder, deactivate, or add configured level
content.

The following are explicitly outside KAN-96 and KAN-94:

- multiple active sports in the MVP UI
- public Player profile presentation
- name, photo, bio, city, height, age, dominant foot, or preferred court side
- academy or school badges
- tournament trophies
- skill points, sport fundamentals, or generated Player archetypes
- administration UI for the catalogs

Those ideas require their own contracts and delivery tasks.

## Decision Log

| ID | Approved decision | Consequence |
| --- | --- | --- |
| DL-01 | Keep exactly one active main sport in MVP. | Do not expose multi-sport controls or reopen the MVP scope decision. |
| DL-02 | The selected level belongs to the main sport. | Sport and level are persisted as one Player-sport relationship. |
| DL-03 | Use selectable cards as a radio group for up to six sports. | The common MVP catalog stays direct, visible, and easy to scan. |
| DL-04 | Use a searchable combobox when the catalog has seven or more sports. | Catalog growth does not create an unbounded card grid. |
| DL-05 | Open large-catalog search in a Sheet on compact viewports and a Popover on larger viewports. | The same semantic search behavior receives viewport-appropriate presentation. |
| DL-06 | Use a card radio group for levels. | Each option can show the conventional name, friendly name, and explanation together. |
| DL-07 | Do not preselect during onboarding. | The Player makes an explicit self-assessment. |
| DL-08 | Load saved values in edit mode. | Editing reflects persisted state and is not treated as a new onboarding. |
| DL-09 | Disable the level selector until a sport is selected. | Levels are never presented without their owning sport and scale. |
| DL-10 | Preserve previous sport history and restore its saved level when returning. | Switching the main sport does not destroy earlier Player-sport data. |
| DL-11 | Clear the visible level when changing to a sport with no saved history. | A level from one sport never leaks into another sport. |
| DL-12 | Use database-backed reusable level scales. | Content changes and new configured levels do not require application deployment. |
| DL-13 | Allow multiple sports to reference the same scale and future sports to reference specialized scales. | Futevôlei and another sport may share a scale without copying its levels. |
| DL-14 | Keep IDs and codes stable; edit display content and ordering separately. | Persisted references survive copy improvements. |
| DL-15 | Deactivate referenced levels instead of deleting them. | Historical profiles remain resolvable. |
| DL-16 | Treat a structural meaning change as a new scale with an explicit migration map. | Editing copy cannot silently redefine a Player's recorded level. |
| DL-17 | Keep fixed interface copy in `next-intl`; return catalog content from the API in pt-BR. | UI localization and managed domain content have separate ownership. |
| DL-18 | Keep `SportSelector` and `LevelSelector` feature-local initially. | Reuse onboarding and profile editing without creating a premature global abstraction. |
| DL-19 | Use shadcn/ui primitives, Tailwind semantic tokens, and lucide-react icons. | The feature stays within the existing frontend system. |
| DL-20 | Validate on submit, focus the first invalid field, and revalidate while correcting. | Errors are discoverable without aggressive validation before interaction. |
| DL-21 | Use mobile-first one-column layouts, expanding to three sport columns and two level columns at `48rem`. | The choices remain readable and touch-friendly without horizontal page scrolling. |
| DL-22 | Record post-MVP progression separately. | Skill budgets, fundamentals, and archetypes do not expand the selector MVP. |

## Interaction Flow

### Onboarding

1. Render the `Esporte e nível` module after basic identification fields.
2. Load the active sports catalog and referenced level scales.
3. Render no sport or level preselected.
4. Let the Player select exactly one main sport.
5. Resolve that sport's scale and enable the level options.
6. Let the Player select exactly one level.
7. Let the KAN-94 parent flow own `Continuar`, submission, and navigation.
8. On invalid submission, show the field messages and move focus to the first
   invalid group.
9. During submission, preserve the selections, prevent duplicate submission,
   and show `Salvando perfil…`.
10. Continue only after the server returns the resolved saved profile.

### Profile Editing

1. Load the saved main sport and its current level selected.
2. When the Player selects another sport, look for saved history for that
   sport.
3. If history exists, restore its saved level and announce the restoration.
4. If no history exists, clear the level and require a new choice.
5. Save with `Salvar alterações`.
6. Keep the previous main sport history archived or inactive rather than
   deleting it.

The future paid multi-sport entitlement may raise the active-sport limit. That
future capability must not change or appear in the MVP interface.

## Selector Behavior

### Sport Selector

For one to six active sports:

- render a card-based single-select RadioGroup
- show the sport name as the primary card label
- use a consistent sport icon only when an approved icon mapping exists
- keep every card at least `44px` high and make the full card target interactive

For seven or more active sports:

- replace the full card list with a searchable combobox
- search case-insensitively by the displayed sport name
- use a modal Sheet below `48rem`
- use a Popover at `48rem` and above
- return focus to the trigger after selection or dismissal
- keep the selected value visible in the closed trigger
- provide a clear no-results message without turning it into a catalog-empty
  error

### Level Selector

Render the active levels from the selected sport's referenced scale as a
card-based single-select RadioGroup. Each option has three text lines:

1. conventional level name
2. friendly explanatory name
3. concise self-assessment description

Use API order. Do not infer order from the conventional name or from a
hard-coded enum.

The initial shared scale is:

| Stable code | Conventional name | Friendly name | Description |
| --- | --- | --- | --- |
| `rookie` | Estreante | Começando | Estou conhecendo o esporte e aprendendo suas regras e fundamentos. |
| `beginner` | Iniciante | Em evolução | Já conheço os fundamentos, mas ainda estou desenvolvendo execução e consistência. |
| `intermediate` | Intermediário | Chegando lá | Executo os principais fundamentos e consigo jogar com consistência. |
| `advanced` | Avançado | Experiente | Tenho domínio consistente dos fundamentos e jogo em ritmo intenso e estratégico. |

The friendly language should be welcoming but not excessively informal.

## Relationship Between Sport And Levels

- Every active sport references one active level scale.
- Multiple sports may reference the same scale.
- A scale owns an ordered collection of levels.
- A sport-specific scale can be introduced later through catalog configuration.
- Changing the sport immediately changes the available level collection.
- A previously selected level is valid only when it belongs to the resolved
  scale and remains selectable.
- An inactive saved option remains understandable in history but cannot be
  newly selected.
- The server is authoritative for membership between sport, scale, and level.

## Visual States

| State | Sport card | Level card |
| --- | --- | --- |
| Default | Neutral border and surface | Neutral border and surface |
| Hover | Subtle semantic hover surface and border change | Same treatment |
| Focus visible | `2px` Sand Orange focus ring with sufficient offset | Same treatment |
| Pressed | Brief pressed surface/scale feedback | Same treatment |
| Selected | Sand Orange border, subtle selected surface, and `CircleCheck` | Same treatment |
| Disabled | Muted surface and text, unavailable cursor, no hover treatment | Same treatment |

Rules:

- selection never relies on color alone
- use semantic design tokens rather than raw palette values
- use `150ms` to `200ms` transitions for state changes
- remove nonessential transition and pressed motion for reduced-motion users
- do not introduce gradients, glass effects, neon colors, or a parallel visual
  system

## State Inventory

| State | Required behavior and copy direction |
| --- | --- |
| Initial loading | Keep the parent shell and heading stable; use local content-shaped skeletons and mark the region busy. |
| Sport catalog empty | Explain that no sports are available and prevent progression. |
| Search no results | Keep the catalog valid; say no sport matched the search and allow the query to be cleared. |
| Scale empty | Keep the selected sport visible; explain that levels are not available for it and prevent progression. |
| Recoverable service error | Preserve safe local selections and offer retry for the failed read. |
| Rate limited | Explain the temporary limit without promising an exact recovery time; allow a safe later retry. |
| Level not yet available | Keep the level group disabled and show the sport-first helper. |
| Validation error | Show a message beside the responsible group, set invalid semantics, and focus the first invalid group on submit. |
| Stale or inactive saved option | Explain that the saved option is no longer available and require an active selection without erasing history. |
| History restored | Restore the saved level, keep it editable, and announce the restoration politely. |
| Saving | Preserve layout and selections; show pending text inside the parent action and prevent duplicate submission. |
| Save failed | Keep the selections, show an action-level error, and allow a safe retry. |
| Save succeeded | Reflect the saved state and announce success politely before the parent flow advances. |

Suggested visible pt-BR state copy:

| Situation | Copy |
| --- | --- |
| Sports loading | `Carregando esportes…` |
| No sports | `Nenhum esporte está disponível no momento.` |
| Sport load failed | `Não foi possível carregar os esportes. Tente novamente.` |
| No search matches | `Nenhum esporte encontrado para esta busca.` |
| Level disabled | `Escolha primeiro seu esporte para ver os níveis.` |
| No levels | `Ainda não há níveis disponíveis para este esporte.` |
| Level load failed | `Não foi possível carregar os níveis. Tente novamente.` |
| Missing sport | `Escolha seu esporte principal.` |
| Missing level | `Escolha o nível que mais combina com seu momento.` |
| Save failed | `Não foi possível salvar seu perfil. Revise os dados e tente novamente.` |
| Rate limited | `Você fez muitas tentativas. Aguarde um pouco e tente novamente.` |
| Save succeeded | `Perfil salvo.` |
| Stale value | `Sua escolha anterior não está mais disponível. Selecione uma opção atual.` |

## Responsive Behavior

Start with compact layouts:

- one sport card per row
- one level card per row
- full-width controls and parent action where the onboarding composition needs
  them
- modal Sheet for large-catalog search
- no page-level horizontal scrolling
- respect safe-area insets when a parent action bar is fixed

At `48rem` and above:

- render up to three sport columns
- render up to two level columns
- use a Popover for large-catalog search
- keep line lengths readable and avoid stretching the module to the whole
  viewport

Validate at `320px`, `390px`, `768px`, and `1440px`, compact landscape, browser
zoom at `200%`, and with long Portuguese catalog content.

## Visible Copy

All visible interface copy is Brazilian Portuguese.

| Element | Approved copy |
| --- | --- |
| Eyebrow | `Seu perfil esportivo` |
| Title | `Qual é a sua praia?` |
| Description | `Escolha seu esporte principal e conte como está seu jogo hoje.` |
| Sport legend | `Escolha seu esporte principal` |
| Sport help | `Escolha o esporte que você mais pratica.` |
| Level legend | `Em que nível está seu jogo no {esporte}?` |
| Level help | `É uma autoavaliação — escolha o momento que mais combina com você.` |
| Onboarding action | `Continuar` |
| Edit action | `Salvar alterações` |
| Pending action | `Salvando perfil…` |
| History restoration | `Restauramos seu último nível em {esporte}: {nível}. Você pode alterá-lo.` |

Fixed interface messages belong to the pt-BR `next-intl` catalog. Sport, scale,
and level display content comes from the API and remains managed domain data.

## Accessibility Requirements

- Use `fieldset` and `legend`, or an equivalent shadcn RadioGroup composition
  that exposes one named single-select group.
- Tab enters each RadioGroup once.
- Arrow keys move and select within the group according to the RadioGroup
  pattern.
- Space selects the focused option.
- The combobox supports typing, arrow navigation, Enter selection, Escape
  dismissal, and focus return.
- Associate help and validation text through `aria-describedby`.
- Set `aria-invalid` when the submitted group is invalid.
- Announce newly appearing errors assertively without duplicating initial page
  content.
- Announce history restoration and save success through a polite live region.
- Expose loading with `aria-busy` and concise accessible status text; hide
  decorative skeletons from assistive technology.
- Preserve a visible focus indicator and logical source order.
- Meet WCAG AA contrast for text and interactive states.
- Keep targets at least `44px` by `44px`.
- Support reflow at `200%` zoom and respect `prefers-reduced-motion`.

Production acceptance includes keyboard and screen-reader review; the visual
states alone are not sufficient accessibility evidence.

## Component Boundaries

Start with feature-owned components under the Player profile feature:

```text
src/features/player-profile/
├── components/
│   ├── sport-selector.tsx
│   └── level-selector.tsx
├── model/
└── api/
```

The exact internal folders may follow the repository's implementation-time
feature convention. The ownership rule is more important than the sample tree:

- `SportSelector` owns catalog presentation and single sport selection.
- `LevelSelector` owns resolved-scale presentation and single level selection.
- KAN-94 owns the form, onboarding step, submit action, and navigation.
- Existing shared `LoadingRegion`, `PendingButton`, state composition, shadcn/ui
  primitives, Tailwind tokens, and lucide-react icons should be reused.
- A generic card/radio primitive may live under `components/ui` when it contains
  no Player-profile business rules.
- Promote selectors to a broader shared feature boundary only after another
  real consumer proves the abstraction.

Do not put server catalog state or derived form state in Zustand. Prefer
generated TanStack Query hooks, local form ownership, and explicit semantic
adapters.

## Current Contract And Target Contract

KAN-93 and the checked-in OpenAPI client currently expose the implemented MVP
contract:

- `src/lib/api/generated/sandicts-api/sports/sports.ts`
- `src/lib/api/generated/sandicts-api/players/players.ts`
- `src/lib/api/generated/sandicts-api/model/createCurrentPlayerProfileBody.ts`
- `src/lib/api/generated/sandicts-api/model/updateCurrentPlayerProfileBody.ts`
- `src/lib/api/generated/sandicts-api/model/playerProfileMainSportResponseOutput.ts`

Those generated files remain authoritative until regeneration from an approved
backend OpenAPI artifact.

The approved target shape normalizes reusable catalogs:

```json
{
  "sports": [
    {
      "id": "stable-sport-id",
      "code": "futevolei",
      "name": "Futevôlei",
      "levelScaleId": "shared-main-scale",
      "sortOrder": 10,
      "isActive": true
    }
  ],
  "levelScales": [
    {
      "id": "shared-main-scale",
      "code": "main-sport-v1",
      "title": "Nível no esporte",
      "levels": [
        {
          "id": "stable-level-id",
          "code": "rookie",
          "name": "Estreante",
          "friendlyName": "Começando",
          "description": "Estou conhecendo o esporte e aprendendo suas regras e fundamentos.",
          "sortOrder": 10,
          "isActive": true
        }
      ]
    }
  ]
}
```

Create and update requests must send the selected sport plus a stable
`mainSportLevelId`. Responses must return the resolved sport, scale, and level
rather than forcing the client to reconstruct domain relationships.

The target persistence concept is a Player-sport profile relationship with:

- Player identifier
- sport identifier
- level-scale identifier
- current level identifier
- `isMain`
- active or archived state
- creation and update timestamps

The backend must enforce exactly one main sport and an MVP active-sport
entitlement limit of one. History for previous sports remains stored. A future
entitlement may raise the active limit without redefining the relationship.

### Catalog Lifecycle

- IDs and codes are immutable after publication.
- Name, friendly name, description, order, and active state are managed data.
- New levels may be added without deployment.
- Referenced levels are deactivated rather than deleted.
- A change that alters the meaning or progression structure creates a new
  versioned scale.
- Moving persisted Players to a new scale requires a complete, reviewed
  old-level-to-new-level migration map.
- The existing `beginner`, `intermediate`, and `advanced` values map directly;
  `rookie` is additive.
- KAN-93 compatibility remains available during an explicit deprecation window.

## KAN-94 Consumption

KAN-94 must consume this document as follows:

- compose the module after basic Player identification
- use the approved pt-BR headings, legends, help, and validation direction
- render no onboarding default
- use the current saved selections in edit mode
- own the parent `Continuar` or `Salvar alterações` action
- block completion until both required selections are valid
- use the sport catalog and scale relationships from generated API types once
  the dynamic contract is delivered
- isolate temporary adapters if implementation begins during the compatibility
  window
- reuse global loading/error primitives without hiding domain-specific empty,
  invalid, stale, or history-restoration behavior
- exclude all extended Player profile and progression ideas from its scope

## Future Progression Direction

Post-MVP progression is intentionally separate but must remain compatible with
stable sport and level identifiers:

- each sport and level may grant a configurable skill-point budget
- each sport may define its own skill or fundamental catalog
- Players distribute the budget among those fundamentals
- deterministic, explainable rules may unlock original Sandicts archetype
  titles from proportional skill distribution
- a Player may unlock multiple titles but select only one displayed title per
  sport

Examples discussed during discovery are illustrative only and are not approved
names or rules. Progression requires a dedicated product specification,
contract, balancing model, and abuse/migration analysis before implementation.

## KAN-96 Acceptance Criteria

- [x] The MVP keeps exactly one active main sport and one level belonging to it.
- [x] Sport and level selector patterns are approved for small and large catalogs.
- [x] The initial sports and reusable initial scale are defined.
- [x] Dynamic shared and sport-specific level scales are supported by the target model.
- [x] Onboarding and edit interaction flows are documented.
- [x] Default, hover, focus, pressed, selected, and disabled presentation is documented.
- [x] Loading, empty, error, rate-limit, validation, stale, saving, success, and history-restoration states are documented.
- [x] Mobile and desktop behavior and validation widths are documented.
- [x] Keyboard, screen-reader, contrast, zoom, touch-target, and reduced-motion requirements are documented.
- [x] pt-BR visible copy is approved.
- [x] Component reuse and ownership boundaries are defined.
- [x] The current KAN-93/generated-client contract is distinguished from the target contract.
- [x] KAN-94 consumption requirements are explicit.
- [x] Extended profile, multi-sport, badges, trophies, and progression features are out of scope.
- [x] The v0 exploration is classified as non-canonical and no generated prototype code is committed.

## Implementation Gate

KAN-96 is complete as a UX and behavioral-definition task when this document is
reviewed and accepted. Production implementation still depends on:

1. evolving the API contract and compatibility plan
2. persisting reusable scales and Player-sport history
3. regenerating the frontend client from the backend OpenAPI artifact
4. implementing KAN-94 against the delivered contract

These are follow-up deliveries, not unfinished KAN-96 prototype decisions.
