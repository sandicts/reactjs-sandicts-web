import { CreditCardIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationPaymentsPage() {
  const t = useTranslations("Pages.organization.payments");

  return (
    <ShellPagePlaceholder
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      Icon={CreditCardIcon}
    />
  );
}
