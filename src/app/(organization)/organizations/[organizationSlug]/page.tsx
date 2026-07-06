import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationDashboardPage() {
  const t = useTranslations("Pages.organization.dashboard");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={LayoutDashboard}
    />
  );
}
