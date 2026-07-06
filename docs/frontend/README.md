# Frontend Documentation

These files are the canonical Sandicts frontend planning and implementation
docs.

Read them in this order for most frontend work:

1. `sandicts-frontend-context.md`
2. `sandicts-frontend-tech-decisions.md`
3. `sandicts-localization.md` when adding user-facing copy, formatting
   locale-sensitive values, or planning locale-aware routes
4. `sandicts-local-ui-state.md` when deciding state ownership or introducing
   Zustand
5. `sandicts-mobile-navigation.md` when deciding app-shell navigation or the
   context switcher
6. `prototypes/app-shells/README.md` when implementing or reviewing the first
   public, Player, or Organization shell direction
7. `prototypes/global-states/README.md` when implementing or reviewing
   loading, empty, error, unauthenticated, forbidden, or not-found UI
8. `sandicts-frontend-planning.md`
9. `sandicts-mvp-delivery-roadmap.md`
10. `sandicts-page-functional-spec.md` when page behavior, routes, permissions,
   or user flows matter
11. `sandicts-mvp-screens-spec.md` only for detailed screen-state work

Files under `discovery/` are historical inputs. Use them for comparison or
audit work, then prefer the current docs above for decisions.
