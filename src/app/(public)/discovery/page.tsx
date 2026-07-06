import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AreaPlaceholder } from "@/components/shared/area-placeholder/area-placeholder";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { getSeoLocalization } from "@/lib/seo/seo-localization";
import { createPublicPageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const [t, localization] = await Promise.all([
    getTranslations({
      locale: DEFAULT_LOCALE,
      namespace: "Pages.discovery",
    }),
    getSeoLocalization(),
  ]);

  return createPublicPageMetadata(
    {
      canonicalPath: APP_ROUTES.public.discovery,
      description: t("metadataDescription"),
      title: t("metadataTitle"),
    },
    localization,
  );
}

export default function DiscoveryPage() {
  const t = useTranslations("Pages.discovery");

  return (
    <AreaPlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={Search}
    />
  );
}
