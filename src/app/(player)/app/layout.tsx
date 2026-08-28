import { getTranslations } from "next-intl/server";
import { PlayerProtectedLayout } from "@/features/auth/protected-route/player-protected-layout";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.player",
  });

  return createPrivatePageMetadata({
    description: t("metadataDescription"),
    title: t("metadataTitle"),
  });
}

export default function PlayerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PlayerProtectedLayout>{children}</PlayerProtectedLayout>;
}
