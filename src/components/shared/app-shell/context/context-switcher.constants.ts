import type { AppContextKind } from "./app-context.types";

const CONTEXT_KIND_ORDER: readonly AppContextKind[] = [
  "player",
  "organization",
  "academy",
  "admin",
];

export { CONTEXT_KIND_ORDER };
