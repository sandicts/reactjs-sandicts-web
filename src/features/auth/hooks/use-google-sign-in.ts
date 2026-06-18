"use client";

import { useGoogleSignInControllerSignIn } from "@/lib/api/generated/sandicts-api/auth/auth";
import type { GoogleSignInResponseOutput } from "@/lib/api/generated/sandicts-api/model";
import {
  clearAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";

function useGoogleSignIn() {
  return useGoogleSignInControllerSignIn({
    mutation: {
      onError: clearAuthSession,
      onSuccess: persistAuthSession,
    },
  });
}

function persistAuthSession(authSession: GoogleSignInResponseOutput) {
  setAuthSession(authSession);
}

export { useGoogleSignIn };
