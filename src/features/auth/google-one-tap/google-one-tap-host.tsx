"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGoogleSignIn } from "@/features/auth/hooks/use-google-sign-in";
import { useAuthSession } from "@/lib/auth/auth-session-provider";
import { publicEnv } from "@/lib/env/public-env";
import {
  activateGoogleCredentialFlow,
  ensureGoogleIdentityInitialized,
  registerGoogleCredentialHandler,
} from "@/lib/google-identity/google-identity-client";
import { loadGoogleIdentityScript } from "@/lib/google-identity/google-identity-script";
import type {
  GoogleCredentialResponse,
  GoogleIdentityServices,
} from "@/lib/google-identity/google-identity.types";
import { isGoogleOneTapEligibleRoute } from "@/lib/routes/route-access-policy";
import { isGoogleOneTapPlatformSupported } from "./google-one-tap-platform";
import {
  clearGoogleOneTapState,
  hasGoogleOneTapAttempted,
  hasGoogleOneTapSuppression,
  markGoogleOneTapAttempted,
  suppressGoogleOneTap,
} from "./google-one-tap-storage";
import type { GoogleOneTapSuppressionReason } from "./google-one-tap-storage";

type ActivePrompt = Readonly<{
  services: GoogleIdentityServices;
  unregisterCredentialHandler: () => void;
}>;

function GoogleOneTapHost() {
  const pathname = usePathname();
  const { lifecycle } = useAuthSession();
  const { mutate } = useGoogleSignIn();
  const activePromptRef = useRef<ActivePrompt | null>(null);
  const exchangePendingRef = useRef(false);

  const finishPrompt = useCallback(
    (options: {
      cancel?: boolean;
      clear?: boolean;
      suppressionReason?: GoogleOneTapSuppressionReason;
    }) => {
      const activePrompt = activePromptRef.current;

      activePromptRef.current = null;
      exchangePendingRef.current = false;

      if (options.clear) {
        clearGoogleOneTapState();
      } else if (options.suppressionReason) {
        suppressGoogleOneTap(options.suppressionReason);
      }

      if (!activePrompt) {
        return;
      }

      activePrompt.unregisterCredentialHandler();

      if (options.cancel) {
        activePrompt.services.accounts.id.cancel();
      }
    },
    [],
  );

  const handleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      const credential = response.credential?.trim();

      if (!credential || exchangePendingRef.current) {
        if (!credential) {
          finishPrompt({ suppressionReason: "credential-exchange-failed" });
        }
        return;
      }

      exchangePendingRef.current = true;
      mutate(
        { data: { credential } },
        {
          onError: () => {
            finishPrompt({ suppressionReason: "credential-exchange-failed" });
          },
          onSuccess: () => {
            finishPrompt({ clear: true });
          },
        },
      );
    },
    [finishPrompt, mutate],
  );

  const canAttemptOneTap =
    publicEnv.authEnabled &&
    publicEnv.googleOneTapEnabled &&
    Boolean(publicEnv.googleClientId) &&
    isGoogleOneTapEligibleRoute(pathname) &&
    (lifecycle.status === "unauthenticated" || lifecycle.status === "expired");

  useEffect(() => {
    if (!canAttemptOneTap) {
      if (activePromptRef.current) {
        const authenticated = lifecycle.status === "authenticated";

        finishPrompt({
          cancel: true,
          clear: authenticated,
          suppressionReason: authenticated
            ? undefined
            : "application-cancelled",
        });
      }
      return;
    }

    if (
      !isGoogleOneTapPlatformSupported() ||
      hasGoogleOneTapAttempted() ||
      hasGoogleOneTapSuppression()
    ) {
      return;
    }

    const clientId = publicEnv.googleClientId;

    if (!clientId) {
      return;
    }

    let active = true;

    void loadGoogleIdentityScript()
      .then((services) => {
        if (!active) {
          return;
        }

        markGoogleOneTapAttempted();

        const unregisterCredentialHandler = registerGoogleCredentialHandler(
          "one-tap",
          handleCredential,
        );

        ensureGoogleIdentityInitialized(services, clientId);
        activateGoogleCredentialFlow("one-tap");
        suppressGoogleOneTap("automatic-prompt-attempted");

        const activePrompt = { services, unregisterCredentialHandler };

        activePromptRef.current = activePrompt;
        services.accounts.id.prompt();
      })
      .catch(() => {
        if (active) {
          markGoogleOneTapAttempted();
        }
      });

    return () => {
      active = false;
    };
  }, [canAttemptOneTap, finishPrompt, handleCredential, lifecycle.status]);

  return null;
}

export { GoogleOneTapHost };
