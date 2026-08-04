import type { AppContextKind, AppContextOption } from "./app-context.types";

function getCurrentContext(contexts: readonly AppContextOption[]) {
  return contexts.find((context) => context.current) ?? contexts[0];
}

function getContextsByKind(
  contexts: readonly AppContextOption[],
  kind: AppContextKind,
) {
  return contexts.filter((context) => context.kind === kind);
}

function getContextInitials(label: string) {
  return label.slice(0, 2).toUpperCase();
}

export { getContextInitials, getContextsByKind, getCurrentContext };
