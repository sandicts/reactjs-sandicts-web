import { CalendarCheck2 } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationReservationsPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Reservas"
      title="Consulte e opere reservas."
      description="Filtros, registros e operações de reserva serão implementados sem misturar configuração de disponibilidade."
      Icon={CalendarCheck2}
    />
  );
}
