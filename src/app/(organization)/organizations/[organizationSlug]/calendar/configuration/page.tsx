import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationAvailabilityPage() {
  const t = useTranslations("Pages.organization.availability");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={Clock3}
    />
  );
}
