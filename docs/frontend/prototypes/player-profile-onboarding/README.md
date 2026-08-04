---
title: Sandicts Player Profile Onboarding
doc-type: frontend-ux-prototype
role: source-of-truth
priority: high
canonical: docs/frontend/prototypes/player-profile-onboarding/README.md
related:
  - docs/frontend/sandicts-post-login-routing.md
  - docs/frontend/prototypes/player-profile-selectors/README.md
  - docs/frontend/sandicts-mvp-visual-system.md
  - docs/frontend/sandicts-expired-session-experience.md
  - docs/frontend/prototypes/global-states/README.md
  - docs/frontend/sandicts-localization.md
  - KAN-82
  - KAN-93
  - KAN-94
  - KAN-96
  - KAN-139
  - KAN-140
  - KAN-141
  - KAN-144
scope: frontend, ux, prototype, player-profile, onboarding, responsive, accessibility, mvp
read-when:
  - implementing or reviewing first-time Player profile onboarding
  - connecting Player completion to post-login routing
  - implementing the Player profile sport and level selectors
  - reviewing onboarding errors, abandonment, expiry, or resume behavior
do-not-read-when:
  - implementing a public Player profile
  - implementing ranking, gamification, progression, or multiple active sports
  - treating prototype mocks as an implemented API contract
---

# Sandicts Player Profile Onboarding

## Purpose

Record the approved KAN-94 first-time Player profile onboarding and provide an
interactive, isolated implementation reference.

This document is canonical for the onboarding flow, field order, copy, states,
responsive behavior, accessibility, abandonment, success, and routing
handoff. Prototype code is exploratory evidence. Production integration remains
a later task after the dynamic profile contract is delivered.

## Artifact Status And Authority

| Artifact | Status | Authority |
| --- | --- | --- |
| This document | Approved KAN-94 handoff | Canonical for onboarding decisions |
| `/prototypes/player-profile-onboarding` | Interactive mocked prototype | Evidence for behavior, presentation, and QA |
| KAN-82 routing document | Completed | Canonical for Player completion gating and safe continuation |
| KAN-93 and checked-in Orval client | Implemented current contract | Canonical until approved regeneration |
| KAN-96 selector document | Completed | Canonical for sport and level selector behavior |
| KAN-139, KAN-140, and KAN-141 | Not delivered at prototype time | Implementation gate for the dynamic target contract |
| KAN-144 visual foundation at `a8989b1` | Implemented prototype baseline | Canonical for tokens, typography, primitives, and icons |
| Discovery images and earlier generated UI | Reference only | Non-canonical |

KAN-144 replaces the old New York, Geist, Lucide, `0.625rem` radius, and dark
teal/amber foundation. The onboarding uses Radix Nova, Stone/Amber semantic
tokens, IBM Plex Sans, Montserrat, the `0.45rem` radius foundation, and Phosphor
icons.

Historical wording in another prototype cannot reintroduce the old visual
foundation. `docs/frontend/sandicts-mvp-visual-system.md` remains authoritative.

## View The Prototype

From the frontend repository:

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:3001/prototypes/player-profile-onboarding
```

Use the visibly separated `Controlador do protótipo` to select every required
screen and state.

The route:

- is not linked from Public, Player, or Organization navigation
- is marked `noindex, nofollow`
- does not use generated API hooks
- performs no network request
- does not implement authentication or authorization
- does not change the browser URL when it demonstrates routing
- can be removed without changing production Player behavior

## Approved Scope

The MVP onboarding:

- completes one first-time Player profile
- collects `displayName`, one main sport, and one level for that sport
- treats all three values as required
- demonstrates create when a profile is absent and update when it is incomplete
- uses an atomic mocked save
- hands successful completion back to KAN-82 routing

Excluded:

- ranking and game statistics
- gamification, badges, trophies, skill points, or archetypes
- multiple active sports
- public profile
- photo, bio, city, academy, height, age, dominant foot, or preferred side
- full profile editing
- catalog administration
- real backend, authentication, authorization, or API calls

## Approved Decision Log

| ID | Decision | Consequence |
| --- | --- | --- |
| DL-01 | Use one onboarding step at `/app/onboarding`. | No stepper, progress bar, checklist, `Voltar`, or `Avançar`. |
| DL-02 | Use a focused onboarding shell. | Show brand, skip link, central content, and `Sair`; omit Player navigation. |
| DL-03 | Order fields as identification, main sport, then level. | The KAN-96 module follows the basic name field. |
| DL-04 | Show only `displayName`, main sport, and level. | All are required and there are no optional KAN-94 fields. |
| DL-05 | Suggest the account display name for a missing profile. | The suggestion stays editable; saved profile values always win. |
| DL-06 | Use `Continuar` as the only progression action. | Do not add cancel or multi-step navigation controls. |
| DL-07 | Use `Sair` as the explicit abandonment action. | A dirty form requires confirmation before discard. |
| DL-08 | Exit to another authorized context when available, otherwise Public home. | Never admit an incomplete Player to `/app`; keep the session. |
| DL-09 | Do not persist a draft. | Re-entry loads only server-backed values plus the account-name suggestion. |
| DL-10 | Save atomically on `Continuar`. | No autosave, partial save, or optimistic completion. |
| DL-11 | Simulate create for `profile: null` and update for an incomplete profile. | The prototype documents both without calling the API. |
| DL-12 | Keep shell and page heading stable during initial loading. | Profile and catalogs load conceptually in parallel; form-shaped skeletons replace only the form region. |
| DL-13 | Validate on submit and revalidate while correcting. | Focus the first invalid field or group. |
| DL-14 | Trim `displayName` and require 2–80 characters. | Whitespace-only input fails required validation. |
| DL-15 | Put field errors inline and action/service failures near the action. | Use an Alert for business or service failures. |
| DL-16 | Never overwrite automatically on conflict. | Preserve local values and require explicit `Recarregar perfil`. |
| DL-17 | Preserve values on rate limit and avoid a countdown. | A later explicit retry is allowed. |
| DL-18 | Do not replay a command with an unknown network outcome. | `Verificar perfil` performs a mocked read first. |
| DL-19 | Confirmed session expiry discards the draft. | Follow the canonical replace-to-sign-in flow. |
| DL-20 | Use the resolved saved profile as success truth. | Update completion, announce `Perfil salvo.`, and re-check the continuation. |
| DL-21 | Use one sport and one level card per row below `48rem`. | At `48rem`, allow three sport and two level columns. |
| DL-22 | Use cards for one to six sports and a searchable combobox for seven or more. | The large catalog opens in a Sheet below `48rem` and Popover at or above it. |
| DL-23 | Do not preselect a sport or level. | Disable the level group until a sport is selected. |
| DL-24 | Show conventional name, friendly name, and description on level cards. | Respect API order. |
| DL-25 | Mock the approved dynamic target catalog. | Use stable IDs/codes and explicit sport-to-scale relationships. |
| DL-26 | Keep the current and target contracts visibly distinct in documentation. | Do not hand-edit generated KAN-93 types. |
| DL-27 | Exclude extended profile and progression ideas. | They require their own contracts and tasks. |
| DL-28 | Treat accessibility as acceptance, not polish. | Keyboard, focus, live messages, contrast, reflow, target size, and reduced motion are required. |

## Textual Flow

```text
Player destination requested
  -> KAN-82 resolves an authorized Player target
  -> GET /players/me completion is conceptually loaded
     -> complete
        -> resume the authorized destination
     -> missing or incomplete
        -> /app/onboarding
           -> load profile and catalogs in parallel
              -> safe read failure
                 -> replace only the affected region
                 -> explicit retry
              -> ready
                 -> fill display name
                 -> choose one sport
                 -> choose one level from the sport's scale
                 -> Continuar
                    -> invalid
                       -> inline errors
                       -> focus first invalid field/group
                    -> valid
                       -> atomic save
                          -> resolved complete profile
                             -> announce "Perfil salvo."
                             -> re-check safe continuation
                                -> authorized: replace to destination
                                -> absent: replace to /app
                                -> rejected: KAN-82 fallback + neutral feedback
                          -> known failure
                             -> preserve values + explicit retry
                          -> unknown outcome
                             -> preserve values + verify before retry
                          -> conflict
                             -> preserve local values + explicit reload
                          -> rate limit
                             -> preserve values + later explicit retry
                          -> confirmed expiry
                             -> discard draft + replace to sign-in

Sair
  -> clean form
     -> authorized alternate context, otherwise Public home
  -> dirty form
     -> confirmation
        -> Continuar preenchendo
           -> close dialog and restore focus to Sair
        -> Sair sem salvar
           -> discard draft
           -> alternate context or Public home
```

## Screen And State Inventory

The scenario controller implements:

| Group | Scenario | Required result |
| --- | --- | --- |
| Form | Empty | No sport or level default |
| Form | Missing profile | Editable account-name suggestion |
| Form | Incomplete profile | Saved values win; missing value stays required |
| Form | Partial | Name and sport present, level absent |
| Form | Valid | All fields valid and submit enabled |
| Form | Validation | Inline messages and first-error focus |
| Reads | Initial loading | Stable shell and form-shaped skeletons |
| Reads | Profile failure | Form region replaced; safe retry |
| Reads | Sport failure | Identification preserved; selector region replaced |
| Catalog | No sports | Progression blocked |
| Catalog | No levels | Selected sport preserved; progression blocked |
| Catalog | Seven-plus sports | Searchable Sheet or Popover |
| Catalog | Search no results | Distinct no-match message and clear action |
| Command | Saving | Visible locked form and width-preserving pending action |
| Command | Success | Polite success and routing result |
| Command | Known failure | Preserved values and explicit retry |
| Command | Unknown outcome | No replay; explicit verification |
| Command | Conflict | No overwrite; explicit reload |
| Command | Rate limit | Preserved values and no timer |
| Session | Expired | Draft discarded and sign-in recovery |
| Exit | Dirty confirmation | Safe action before destructive discard |
| Routing | Alternate context | Incomplete Player leaves without entering `/app` |
| Routing | Public fallback | Session kept at Public home |
| Routing | Authorized continuation | Safe continuation resumes |
| Routing | Rejected continuation | Neutral feedback and KAN-82 fallback |

## Approved pt-BR Copy

### Page And Identification

| Element | Copy |
| --- | --- |
| Eyebrow | `Primeiros passos` |
| `h1` | `Complete seu perfil` |
| Description | `Conte como você quer ser chamado e qual é o seu momento no esporte.` |
| Required note | `Todos os campos são obrigatórios.` |
| Section | `Sobre você` |
| Label | `Nome de exibição` |
| Help | `É assim que seu nome aparecerá no Sandicts.` |
| Placeholder | `Ex.: Lucas Lima` |

### Sport And Level Module

| Element | Copy |
| --- | --- |
| Eyebrow | `Seu perfil esportivo` |
| Title | `Qual é a sua praia?` |
| Description | `Escolha seu esporte principal e conte como está seu jogo hoje.` |
| Sport legend | `Escolha seu esporte principal` |
| Sport help | `Escolha o esporte que você mais pratica.` |
| Level legend | `Em que nível está seu jogo no {esporte}?` |
| Level help | `É uma autoavaliação — escolha o momento que mais combina com você.` |
| Disabled level | `Escolha primeiro seu esporte para ver os níveis.` |

### Actions And Confirmation

| Element | Copy |
| --- | --- |
| Primary | `Continuar` |
| Pending | `Salvando perfil…` |
| Exit | `Sair` |
| Retry | `Tentar novamente` |
| Verify | `Verificar perfil` |
| Reload | `Recarregar perfil` |
| Dialog title | `Sair sem concluir o perfil?` |
| Dialog description | `As informações preenchidas não serão salvas. Você poderá continuar depois.` |
| Safe dialog action | `Continuar preenchendo` |
| Discard action | `Sair sem salvar` |

### State Copy

- `Carregando seu perfil…`
- `Não foi possível carregar seu perfil. Tente novamente.`
- `Nenhum esporte está disponível no momento.`
- `Não foi possível carregar os esportes. Tente novamente.`
- `Nenhum esporte encontrado para esta busca.`
- `Ainda não há níveis disponíveis para este esporte.`
- `Não foi possível carregar os níveis. Tente novamente.`
- `Não foi possível salvar seu perfil. Revise os dados e tente novamente.`
- `Não foi possível confirmar se o perfil foi salvo. Verifique o perfil antes de tentar novamente.`
- `Seu perfil mudou em outro lugar. Recarregue os dados mais recentes antes de continuar.`
- `Você fez muitas tentativas. Aguarde um pouco e tente novamente.`
- `Perfil salvo.`
- `Não foi possível abrir o destino solicitado.`

Confirmed expiry:

- title: `Sua sessão expirou`
- description:
  `Entre novamente para continuar. Alterações não salvas não foram mantidas.`
- action: `Entrar novamente`

Fixed interface copy lives in the `PlayerProfileOnboardingPrototype`
`next-intl` namespace. Mock sport and level content represents API-managed
pt-BR domain data and therefore remains outside translation keys.

## Responsive Behavior

Below `48rem`:

- compact sticky header
- minimum `1rem` page gutter
- one-column sections
- one sport card per row
- one level card per row
- full-width `Continuar`
- action stays in normal document flow and does not cover the keyboard
- large catalog uses a bottom Sheet
- safe area and virtual keyboard remain usable

At `48rem` and above:

- central content width near `56rem`
- up to three sport columns
- up to two level columns
- large catalog uses a Popover
- primary action aligns to the end

Validate `320px`, `390px`, `768px`, `1440px`, compact landscape, effective
`200%` zoom/reflow, and long Portuguese copy. Page-level horizontal overflow is
not allowed.

## Validation Rules

- Trim `displayName`.
- Require a non-empty display name.
- Require 2–80 characters after trimming.
- Require one active main sport.
- Require one active level belonging to the selected sport's active scale.
- Validate first on submit.
- Revalidate an invalid field while the Player corrects it.
- Focus the first invalid field or radio group.
- Clear the onboarding level when the sport changes.
- Use `aria-invalid` and `aria-describedby`.
- Treat a resolved simulated response, not client optimism, as completion
  authority.

Inline messages:

- `Informe seu nome de exibição.`
- `Use pelo menos 2 caracteres.`
- `Use no máximo 80 caracteres.`
- `Escolha seu esporte principal.`
- `Escolha o nível que mais combina com seu momento.`

## KAN-96 Selector Integration

For one to six active sports:

- use a semantic card RadioGroup
- allow exactly one value
- start with no value during onboarding
- make the full card at least `44px` high

For seven or more:

- search case-insensitively by displayed name
- use a Sheet below `48rem`
- use a Popover at or above `48rem`
- support typing, arrows, Enter, Escape, dismissal, and trigger focus return
- retain the selected name in the closed trigger
- distinguish no search matches from an empty catalog

Levels:

- stay disabled until a sport is selected
- use a semantic card RadioGroup
- display conventional name, friendly name, and self-assessment description
- use API order
- clear an incompatible or unsaved level when sport changes
- never preselect

The prototype mocks:

- Futevôlei
- Beach Tennis
- Vôlei de Praia
- Estreante / Começando
- Iniciante / Em evolução
- Intermediário / Chegando lá
- Avançado / Experiente

Stable IDs, codes, order, active state, and `levelScaleId` relationships own the
mock behavior. Display text and frontend enums do not own relationships.

## Errors, Conflict, Rate Limit, And Unknown Outcome

- Read failures replace only their dependent region and may repeat a safe
  idempotent read.
- A known save failure preserves every form value and allows explicit retry.
- An unknown command outcome never replays automatically.
- `Verificar perfil` simulates a read before another write can occur.
- Conflict preserves the local form and never overwrites automatically.
- `Recarregar perfil` explicitly accepts the latest simulated server values.
- Rate limit preserves form values, provides no countdown, and allows a later
  attempt.
- Field failures are inline; root business and service failures use a nearby
  Alert.
- Forbidden remains distinct from expired and unauthenticated.

## Abandonment And Resume

`Sair` is the only explicit abandonment action.

- A clean form exits directly.
- A dirty form opens an AlertDialog.
- `Continuar preenchendo` is first and safe.
- `Sair sem salvar` is destructive and second.
- Escape closes the dialog.
- Closing returns focus to `Sair`.
- Discard removes the in-memory draft.

No values are saved in URL state, auth state, TanStack Query, Zustand,
`localStorage`, `sessionStorage`, or another browser store. Re-entry reconstructs
the form from saved profile data or the account-name suggestion.

## Expired Session

Confirmed expiry:

1. stops the pending command
2. discards the mounted React Hook Form draft
3. clears private auth state in the future production owner
4. retains only a validated internal route as `returnTo`
5. replace-navigates to sign-in
6. shows the approved persistent expiry notice
7. re-checks authorization after authentication

Network, timeout, or `5xx` verification failure is not proof of expiry. An
unknown command outcome is not retried by the session flow.

## Success And KAN-82 Routing

On resolved save:

1. use the response as saved truth
2. update or invalidate Player completion state
3. announce `Perfil salvo.` politely
4. re-check the safe Player continuation
5. replace-navigate to the authorized continuation
6. use `/app` if no continuation remains
7. use KAN-82 fallback and neutral feedback if the continuation is no longer
   authorized

The prototype demonstrates destinations without real navigation or
authorization. Route text is evidence, not permission.

## Accessibility

- Use `header` and `main` landmarks.
- Provide a skip link.
- Focus the `h1` on route entry without placing the first input first.
- Keep one `h1` and a logical heading hierarchy.
- Keep every label visible.
- Use `fieldset` and `legend` for sport and level.
- Associate help and error text through `aria-describedby`.
- Set `aria-invalid` on invalid controls and groups.
- Let Tab enter each RadioGroup once.
- Use arrow keys and Space according to the RadioGroup pattern.
- Support combobox typing, arrows, Enter, Escape, and focus return.
- Expose pending regions with `aria-busy` and concise status text.
- Hide decorative skeletons from assistive technology.
- Use one concise assertive validation summary for a newly failed submit.
- Announce success politely.
- Focus a newly surfaced conflict, rate limit, or root command failure.
- Trap dialog focus and return it to `Sair`.
- Keep the safe dialog action before discard.
- Keep focus visible with semantic ring tokens.
- Pair status color with text and icons.
- Meet WCAG AA.
- Keep targets at least `44px`.
- Support `200%` reflow and reduced motion.

The prototype does not replace production assistive-technology testing.

## Current KAN-93 Contract Versus Target Contract

The checked-in KAN-93 client currently uses:

- required POST `displayName`
- `mainSportCode`
- `mainSportLevel`
- completion state `missing`, `incomplete`, or `complete`
- the current `beginner`, `intermediate`, and `advanced` level values

It remains authoritative for integrated runtime code.

The KAN-96 target adds:

- normalized sports and reusable level scales
- stable sport, scale, and level IDs/codes
- `levelScaleId` relationships
- managed pt-BR name, friendly name, description, order, and active state
- additive `rookie`
- a stable `mainSportLevelId`
- resolved profile relationships and Player-sport history

The prototype may mock the target because it performs no API integration. A
production task must not pretend those fields exist, hand-edit generated Orval
files, or hard-code catalog display content.

## Prototype Versus Production Limits

The prototype implements:

- interactive React composition
- mocked catalogs and state transitions
- form validation
- focus and keyboard interaction
- responsive Sheet/Popover selection
- loading, error, command, expiry, exit, and routing demonstrations

It does not implement:

- `/app/onboarding`
- protected routing or post-login resolver integration
- real profile reads, creates, or updates
- real session expiry or sign-in
- real context inventory or authorization
- TanStack Query integration
- generated client changes
- analytics or observability
- persistence

## KAN-94 Acceptance Criteria

- [x] One-step onboarding is approved.
- [x] Dedicated focused presentation is approved.
- [x] Required fields and order are explicit.
- [x] Primary and abandonment actions are explicit.
- [x] Mobile and desktop prototypes are available.
- [x] KAN-96 selectors are integrated.
- [x] Loading, validation, saving, success, and failure states are available.
- [x] Conflict, rate limit, unknown outcome, and expiry are available.
- [x] Abandonment and resume rules are documented.
- [x] KAN-82 continuation and fallback are represented.
- [x] Accessibility and focus behavior are documented and prototyped.
- [x] Current and target API contracts are distinguished.
- [x] KAN-144 visual direction is used.
- [x] Implementation tasks can reference one canonical handoff.

## Production Implementation Gate

Do not integrate this prototype into `/app/onboarding` until:

1. KAN-139 delivers the evolved OpenAPI contract and compatibility window.
2. KAN-140 delivers catalog and Player-sport persistence.
3. KAN-141 regenerates the frontend client from the approved backend artifact.
4. The implementation consumes generated types through feature-owned semantic
   adapters.
5. The usable context inventory and last-context owner required by KAN-82 are
   available where the production routing flow needs them.
6. Production tests cover create, incomplete update, completion, errors,
   expiry, safe continuation, and authorization re-check.

Until then, keep this route isolated and removable.
