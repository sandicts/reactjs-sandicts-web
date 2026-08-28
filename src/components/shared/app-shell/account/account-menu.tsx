"use client";

import {
  SignOutIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Popover } from "radix-ui";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useOptionalAuthSession } from "@/lib/auth/auth-session-provider";
import type { AuthenticatedAccountSummary } from "@/lib/auth/auth-session.types";
import { accountMenuStyles } from "./account-menu.styles";

function AccountMenu() {
  const authSession = useOptionalAuthSession();

  if (authSession?.lifecycle.status !== "authenticated") {
    return null;
  }

  return <AuthenticatedAccountMenu account={authSession.lifecycle.account} />;
}

function AuthenticatedAccountMenu({
  account,
}: Readonly<{ account: AuthenticatedAccountSummary }>) {
  const t = useTranslations("AccountMenu");
  const signOut = useSignOut();
  const accountLabel = account.displayName?.trim() || account.email;
  const failureMessage =
    signOut.failureReason === "rate-limited"
      ? t("failure.rateLimited")
      : t("failure.unavailable");

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className={accountMenuStyles.trigger}
          aria-label={t("triggerLabel", { account: accountLabel })}
        >
          <UserCircleIcon
            className={accountMenuStyles.triggerIcon}
            aria-hidden="true"
          />
          <span className={accountMenuStyles.triggerLabel}>{accountLabel}</span>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          collisionPadding={16}
          sideOffset={8}
          className={accountMenuStyles.content}
        >
          <div className={accountMenuStyles.accountHeader}>
            <p className={accountMenuStyles.accountEyebrow}>{t("eyebrow")}</p>
            <strong className={accountMenuStyles.accountName}>
              {accountLabel}
            </strong>
            {account.displayName ? (
              <span className={accountMenuStyles.accountEmail}>
                {account.email}
              </span>
            ) : null}
          </div>

          <div className={accountMenuStyles.separator} aria-hidden="true" />

          {signOut.isError ? (
            <p className={accountMenuStyles.error} role="alert">
              {failureMessage}
            </p>
          ) : null}

          <Button
            type="button"
            variant="destructive"
            className={accountMenuStyles.signOut}
            disabled={signOut.isPending}
            onClick={() => signOut.mutate()}
          >
            {signOut.isPending ? (
              <SpinnerGapIcon
                className={accountMenuStyles.pendingIcon}
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <SignOutIcon data-icon="inline-start" aria-hidden="true" />
            )}
            {signOut.isPending ? t("signingOut") : t("signOut")}
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { AccountMenu };
