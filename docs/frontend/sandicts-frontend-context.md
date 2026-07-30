---
title: Sandicts Frontend Context
doc-type: frontend-context
role: source-of-truth
priority: high
canonical: docs/frontend/sandicts-frontend-context.md
related:
  - docs/frontend/sandicts-frontend-tech-decisions.md
  - docs/frontend/sandicts-frontend-planning.md
  - docs/frontend/sandicts-mvp-delivery-roadmap.md
  - docs/frontend/sandicts-mobile-navigation.md
  - docs/frontend/sandicts-page-functional-spec.md
scope: frontend, product-feel, brand, ux, stack, mvp
read-when:
  - starting frontend planning or implementation
  - deciding frontend product feel, brand direction, or UX principles
  - checking the approved frontend stack at a high level
  - creating frontend Jira issues that need product or UX context
do-not-read-when:
  - changing backend-only implementation details
  - reviewing CI, logging, database, or API internals with no frontend impact
---

# Sandicts Frontend Context

This file is canonical for frontend UX direction only. Shared product scope,
entity names, and business rules remain in `sandicts/sandicts-docs`; backend
API contracts remain in `sandicts/nodejs-sandicts-api`.

For delivery timing, Jira structure, frontend start criteria, and fullstack
integration planning, also read `docs/frontend/sandicts-frontend-planning.md`.
For the page inventory, permissions, page rules, and route draft, read
`docs/frontend/sandicts-page-functional-spec.md`.

## Product Feel

Sandicts should feel like a community for committed amateur sand athletes:

- strong tribe identity
- beach lifestyle
- energetic but practical
- focused on finding places, people, games, and tournaments quickly

The product should not feel like a generic booking SaaS or a passive social network.

## Brand

Name: Sandicts

Core idea:

- sand sports addicts
- community, routine, progression, and status

Visual direction:

- stylized `S` mark with transparent, scalable vector geometry
- `SANDICTS` rendered as text in Roboto
- dark background
- Stone neutral surfaces with Amber brand and action emphasis
- energetic contrast
- beach/lifestyle imagery when useful

Brand geometry, the active variant, and brand-specific semantic colors are
centralized by KAN-145. Feature screens consume shared brand primitives rather
than importing or redrawing the mark.

## Frontend Stack Direction

Decided stack:

- Next.js App Router with TypeScript
- shadcn/ui Radix Nova with Tailwind CSS and Phosphor Icons
- TanStack Query for server state
- Zod with React Hook Form for forms
- OpenAPI client generated from the Nest Swagger contract
- Zustand only for local UI state, not API data
- Playwright for E2E tests
- Vitest with Testing Library for components and hooks

The Nest backend remains the API owner for the frontend. Shared product and
business-rule decisions remain in `sandicts/sandicts-docs`.

For detailed frontend architecture decisions, read
`docs/frontend/sandicts-frontend-tech-decisions.md`.

## Main User Experiences

### Player

First screens should prioritize:

- court discovery by simple MVP filters
- available times
- open matches
- basic profile completion
- reservation history and next reservation status

After the MVP, player screens can add:

- nearby courts after geolocation exists
- tournament discovery
- profile progression status

### Organization

Organization screens should prioritize:

- daily agenda
- court availability
- reservation status
- pending and overdue payments
- court setup and pricing

After the MVP, Organization or Academy screens can add:

- students and memberships
- tournament/event creation
- delinquency reports for Academy memberships

## UX Principles

- make availability obvious
- reduce dependence on WhatsApp for operational flows
- make prices and payment state clear
- keep booking and joining flows short
- show social proof without making the MVP depend on complex ranking
- separate player and Organization navigation clearly

The canonical responsive navigation, context-switcher, route-selection, and
navigation accessibility decisions live in
`docs/frontend/sandicts-mobile-navigation.md`.

## MVP Screens

Recommended first frontend scope:

- player home/discovery
- court detail
- reservation flow
- open match list/detail
- player profile
- Organization dashboard
- Organization agenda
- Organization court management
- Organization manual payments view

V2 or later frontend scope:

- Academy coaches, classes, students, and plans
- tournament list/detail
- Organization payments/delinquency for memberships

Avoid early complexity:

- advanced feed algorithms
- full social network
- dense gamification before the booking loop works
- Web3 wallet dependency in the default path
