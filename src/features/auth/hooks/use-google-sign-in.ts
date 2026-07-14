"use client";

import { useGoogleSignInControllerSignIn } from "@/lib/api/generated/sandicts-api/auth/auth";
import {
  clearPersistedAuthSession,
  persistGoogleSignInSession,
} from "./auth-session-mutation-handlers";

function useGoogleSignIn() {
  return useGoogleSignInControllerSignIn({
    mutation: {
      onError: clearPersistedAuthSession,
      onSuccess: persistGoogleSignInSession,
    },
  });
}

export { useGoogleSignIn };
