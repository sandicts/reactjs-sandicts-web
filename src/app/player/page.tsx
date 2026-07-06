import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.player",
  });

  return createPrivatePageMetadata({
    description: t("redirectMetadataDescription"),
    follow: true,
    title: t("metadataTitle"),
  });
}

export default function PlayerPage() {
  redirect(APP_ROUTES.player.home);
}
