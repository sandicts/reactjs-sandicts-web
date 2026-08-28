import { queryKeys } from "@/lib/query/query-keys";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthSessionProjection } from "./auth-session.types";

const authSessionMutationKeys = new Set([
  "consumeMagicLinkControllerConsume",
  "googleSignInControllerSignIn",
  "refreshAuthSessionControllerRefresh",
]);

function synchronizeAuthSessionCache(
  queryClient: QueryClient,
  projection: AuthSessionProjection,
) {
  const previousProjection = queryClient.getQueryData<AuthSessionProjection>(
    queryKeys.auth.session(),
  );

  if (
    previousProjection &&
    previousProjection.account.id !== projection.account.id
  ) {
    removePrivateAuthQueries(queryClient);
  }

  queryClient.setQueryData(queryKeys.auth.session(), projection);
}

function removeTerminalAuthSessionCache(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: queryKeys.auth.all() });
  removePrivateAuthQueries(queryClient);
  removeAuthSessionMutations(queryClient);
}

function removePrivateAuthQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: queryKeys.playerProfile.all() });
}

function removeAuthSessionMutations(queryClient: QueryClient) {
  const mutationCache = queryClient.getMutationCache();

  mutationCache.getAll().forEach((mutation) => {
    const mutationName = mutation.options.mutationKey?.[0];

    if (
      typeof mutationName === "string" &&
      authSessionMutationKeys.has(mutationName)
    ) {
      mutationCache.remove(mutation);
    }
  });
}

export {
  removePrivateAuthQueries,
  removeTerminalAuthSessionCache,
  synchronizeAuthSessionCache,
};
