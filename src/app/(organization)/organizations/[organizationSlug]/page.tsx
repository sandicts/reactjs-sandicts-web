import { LayoutDashboard } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationDashboardPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Painel"
      title="Opere suas quadras com clareza."
      description="Indicadores e atalhos operacionais serão adicionados pelas tarefas de Organization sem duplicar a Agenda."
      Icon={LayoutDashboard}
    />
  );
}
