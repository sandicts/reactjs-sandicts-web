import { Search } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerCourtsPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Explorar"
      title="Descubra quadras e horários."
      description="Busca, filtros e detalhes de quadras serão adicionados na vertical de descoberta."
      Icon={Search}
    />
  );
}
