"use client";

import { useRefreshAuthSessionControllerRefresh } from "@/lib/api/generated/sandicts-api/auth/auth";
import {
  clearPersistedAuthSession,
  persistRefreshAuthSession,
} from "./auth-session-mutation-handlers";

function useRefreshAuthSession() {
  return useRefreshAuthSessionControllerRefresh({
    mutation: {
      onError: clearPersistedAuthSession,
      onSuccess: persistRefreshAuthSession,
    },
  });
}

export { useRefreshAuthSession };
