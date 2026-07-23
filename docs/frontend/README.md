# Frontend Documentation

These files are the canonical Sandicts frontend planning and implementation
docs.

Read them in this order for most frontend work:

1. `sandicts-frontend-context.md`
2. `sandicts-frontend-tech-decisions.md`
3. `sandicts-react-component-structure.md` when creating or refactoring React
   components
4. `sandicts-react-component-migration-map.md` when planning component
   structure refactor PRs
5. `sandicts-localization.md` when adding user-facing copy, formatting
   locale-sensitive values, or planning locale-aware routes
6. `sandicts-expired-session-experience.md` when implementing protected routes
   or distinguishing expired, unauthenticated, verification-failed, and
   forbidden auth states
7. `sandicts-google-one-tap-experience.md` when implementing Google One Tap,
   changing route access classifications, or reviewing provider suppression
8. `sandicts-local-ui-state.md` when deciding state ownership or introducing
   Zustand
9. `sandicts-mobile-navigation.md` when deciding app-shell navigation or the
   context switcher
10. `prototypes/app-shells/README.md` when implementing or reviewing the first
   public, Player, or Organization shell direction
11. `prototypes/global-states/README.md` when implementing or reviewing
   loading, empty, error, unauthenticated, forbidden, or not-found UI
12. `sandicts-frontend-planning.md`
13. `sandicts-mvp-delivery-roadmap.md`
14. `sandicts-page-functional-spec.md` when page behavior, routes, permissions,
   or user flows matter
15. `sandicts-mvp-screens-spec.md` only for detailed screen-state work

Files under `discovery/` are historical inputs. Use them for comparison or
audit work, then prefer the current docs above for decisions.
