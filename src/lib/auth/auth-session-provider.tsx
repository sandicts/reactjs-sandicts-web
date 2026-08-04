"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  publishAuthSessionFailure,
  refreshSandictsAuthSession,
} from "@/lib/api/runtime/sandicts-api-auth";
import {
  getAuthSessionLifecycle,
  markAuthSessionChecking,
  subscribeToAuthSession,
} from "./auth-session-store";
import {
  removeTerminalAuthSessionCache,
  synchronizeAuthSessionCache,
} from "./auth-session-cache";
import type {
  AuthSessionLifecycle,
  AuthSessionProjection,
  AuthSessionRefreshResult,
} from "./auth-session.types";
import { useCurrentAuthSessionQuery } from "./use-current-auth-session-query";

type AuthSessionContextValue = Readonly<{
  lifecycle: AuthSessionLifecycle;
  retrySessionVerification: () => Promise<void>;
}>;

type AuthSessionProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const serverAuthSessionLifecycle = { status: "checking" } as const;
const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

let initialAuthSessionPromise: Promise<AuthSessionRefreshResult> | null = null;

function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const queryClient = useQueryClient();
  const lifecycle = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSessionLifecycle,
    () => serverAuthSessionLifecycle,
  );
  const initialData =
    lifecycle.status === "authenticated"
      ? toProjection(lifecycle)
      : undefined;
  const currentSessionQuery = useCurrentAuthSessionQuery({
    enabled: lifecycle.status === "authenticated",
    initialData,
  });

  const synchronizeResult = useCallback(
    (result: AuthSessionRefreshResult) => {
      if (result.kind === "refreshed") {
        synchronizeAuthSessionCache(queryClient, {
          account: result.snapshot.account,
          session: result.snapshot.session,
        });
      }
    },
    [queryClient],
  );

  useEffect(() => {
    void ensureInitialAuthSession().then(synchronizeResult);
  }, [synchronizeResult]);

  useEffect(() => {
    if (lifecycle.status === "authenticated") {
      synchronizeAuthSessionCache(queryClient, toProjection(lifecycle));
      return;
    }

    if (
      lifecycle.status === "expired" ||
      lifecycle.status === "forbidden" ||
      lifecycle.status === "unauthenticated"
    ) {
      removeTerminalAuthSessionCache(queryClient);
    }
  }, [lifecycle, queryClient]);

  useEffect(() => {
    if (
      lifecycle.status === "authenticated" &&
      currentSessionQuery.isError
    ) {
      publishAuthSessionFailure(currentSessionQuery.error);
    }
  }, [currentSessionQuery.error, currentSessionQuery.isError, lifecycle.status]);

  const retrySessionVerification = useCallback(async () => {
    markAuthSessionChecking();
    const result = await refreshSandictsAuthSession();
    synchronizeResult(result);
  }, [synchronizeResult]);

  const contextValue = useMemo<AuthSessionContextValue>(
    () => ({ lifecycle, retrySessionVerification }),
    [lifecycle, retrySessionVerification],
  );

  return (
    <AuthSessionContext.Provider value={contextValue}>
      {children}
    </AuthSessionContext.Provider>
  );
}

function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider.");
  }

  return context;
}

function useOptionalAuthSession() {
  return useContext(AuthSessionContext);
}

function ensureInitialAuthSession() {
  initialAuthSessionPromise ??= refreshSandictsAuthSession();

  return initialAuthSessionPromise;
}

function resetInitialAuthSession() {
  initialAuthSessionPromise = null;
}

function toProjection(
  lifecycle: Extract<AuthSessionLifecycle, { status: "authenticated" }>,
): AuthSessionProjection {
  return {
    account: lifecycle.account,
    session: lifecycle.session,
  };
}

export {
  AuthSessionProvider,
  resetInitialAuthSession,
  useAuthSession,
  useOptionalAuthSession,
};
