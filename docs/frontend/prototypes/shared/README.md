# Shared Prototype Visual Foundation

`sandicts-visual-tokens.css` is generated from the canonical token block in
`src/app/globals.css`.

Prototype SVG sprites are generated from
`scripts/prototype-icon-manifest.mjs` using the installed
`@phosphor-icons/react` package. The generated blocks stay inline so every
prototype remains directly openable through `file://`.

Rules:

- edit runtime tokens first
- run `npm run visual-system:sync` to update this artifact
- run `npm run visual-system:check` in validation
- add or remap prototype icons only in the shared Phosphor manifest
- do not edit generated `visual-system:icons` blocks by hand
- do not use Unicode glyphs as interface-icon placeholders
- keep prototype-specific layout and behavior in each prototype directory
- do not copy the token block into an individual prototype

The app-shell, global-state, sign-in, and KAN-104 magic-link prototypes must
consume this file. Magic link inherits the shared sign-in base stylesheet and
adds only flow-specific CSS. Google Fonts are loaded for visual fidelity; the
declared font stacks provide offline fallbacks.
