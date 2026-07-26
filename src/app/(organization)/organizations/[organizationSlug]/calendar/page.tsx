import { CalendarIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationCalendarPage() {
  const t = useTranslations("Pages.organization.calendar");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={CalendarIcon}
    />
  );
}
