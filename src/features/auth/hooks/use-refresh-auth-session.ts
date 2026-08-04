"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshSandictsAuthSession } from "@/lib/api/runtime/sandicts-api-auth";
import {
  removeTerminalAuthSessionCache,
  synchronizeAuthSessionCache,
} from "@/lib/auth/auth-session-cache";
import { markAuthSessionChecking } from "@/lib/auth/auth-session-store";

function useRefreshAuthSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSandictsAuthSession,
    onMutate: markAuthSessionChecking,
    onSuccess: (result) => {
      if (result.kind === "refreshed") {
        synchronizeAuthSessionCache(queryClient, {
          account: result.snapshot.account,
          session: result.snapshot.session,
        });
      } else if (result.kind === "rejected" || result.kind === "forbidden") {
        removeTerminalAuthSessionCache(queryClient);
      }
    },
  });
}

export { useRefreshAuthSession };
