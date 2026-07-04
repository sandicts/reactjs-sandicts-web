import { CreditCard } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationPaymentsPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Pagamentos"
      title="Acompanhe pagamentos do MVP."
      description="Somente os estados manuais aprovados serão implementados; conciliação e relatórios avançados continuam fora do escopo."
      Icon={CreditCard}
    />
  );
}
