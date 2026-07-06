---
title: Sandicts Frontend Localization
doc-type: frontend-localization-decision
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-localization.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/prototypes/global-states/README.md
  - docs/frontend/sandicts-mobile-navigation.md
scope: frontend, localization, i18n, pt-BR, metadata, accessibility
read-when:
  - adding or changing user-facing frontend copy
  - formatting dates, times, numbers, percentages, or currency
  - implementing metadata, validation, accessibility labels, or global states
  - planning an additional locale or locale-aware URL
do-not-read-when:
  - changing backend-only logs or language-neutral API contracts
---

# Sandicts Frontend Localization

## Purpose

Keep the MVP in Brazilian Portuguese while ensuring future English and Spanish
support can be added without moving every string, changing every route, or
replacing formatting logic.

KAN-126 establishes the implementation boundary. It does not deliver a
multilingual product.

## MVP Locale Contract

- `pt-BR` is the only supported locale.
- `pt-BR` is the active locale and fallback locale.
- Unsupported or missing locale input resolves to `pt-BR`.
- The root document derives `lang` from the active locale configuration.
- Open Graph uses the corresponding `pt_BR` representation.
- The application does not detect browser language or persist a preference.

The canonical configuration lives under `src/i18n/`.

## Library And Runtime Boundary

Use `next-intl` as the message, formatting, and provider integration for the
Next.js App Router.

- `src/i18n/request.ts` owns request-scoped configuration.
- `src/i18n/messages/pt-BR.json` owns current runtime messages.
- `src/i18n/config.ts` owns supported locale and fallback behavior.
- `src/i18n/formats.ts` owns named reusable formats.
- `src/i18n/i18n-client-provider.tsx` exposes messages to interactive Client
  Components.
- `src/i18n/next-intl.d.ts` keeps locale, message keys, and formats typed.

Prefer Server Component translation when a component is not interactive.
Client shells and interactive form components may use the provider. The initial
catalog is intentionally small enough to provide as a whole; split client
message payloads by route or namespace only after measurement shows a need.

## Message Organization

Messages use semantic namespaces such as:

- `Common`
- `Navigation`
- `PublicHome`
- `Pages`
- `Metadata`
- `FormExample`

Feature copy remains feature-owned even when it is stored in the locale
catalog. Do not create one undifferentiated `translations.ts` file or reuse a
message only because two Portuguese strings happen to be identical.

Translate:

- visible interface copy
- metadata titles and descriptions
- validation and safe recovery messages
- empty, loading, error, access, and not-found copy
- accessible names, descriptions, and labels

Do not translate:

- route paths and route identifiers
- API codes, enum values, and database values
- analytics event names
- backend logs and request identifiers
- organization names, player names, and other user-generated content

Features map stable semantic API or domain codes to message keys. They must not
branch on translated message text or persist translated labels as business
state.

## URL Strategy

### MVP

Locale does not appear in URLs.

- Public canonical URLs remain `/`, `/discovery`, and future approved public
  paths.
- Player routes remain under `/app`.
- Organization routes remain under `/organizations/:organizationSlug`.
- No `[locale]` segment, locale proxy, locale redirect, or language switcher is
  added while only `pt-BR` exists.

### Additional Locales

When real translated public pages exist:

- preserve current unprefixed URLs as the default `pt-BR` canonical paths
- add explicit prefixes for non-default public variants, such as `/en` and
  `/es`
- add matching canonical and `hreflang` annotations only for real variants
- keep authenticated route identities stable and resolve locale from a
  validated account preference or locale cookie

The V2 change must coordinate routing, sitemap, canonical URLs, social metadata,
and locale preference ownership in one task.

## Metadata

Metadata copy comes from the same locale catalog as visible copy.

- SEO composition remains owned by `src/lib/seo/`.
- Locale selection and messages remain owned by `src/i18n/`.
- Metadata builders receive localized values instead of importing hardcoded
  Portuguese strings.
- Social image alt text and visible social-image copy use the locale catalog.
- Canonical paths, robots behavior, and sitemap paths remain language-neutral
  until additional public variants exist.

Locale-aware `generateMetadata` is allowed for a statically renderable route.
The production build must confirm that introducing localization does not
accidentally turn current static pages into request-time routes.

## Dates, Times, Numbers, And Currency

Use the named formats in `src/i18n/formats.ts`.

- `shortDate` formats a compact date.
- `time` formats hour and minute.
- `dateTime` combines the representative date and time.
- `decimal` formats ordinary numeric values.
- `percent` formats ratios as percentages.
- `currencyBRL` formats Brazilian reais.

Use `createAppFormatter` outside React and the `next-intl` formatter APIs inside
localized components.

Locale and time zone are separate. Date/time call sites that represent a real
instant must provide the relevant user, organization, or product time zone.
Do not assume `America/Sao_Paulo` as a universal Sandicts domain rule.
The provider uses `UTC` only as a deterministic rendering fallback; it is not a
business time-zone decision and does not replace an explicit time zone at those
call sites.

## Fallback Behavior

- Unsupported locale: use `pt-BR`.
- Missing locale: use `pt-BR`.
- Missing message: render a visible `[Namespace.key]` fallback.
- Missing messages remain developer defects and must be covered by typechecking,
  tests, and review.
- Do not replace a missing translation with an empty string.

The visible fallback preserves the layout and makes catalog defects observable
without crashing a whole route.

## Validation And Testing

Localization changes should cover the appropriate subset of:

- locale resolution and fallback
- typed message lookup
- missing-message fallback
- Server and Client Component rendering
- `html[lang]`
- Open Graph locale and translated metadata
- representative date, time, decimal, percentage, and BRL formatting
- translated validation and accessibility copy
- unchanged canonical URLs and route paths
- production build route classification

Run the complete repository quality, test, build, E2E, and dependency audit
gates before delivery.

## Review Rules

- New runtime copy uses the localization boundary.
- New namespaces describe ownership, not visual placement.
- Shared primitives receive localized labels through props when importing the
  application catalog would couple the primitive to product copy.
- Client Components do not import server-only `next-intl/server` APIs.
- API adapters preserve stable codes and do not compare translated messages.
- A new locale requires its own scoped task; adding an isolated translated
  string does not make a locale supported.

## Explicitly Deferred

- English and Spanish catalogs
- locale switcher
- browser-language negotiation
- account preference persistence
- localized public pathnames
- `hreflang`
- translation management platform
- automated translation
