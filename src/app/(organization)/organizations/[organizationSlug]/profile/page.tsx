import { BuildingsIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationProfilePage() {
  const t = useTranslations("Pages.organization.profile");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={BuildingsIcon}
    />
  );
}
