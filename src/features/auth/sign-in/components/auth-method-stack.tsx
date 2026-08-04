"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { signInScreenStyles } from "../sign-in-screen.styles";

type AuthMethodStackProps = Readonly<{
  googleMethod: ReactNode;
  magicLinkMethod?: ReactNode;
}>;

function AuthMethodStack({
  googleMethod,
  magicLinkMethod,
}: AuthMethodStackProps) {
  const t = useTranslations("SignIn.methods");

  return (
    <div className={signInScreenStyles.methodStack}>
      {googleMethod}
      {magicLinkMethod && (
        <>
          <div className={signInScreenStyles.divider}>
            <Separator />
            <span className={signInScreenStyles.dividerLabel}>
              {t("divider")}
            </span>
            <Separator />
          </div>
          {magicLinkMethod}
        </>
      )}
    </div>
  );
}

export { AuthMethodStack };
export type { AuthMethodStackProps };
