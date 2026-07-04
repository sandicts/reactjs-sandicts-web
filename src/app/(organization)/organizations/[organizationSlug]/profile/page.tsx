import { Building2 } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationProfilePage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Perfil da organização"
      title="Mantenha os dados da organização."
      description="Campos e permissões finais serão definidos e implementados pelas tarefas de perfil."
      Icon={Building2}
    />
  );
}
