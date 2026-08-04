"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/lib/auth/auth-session-provider";
import { signInScreenStyles } from "../sign-in-screen.styles";
import type { SignInSessionSurfaceProps } from "../sign-in-screen.types";
import { AuthMethodStack } from "./auth-method-stack";
import { AuthSessionState } from "./auth-session-state";
import { GoogleSignInHost } from "./google-sign-in-host";

function SignInSessionSurface({
  reason,
  returnTo,
}: SignInSessionSurfaceProps) {
  const t = useTranslations("SignIn");
  const { lifecycle, retrySessionVerification } = useAuthSession();

  if (lifecycle.status === "checking") {
    return (
      <LoadingRegion label={t("states.checking.label")}>
        <div className={signInScreenStyles.loadingSkeletons}>
          <Skeleton className={signInScreenStyles.loadingTitle} />
          <Skeleton className={signInScreenStyles.loadingDescription} />
          <Skeleton className={signInScreenStyles.loadingDescriptionShort} />
          <Skeleton className={signInScreenStyles.googleSkeleton} />
        </div>
      </LoadingRegion>
    );
  }

  if (
    lifecycle.status === "authenticated" ||
    lifecycle.status === "recoverable-error" ||
    lifecycle.status === "api-unavailable"
  ) {
    return (
      <AuthSessionState
        lifecycle={lifecycle}
        onRetry={() => void retrySessionVerification()}
      />
    );
  }

  const showExpiredNotice =
    lifecycle.status === "expired" || reason === "session-expired";
  const showForbiddenNotice = lifecycle.status === "forbidden";

  return (
    <div
      className={signInScreenStyles.sessionSurface}
      data-return-intent={returnTo ? "present" : "absent"}
      data-testid="sign-in-session-surface"
    >
      {showExpiredNotice && (
        <Alert className={signInScreenStyles.sessionAlert} variant="warning">
          <AlertTitle>{t("states.expired.title")}</AlertTitle>
          <AlertDescription>
            {t("states.expired.description")}
          </AlertDescription>
        </Alert>
      )}
      {showForbiddenNotice && (
        <Alert
          aria-live="polite"
          className={signInScreenStyles.sessionAlert}
          variant="destructive"
        >
          <AlertTitle>{t("states.forbidden.title")}</AlertTitle>
          <AlertDescription>
            {t("states.forbidden.description")}
          </AlertDescription>
        </Alert>
      )}
      <AuthMethodStack googleMethod={<GoogleSignInHost />} />
    </div>
  );
}

export { SignInSessionSurface };
