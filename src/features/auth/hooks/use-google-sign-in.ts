"use client";

import { useGoogleSignInControllerSignIn } from "@/lib/api/generated/sandicts-api/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import { clearGoogleOneTapState } from "@/features/auth/google-one-tap/google-one-tap-storage";
import { persistAuthSession } from "./auth-session-mutation-handlers";

function useGoogleSignIn() {
  const queryClient = useQueryClient();

  return useGoogleSignInControllerSignIn({
    mutation: {
      onSuccess: (authSession) => {
        persistAuthSession(queryClient, authSession);
        clearGoogleOneTapState();
      },
    },
  });
}

export { useGoogleSignIn };
