# Shared Prototype Visual Foundation

`sandicts-visual-tokens.css` is generated from the canonical token block in
`src/app/globals.css`.

Rules:

- edit runtime tokens first
- run `npm run visual-system:sync` to update this artifact
- run `npm run visual-system:check` in validation
- keep prototype-specific layout and behavior in each prototype directory
- do not copy the token block into an individual prototype

The app-shell, global-state, sign-in, and future KAN-104 magic-link prototypes
must import this file. Google Fonts are loaded for visual fidelity; the declared
font stacks provide offline fallbacks.
