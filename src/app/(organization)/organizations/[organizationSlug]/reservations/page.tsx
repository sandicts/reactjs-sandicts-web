import { CalendarCheck2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationReservationsPage() {
  const t = useTranslations("Pages.organization.reservations");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={CalendarCheck2}
    />
  );
}
