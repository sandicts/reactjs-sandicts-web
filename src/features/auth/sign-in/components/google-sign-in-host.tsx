"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleSignIn } from "@/features/auth/hooks/use-google-sign-in";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { publicEnv } from "@/lib/env/public-env";
import { loadGoogleIdentityScript } from "@/lib/google-identity/google-identity-script";
import type { GoogleCredentialResponse } from "@/lib/google-identity/google-identity.types";
import { cn } from "@/lib/utils";
import { signInScreenStyles } from "../sign-in-screen.styles";

type GoogleProviderStatus =
  "load-error" | "loading" | "missing-configuration" | "ready";

const defaultGoogleButtonWidth = 320;
const maximumGoogleButtonWidth = 400;
const minimumGoogleButtonWidth = 200;

function GoogleSignInHost() {
  const t = useTranslations("SignIn.methods");
  const clientId = publicEnv.googleClientId;
  const googleButtonHostRef = useRef<HTMLDivElement>(null);
  const [credentialFailure, setCredentialFailure] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [providerStatus, setProviderStatus] = useState<GoogleProviderStatus>(
    publicEnv.googleClientId ? "loading" : "missing-configuration",
  );
  const { error, isError, isPending, mutate, reset } = useGoogleSignIn();

  const clearInteractionFailure = useCallback(() => {
    setCredentialFailure(false);
    reset();
  }, [reset]);

  const handleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      const credential = response.credential?.trim();

      clearInteractionFailure();

      if (!credential) {
        setCredentialFailure(true);
        return;
      }

      mutate({ data: { credential } });
    },
    [clearInteractionFailure, mutate],
  );

  useEffect(() => {
    if (!clientId) {
      return;
    }

    let active = true;

    void loadGoogleIdentityScript()
      .then((googleIdentity) => {
        if (!active) {
          return;
        }

        const buttonHost = googleButtonHostRef.current;

        if (!buttonHost) {
          throw new Error("Google Sign-In button host is unavailable.");
        }

        googleIdentity.accounts.id.initialize({
          auto_select: false,
          callback: handleCredential,
          client_id: clientId,
          ux_mode: "popup",
        });

        buttonHost.replaceChildren();
        googleIdentity.accounts.id.renderButton(buttonHost, {
          click_listener: clearInteractionFailure,
          locale: "pt_BR",
          logo_alignment: "left",
          shape: "rectangular",
          size: "large",
          text: "continue_with",
          theme: "outline",
          type: "standard",
          width: resolveGoogleButtonWidth(buttonHost),
        });
        setProviderStatus("ready");
      })
      .catch(() => {
        if (active) {
          setProviderStatus("load-error");
        }
      });

    return () => {
      active = false;
    };
  }, [clearInteractionFailure, clientId, handleCredential, loadAttempt]);

  const retryProviderLoad = () => {
    clearInteractionFailure();
    setProviderStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
  };

  const interactionFailure = credentialFailure || isError;

  return (
    <div
      className={signInScreenStyles.googleHost}
      data-slot="google-sign-in-host"
    >
      {providerStatus === "loading" && (
        <LoadingRegion label={t("googlePreparing")}>
          <Skeleton className={signInScreenStyles.googleSkeleton} />
        </LoadingRegion>
      )}

      <div
        ref={googleButtonHostRef}
        aria-busy={isPending}
        className={cn(
          signInScreenStyles.googleButtonHost,
          providerStatus !== "ready" && "hidden",
          isPending && signInScreenStyles.googleButtonPending,
        )}
        data-testid="google-sign-in-button-host"
      />

      {providerStatus === "missing-configuration" && (
        <GoogleProviderAlert
          description={t("googleUnavailable.missingConfiguration")}
          title={t("googleUnavailable.title")}
        />
      )}

      {providerStatus === "load-error" && (
        <GoogleProviderAlert
          action={
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={retryProviderLoad}
            >
              {t("googleUnavailable.retry")}
            </Button>
          }
          description={t("googleUnavailable.loadFailure")}
          title={t("googleUnavailable.title")}
        />
      )}

      {isPending && (
        <p aria-live="polite" className={signInScreenStyles.googleStatus}>
          {t("googleSigningIn")}
        </p>
      )}

      {interactionFailure && !isPending && (
        <Alert role="alert" variant="destructive">
          <AlertTitle>{t("googleFailure.title")}</AlertTitle>
          <AlertDescription>
            {resolveGoogleFailureDescription({
              credentialFailure,
              error,
              translate: t,
            })}
          </AlertDescription>
        </Alert>
      )}

      <p className={signInScreenStyles.privacy}>{t("privacy")}</p>
    </div>
  );
}

type GoogleProviderAlertProps = Readonly<{
  action?: React.ReactNode;
  description: string;
  title: string;
}>;

function GoogleProviderAlert({
  action,
  description,
  title,
}: GoogleProviderAlertProps) {
  return (
    <Alert role="alert" variant="warning">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {action}
      </AlertDescription>
    </Alert>
  );
}

type GoogleFailureTranslationKey =
  | "googleFailure.forbidden"
  | "googleFailure.generic"
  | "googleFailure.invalidCredential"
  | "googleFailure.rateLimited"
  | "googleFailure.rejected";

type GoogleFailureDescriptionInput = Readonly<{
  credentialFailure: boolean;
  error: unknown;
  translate: (key: GoogleFailureTranslationKey) => string;
}>;

function resolveGoogleFailureDescription({
  credentialFailure,
  error,
  translate,
}: GoogleFailureDescriptionInput) {
  if (credentialFailure) {
    return translate("googleFailure.invalidCredential");
  }

  if (!isSandictsApiError(error)) {
    return translate("googleFailure.generic");
  }

  if (error.statusCode === 429) {
    return translate("googleFailure.rateLimited");
  }

  if (error.statusCode === 400 || error.statusCode === 401) {
    return translate("googleFailure.rejected");
  }

  if (error.statusCode === 403) {
    return translate("googleFailure.forbidden");
  }

  return translate("googleFailure.generic");
}

function resolveGoogleButtonWidth(buttonHost: HTMLElement) {
  const measuredWidth = Math.floor(buttonHost.getBoundingClientRect().width);
  const candidateWidth = measuredWidth || defaultGoogleButtonWidth;

  return Math.min(
    maximumGoogleButtonWidth,
    Math.max(minimumGoogleButtonWidth, candidateWidth),
  ).toString();
}

export { GoogleSignInHost };
