import { SignInIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AreaPlaceholder } from "@/components/shared/area-placeholder/area-placeholder";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.signIn",
  });

  return createPrivatePageMetadata({
    description: t("metadataDescription"),
    follow: true,
    title: t("metadataTitle"),
  });
}

export default function SignInPage() {
  const t = useTranslations("Pages.signIn");

  return (
    <AreaPlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={SignInIcon}
    />
  );
}
