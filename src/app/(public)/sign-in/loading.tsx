import { useTranslations } from "next-intl";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { Skeleton } from "@/components/ui/skeleton";
import { signInScreenStyles } from "@/features/auth/sign-in/sign-in-screen.styles";

export default function SignInLoading() {
  const t = useTranslations("SignIn.states.checking");

  return (
    <main id="shell-main" className={signInScreenStyles.root}>
      <div className={signInScreenStyles.container}>
        <LoadingRegion label={t("pageLabel")}>
          <div className={signInScreenStyles.loadingSkeletons}>
            <Skeleton className={signInScreenStyles.loadingTitle} />
            <Skeleton className={signInScreenStyles.loadingDescription} />
            <Skeleton className={signInScreenStyles.loadingDescriptionShort} />
          </div>
        </LoadingRegion>
        <Skeleton className={signInScreenStyles.loadingSurface} />
      </div>
    </main>
  );
}
