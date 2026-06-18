"use client";

import { useRefreshAuthSessionControllerRefresh } from "@/lib/api/generated/sandicts-api/auth/auth";
import type { RefreshAuthSessionResponseOutput } from "@/lib/api/generated/sandicts-api/model";
import {
  clearAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";

function useRefreshAuthSession() {
  return useRefreshAuthSessionControllerRefresh({
    mutation: {
      onError: clearAuthSession,
      onSuccess: persistAuthSession,
    },
  });
}

function persistAuthSession(authSession: RefreshAuthSessionResponseOutput) {
  setAuthSession(authSession);
}

export { useRefreshAuthSession };
