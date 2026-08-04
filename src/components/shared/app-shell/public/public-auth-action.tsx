"use client";

import { UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/shared/status-badge/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptionalAuthSession } from "@/lib/auth/auth-session-provider";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { publicShellStyles } from "./public-shell.styles";

function PublicAuthAction() {
  const t = useTranslations("PublicShell");
  const authSession = useOptionalAuthSession();

  if (authSession?.lifecycle.status === "checking") {
    return <Skeleton className={publicShellStyles.authActionSkeleton} />;
  }

  if (authSession?.lifecycle.status === "authenticated") {
    const { account } = authSession.lifecycle;

    return (
      <StatusBadge
        className={publicShellStyles.sessionBadge}
        Icon={UserCircleIcon}
        label={account.displayName ?? account.email}
        tone="success"
      />
    );
  }

  return (
    <Button asChild size="sm">
      <Link href={APP_ROUTES.public.signIn}>{t("signIn")}</Link>
    </Button>
  );
}

export { PublicAuthAction };
