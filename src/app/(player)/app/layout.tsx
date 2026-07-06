import { PlayerShell } from "@/components/shared/app-shell/player/player-shell";
import { getTranslations } from "next-intl/server";
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
  return <PlayerShell>{children}</PlayerShell>;
}
