# Frontend Documentation

These files are the canonical Sandicts frontend planning and implementation
docs.

Read them in this order for most frontend work:

1. `sandicts-frontend-context.md`
2. `sandicts-frontend-tech-decisions.md`
3. `sandicts-deployment-environments.md` when configuring deployment,
   environment variables, CORS, cookies, or deployed authentication
4. `sandicts-react-component-structure.md` when creating or refactoring React
   components
5. `sandicts-react-component-migration-map.md` when planning component
   structure refactor PRs
6. `sandicts-localization.md` when adding user-facing copy, formatting
   locale-sensitive values, or planning locale-aware routes
7. `sandicts-expired-session-experience.md` when implementing protected routes
   or distinguishing expired, unauthenticated, verification-failed, and
   forbidden auth states
8. `sandicts-post-login-routing.md` when implementing successful sign-in,
   passive session refresh, safe `returnTo`, context fallback, or Player
   profile completion
9. `sandicts-google-one-tap-experience.md` when implementing Google One Tap,
   changing route access classifications, or reviewing provider suppression
10. `sandicts-local-ui-state.md` when deciding state ownership or introducing
   Zustand
11. `sandicts-mobile-navigation.md` when deciding app-shell navigation or the
   context switcher
12. `prototypes/app-shells/README.md` when implementing or reviewing the first
    public, Player, or Organization shell direction
13. `prototypes/global-states/README.md` when implementing or reviewing
    loading, empty, error, unauthenticated, forbidden, or not-found UI
14. `prototypes/player-profile-selectors/README.md` when implementing or
    reviewing the Player profile main-sport and level selectors
15. `prototypes/player-profile-onboarding/README.md` when implementing or
    reviewing first-time Player profile onboarding, abandonment, validation,
    or post-completion routing
16. `prototypes/auth-sign-in/README.md` when implementing or reviewing sign-in,
    Google One Tap fallback, expired-session feedback, or auth failure UI
17. `prototypes/auth-magic-link/README.md` when implementing or reviewing
    magic-link email entry, request, resend, verification, or recovery UI
18. `prototypes/shared/README.md` when changing runtime visual tokens or adding
    a static prototype
19. `sandicts-frontend-planning.md`
20. `sandicts-mvp-delivery-roadmap.md`
21. `sandicts-page-functional-spec.md` when page behavior, routes, permissions,
    or user flows matter
22. `sandicts-mvp-screens-spec.md` only for detailed screen-state work

Files under `discovery/` are historical inputs. Use them for comparison or
audit work, then prefer the current docs above for decisions.
