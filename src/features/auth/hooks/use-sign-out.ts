"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSignOutControllerSignOutCurrentSession } from "@/lib/api/generated/sandicts-api/auth/auth";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { removeTerminalAuthSessionCache } from "@/lib/auth/auth-session-cache";
import { resetInitialAuthSession } from "@/lib/auth/auth-session-provider";
import { clearAuthSession } from "@/lib/auth/auth-session-store";
import { APP_ROUTES } from "@/lib/routes/app-routes";

type SignOutFailureReason = "rate-limited" | "unavailable";

const unauthorizedStatusCode = 401;
const rateLimitedStatusCode = 429;

function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const finalizeSignOut = useCallback(() => {
    resetInitialAuthSession();
    clearAuthSession();
    removeTerminalAuthSessionCache(queryClient);
    router.replace(APP_ROUTES.public.signIn);
  }, [queryClient, router]);

  const mutation = useSignOutControllerSignOutCurrentSession({
    mutation: {
      onSuccess: finalizeSignOut,
      onError: (error) => {
        if (
          isSandictsApiError(error) &&
          error.statusCode === unauthorizedStatusCode
        ) {
          finalizeSignOut();
        }
      },
    },
  });

  return {
    ...mutation,
    failureReason: mutation.isError
      ? classifySignOutFailure(mutation.error)
      : null,
  };
}

function classifySignOutFailure(error: unknown): SignOutFailureReason {
  if (isSandictsApiError(error) && error.statusCode === rateLimitedStatusCode) {
    return "rate-limited";
  }

  return "unavailable";
}

export { useSignOut };
export type { SignOutFailureReason };
