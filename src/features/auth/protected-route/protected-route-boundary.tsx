"use client";

import {
  ArrowClockwiseIcon,
  HouseIcon,
  ShieldWarningIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { PageState } from "@/components/shared/page-state/page-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/lib/auth/auth-session-provider";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { createProtectedRouteSignInHref } from "@/lib/routes/protected-route-redirect";
import { protectedRouteBoundaryStyles } from "./protected-route-boundary.styles";
import type { ProtectedRouteBoundaryProps } from "./protected-route-boundary.types";

function ProtectedRouteBoundary({
  children,
  renderAuthenticatedShell,
  resourceAccess = "allowed",
}: ProtectedRouteBoundaryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const redirectedHrefRef = useRef<string | null>(null);
  const { lifecycle, retrySessionVerification } = useAuthSession();

  useEffect(() => {
    if (lifecycle.status === "authenticated") {
      redirectedHrefRef.current = null;
      return;
    }

    if (
      lifecycle.status !== "unauthenticated" &&
      lifecycle.status !== "expired"
    ) {
      return;
    }

    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const signInHref = createProtectedRouteSignInHref({
      currentLocation,
      sessionExpired: lifecycle.status === "expired",
      webOrigin: new URL(window.location.origin),
    });

    if (redirectedHrefRef.current === signInHref) {
      return;
    }

    redirectedHrefRef.current = signInHref;
    router.replace(signInHref);
  }, [lifecycle.status, pathname, router]);

  if (
    lifecycle.status === "checking" ||
    lifecycle.status === "unauthenticated" ||
    lifecycle.status === "expired"
  ) {
    return <ProtectedRouteLoadingState />;
  }

  if (lifecycle.status === "recoverable-error") {
    return (
      <ProtectedRouteRecoverableState
        lifecycle={lifecycle}
        onRetry={() => void retrySessionVerification()}
      />
    );
  }

  if (lifecycle.status === "api-unavailable") {
    return (
      <ProtectedRouteUnavailableState
        lifecycle={lifecycle}
        onRetry={() => void retrySessionVerification()}
      />
    );
  }

  if (lifecycle.status === "forbidden") {
    return <ProtectedRouteAccountForbiddenState />;
  }

  if (resourceAccess === "checking") {
    return <ProtectedRouteLoadingState authorization />;
  }

  if (resourceAccess === "forbidden") {
    return renderAuthenticatedShell(<ProtectedRouteResourceForbiddenState />);
  }

  return renderAuthenticatedShell(children);
}

function ProtectedRouteLoadingState({
  authorization = false,
}: Readonly<{ authorization?: boolean }>) {
  const t = useTranslations("ProtectedRoute");

  return (
    <main id="shell-main" className={protectedRouteBoundaryStyles.minimalMain}>
      <LoadingRegion
        className={protectedRouteBoundaryStyles.loadingRegion}
        label={
          authorization
            ? t("checkingAuthorizationLabel")
            : t("checkingSessionLabel")
        }
      >
        <Skeleton className={protectedRouteBoundaryStyles.loadingIndicator} />
      </LoadingRegion>
    </main>
  );
}

function ProtectedRouteRecoverableState({
  lifecycle,
  onRetry,
}: Readonly<{
  lifecycle: Extract<AuthSessionLifecycle, { status: "recoverable-error" }>;
  onRetry: () => void;
}>) {
  const t = useTranslations("SignIn.states");

  return (
    <ProtectedRouteMinimalState
      title={t("verificationFailed.title")}
      description={
        lifecycle.reason === "rate-limited"
          ? t("rateLimited.description")
          : t("verificationFailed.description")
      }
      Icon={WarningCircleIcon}
      tone="warning"
      primaryAction={
        <Button type="button" onClick={onRetry}>
          <ArrowClockwiseIcon aria-hidden="true" />
          {t("verificationFailed.action")}
        </Button>
      }
    />
  );
}

function ProtectedRouteUnavailableState({
  lifecycle,
  onRetry,
}: Readonly<{
  lifecycle: Extract<AuthSessionLifecycle, { status: "api-unavailable" }>;
  onRetry: () => void;
}>) {
  const t = useTranslations("SignIn.states");

  return (
    <ProtectedRouteMinimalState
      title={t("unavailable.title")}
      description={
        lifecycle.reason === "disabled"
          ? t("disabled.description")
          : t("unavailable.description")
      }
      Icon={ShieldWarningIcon}
      tone="destructive"
      primaryAction={
        lifecycle.reason === "disabled" ? undefined : (
          <Button type="button" onClick={onRetry}>
            <ArrowClockwiseIcon aria-hidden="true" />
            {t("unavailable.action")}
          </Button>
        )
      }
    />
  );
}

function ProtectedRouteAccountForbiddenState() {
  const t = useTranslations("SignIn.states");

  return (
    <ProtectedRouteMinimalState
      title={t("forbidden.title")}
      description={t("forbidden.description")}
      Icon={ShieldWarningIcon}
      tone="destructive"
    />
  );
}

function ProtectedRouteResourceForbiddenState() {
  const protectedRouteT = useTranslations("ProtectedRoute");
  const signInT = useTranslations("SignIn.states");

  return (
    <PageState
      className={protectedRouteBoundaryStyles.shellPageState}
      description={protectedRouteT("forbidden.description")}
      headingLevel={1}
      Icon={ShieldWarningIcon}
      primaryAction={<PublicHomeAction label={signInT("publicAction")} />}
      title={protectedRouteT("forbidden.title")}
      tone="warning"
    />
  );
}

function ProtectedRouteMinimalState({
  description,
  Icon,
  primaryAction,
  title,
  tone,
}: Pick<
  React.ComponentProps<typeof PageState>,
  "description" | "Icon" | "primaryAction" | "title" | "tone"
>) {
  const t = useTranslations("SignIn.states");

  return (
    <main id="shell-main" className={protectedRouteBoundaryStyles.minimalMain}>
      <PageState
        announcement="polite"
        className={protectedRouteBoundaryStyles.minimalPageState}
        description={description}
        headingLevel={1}
        Icon={Icon}
        primaryAction={primaryAction}
        secondaryAction={<PublicHomeAction label={t("publicAction")} outline />}
        title={title}
        tone={tone}
      />
    </main>
  );
}

function PublicHomeAction({
  label,
  outline = false,
}: Readonly<{ label: string; outline?: boolean }>) {
  return (
    <Button asChild variant={outline ? "outline" : "default"}>
      <Link href={APP_ROUTES.public.home}>
        <HouseIcon aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}

export { ProtectedRouteBoundary };
