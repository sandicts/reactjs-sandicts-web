"use client";

import {
  ArrowClockwiseIcon,
  HouseIcon,
  ShieldWarningIcon,
  UserCircleCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageState } from "@/components/shared/page-state/page-state";
import { Button } from "@/components/ui/button";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { signInScreenStyles } from "../sign-in-screen.styles";

type AuthSessionStateProps = Readonly<{
  lifecycle: Exclude<
    AuthSessionLifecycle,
    { status: "checking" | "unauthenticated" | "expired" | "forbidden" }
  >;
  onRetry: () => void;
}>;

function AuthSessionState({ lifecycle, onRetry }: AuthSessionStateProps) {
  const t = useTranslations("SignIn.states");

  if (lifecycle.status === "authenticated") {
    return (
      <PageState
        className={signInScreenStyles.pageState}
        headingLevel={2}
        Icon={UserCircleCheckIcon}
        title={t("authenticated.title")}
        description={t("authenticated.description")}
        tone="success"
        primaryAction={
          <Button asChild>
            <Link href={APP_ROUTES.public.home}>
              <HouseIcon aria-hidden="true" />
              {t("authenticated.action")}
            </Link>
          </Button>
        }
      />
    );
  }

  if (lifecycle.status === "recoverable-error") {
    return (
      <PageState
        announcement="polite"
        className={signInScreenStyles.pageState}
        headingLevel={2}
        Icon={WarningCircleIcon}
        title={t("verificationFailed.title")}
        description={
          lifecycle.reason === "rate-limited"
            ? t("rateLimited.description")
            : t("verificationFailed.description")
        }
        tone="warning"
        primaryAction={
          lifecycle.reason === "rate-limited" ? undefined : (
            <Button onClick={onRetry}>
              <ArrowClockwiseIcon aria-hidden="true" />
              {t("verificationFailed.action")}
            </Button>
          )
        }
        secondaryAction={
          <Button asChild variant="outline">
            <Link href={APP_ROUTES.public.home}>
              <HouseIcon aria-hidden="true" />
              {t("publicAction")}
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <PageState
      announcement="polite"
      className={signInScreenStyles.pageState}
      headingLevel={2}
      Icon={ShieldWarningIcon}
      title={t("unavailable.title")}
      description={
        lifecycle.reason === "disabled"
          ? t("disabled.description")
          : t("unavailable.description")
      }
      tone="destructive"
      primaryAction={
        lifecycle.reason === "disabled" ? undefined : (
          <Button onClick={onRetry}>
            <ArrowClockwiseIcon aria-hidden="true" />
            {t("unavailable.action")}
          </Button>
        )
      }
      secondaryAction={
        <Button asChild variant="outline">
          <Link href={APP_ROUTES.public.home}>
            <HouseIcon aria-hidden="true" />
            {t("publicAction")}
          </Link>
        </Button>
      }
    />
  );
}

export { AuthSessionState };
