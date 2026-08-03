import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import type { SeoLocalization } from "./seo-metadata";

async function getSeoLocalization(): Promise<SeoLocalization> {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Metadata",
  });

  return {
    defaultDescription: t("defaultDescription"),
    locale: DEFAULT_LOCALE,
    socialImageAlt: t("socialImageAlt"),
  };
}

export { getSeoLocalization };
