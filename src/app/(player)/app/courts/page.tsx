import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerCourtsPage() {
  const t = useTranslations("Pages.player.courts");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={Search}
    />
  );
}
