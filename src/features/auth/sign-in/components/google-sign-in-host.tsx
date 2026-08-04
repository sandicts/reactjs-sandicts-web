"use client";

import { useTranslations } from "next-intl";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { Skeleton } from "@/components/ui/skeleton";
import { signInScreenStyles } from "../sign-in-screen.styles";

function GoogleSignInHost() {
  const t = useTranslations("SignIn.methods");

  return (
    <div
      className={signInScreenStyles.googleHost}
      data-slot="google-sign-in-host"
    >
      <LoadingRegion label={t("googlePreparing")}>
        <Skeleton className={signInScreenStyles.googleSkeleton} />
      </LoadingRegion>
      <p className={signInScreenStyles.privacy}>{t("privacy")}</p>
    </div>
  );
}

export { GoogleSignInHost };
