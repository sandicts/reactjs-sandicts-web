import { MapPin } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationCourtsPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Quadras"
      title="Gerencie suas quadras."
      description="Cadastro, edição e detalhes das quadras serão entregues na vertical operacional correspondente."
      Icon={MapPin}
    />
  );
}
