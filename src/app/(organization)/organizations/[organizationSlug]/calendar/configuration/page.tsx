import { Clock3 } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationAvailabilityPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Disponibilidade"
      title="Configure horários e bloqueios."
      description="Abertura recorrente, manutenção e períodos indisponíveis permanecem separados da Agenda."
      Icon={Clock3}
    />
  );
}
