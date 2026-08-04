"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentAuthSessionControllerGetCurrentSession } from "@/lib/api/generated/sandicts-api/auth/auth";
import { queryKeys } from "@/lib/query/query-keys";
import { adaptAuthSessionProjection } from "./auth-session.adapters";
import type { AuthSessionProjection } from "./auth-session.types";

const authSessionStaleTimeMilliseconds = 30_000;

type UseCurrentAuthSessionQueryOptions = Readonly<{
  enabled: boolean;
  initialData?: AuthSessionProjection;
}>;

function useCurrentAuthSessionQuery({
  enabled,
  initialData,
}: UseCurrentAuthSessionQueryOptions) {
  return useQuery<AuthSessionProjection, Error>({
    enabled,
    gcTime: Number.POSITIVE_INFINITY,
    initialData,
    queryFn: async () =>
      adaptAuthSessionProjection(
        await getCurrentAuthSessionControllerGetCurrentSession(),
      ),
    queryKey: queryKeys.auth.session(),
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: authSessionStaleTimeMilliseconds,
  });
}

export { authSessionStaleTimeMilliseconds, useCurrentAuthSessionQuery };
