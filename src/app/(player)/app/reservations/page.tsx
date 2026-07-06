import { CalendarCheck2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerReservationsPage() {
  const t = useTranslations("Pages.player.reservations");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={CalendarCheck2}
    />
  );
}
