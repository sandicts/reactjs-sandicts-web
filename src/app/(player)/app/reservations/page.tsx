import { CalendarCheck2 } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerReservationsPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Reservas"
      title="Acompanhe suas reservas."
      description="Listas, detalhes e solicitações de alteração serão implementados nas tarefas de reservas."
      Icon={CalendarCheck2}
    />
  );
}
