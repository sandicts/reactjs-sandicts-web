import { queryKeys } from "@/lib/query/query-keys";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthSessionProjection } from "./auth-session.types";

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
}

function removePrivateAuthQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: queryKeys.playerProfile.all() });
}

export {
  removePrivateAuthQueries,
  removeTerminalAuthSessionCache,
  synchronizeAuthSessionCache,
};
