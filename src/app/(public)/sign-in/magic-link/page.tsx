import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { MagicLinkCallbackScreen } from "@/features/auth/sign-in/components/magic-link-callback-screen";
import { signInScreenStyles } from "@/features/auth/sign-in/sign-in-screen.styles";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.signIn",
  });

  return createPrivatePageMetadata({
    description: t("metadataDescription"),
    follow: false,
    title: t("metadataTitle"),
  });
}

export default function MagicLinkCallbackPage() {
  return (
    <main id="shell-main" className={signInScreenStyles.root}>
      <div className={signInScreenStyles.callbackContainer}>
        <Card className={signInScreenStyles.callbackCard}>
          <CardContent>
            <MagicLinkCallbackScreen />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
