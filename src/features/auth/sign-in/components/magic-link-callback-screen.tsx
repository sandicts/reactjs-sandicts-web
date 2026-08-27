"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { PageState } from "@/components/shared/page-state/page-state";
import { Button } from "@/components/ui/button";
import { useConsumeMagicLinkControllerConsume } from "@/lib/api/generated/sandicts-api/auth/auth";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { clearGoogleOneTapState } from "@/features/auth/google-one-tap/google-one-tap-storage";
import { persistAuthSession } from "@/features/auth/hooks/auth-session-mutation-handlers";
import { useQueryClient } from "@tanstack/react-query";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { signInScreenStyles } from "../sign-in-screen.styles";

type CallbackState =
  | "expired"
  | "forbidden"
  | "initializing"
  | "invalid"
  | "rateLimited"
  | "routing"
  | "superseded"
  | "used"
  | "verificationFailed"
  | "verifying";

const minimumTokenLength = 32;
const maximumTokenLength = 256;

function MagicLinkCallbackScreen() {
  const t = useTranslations("SignIn.magicLinkCallback");
  const queryClient = useQueryClient();
  const router = useRouter();
  const tokenRef = useRef<string | null>(null);
  const consumeStartedRef = useRef(false);
  const [state, setState] = useState<CallbackState>("initializing");
  const consumeMutation = useConsumeMagicLinkControllerConsume();

  const consume = useCallback(
    async (token: string) => {
      try {
        const authSession = await consumeMutation.mutateAsync({
          data: { token },
        });
        persistAuthSession(queryClient, authSession);
        clearGoogleOneTapState();
        tokenRef.current = null;
        setState("routing");
        router.replace(APP_ROUTES.public.home);
      } catch (error) {
        setState(classifyMagicLinkConsumeFailure(error));
      }
    },
    [consumeMutation, queryClient, router],
  );

  useEffect(() => {
    if (consumeStartedRef.current) {
      return;
    }

    consumeStartedRef.current = true;
    const currentUrl = new URL(window.location.href);
    const tokenValues = currentUrl.searchParams.getAll("token");
    const token = tokenValues.length === 1 ? tokenValues[0]!.trim() : "";

    window.history.replaceState(
      window.history.state,
      "",
      APP_ROUTES.public.magicLinkCallback,
    );

    if (!isPlausibleMagicLinkToken(token)) {
      const invalidStateTimer = window.setTimeout(() => {
        setState("invalid");
      }, 0);

      return () => window.clearTimeout(invalidStateTimer);
    }

    tokenRef.current = token;
    const consumeTimer = window.setTimeout(() => {
      setState("verifying");
      void consume(token);
    }, 0);

    return () => window.clearTimeout(consumeTimer);
  }, [consume]);

  if (state === "initializing") {
    return <div className={signInScreenStyles.loadingSurface} aria-hidden />;
  }

  if (state === "verifying" || state === "routing") {
    return (
      <LoadingRegion label={t(`${state}.label`)}>
        <PageState
          announcement="polite"
          className={signInScreenStyles.pageState}
          description={t(`${state}.description`)}
          headingLevel={1}
          title={t(`${state}.title`)}
          tone={state === "routing" ? "success" : "info"}
        />
      </LoadingRegion>
    );
  }

  const canRetry = state === "verificationFailed";
  const useOtherEmail = state === "forbidden";

  return (
    <PageState
      announcement={state === "forbidden" ? "assertive" : "polite"}
      className={signInScreenStyles.pageState}
      description={t(`${state}.description`)}
      headingLevel={1}
      title={t(`${state}.title`)}
      tone={state === "forbidden" ? "destructive" : "warning"}
      primaryAction={
        canRetry ? (
          <Button
            onClick={() => {
              const retryToken = tokenRef.current;

              if (retryToken) {
                setState("verifying");
                void consume(retryToken);
              }
            }}
          >
            {t("actions.retry")}
          </Button>
        ) : (
          <Button asChild>
            <Link href={APP_ROUTES.public.signIn}>
              {useOtherEmail ? t("actions.otherEmail") : t("actions.newLink")}
            </Link>
          </Button>
        )
      }
      secondaryAction={
        <Button asChild variant="outline">
          <Link href={APP_ROUTES.public.home}>{t("actions.publicHome")}</Link>
        </Button>
      }
    />
  );
}

function isPlausibleMagicLinkToken(token: string) {
  return (
    token.length >= minimumTokenLength && token.length <= maximumTokenLength
  );
}

function classifyMagicLinkConsumeFailure(error: unknown): CallbackState {
  if (!isSandictsApiError(error)) {
    return "verificationFailed";
  }

  if (error.statusCode === 400 || error.statusCode === 401) {
    return "invalid";
  }

  if (error.statusCode === 403) {
    return "forbidden";
  }

  if (error.statusCode === 409) {
    return error.code === "magic_link_superseded" ? "superseded" : "used";
  }

  if (error.statusCode === 410) {
    return "expired";
  }

  if (error.statusCode === 429) {
    return "rateLimited";
  }

  return "verificationFailed";
}

export {
  classifyMagicLinkConsumeFailure,
  isPlausibleMagicLinkToken,
  MagicLinkCallbackScreen,
};
