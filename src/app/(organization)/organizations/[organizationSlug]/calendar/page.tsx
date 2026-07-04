import { CalendarRange } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function OrganizationCalendarPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Agenda"
      title="Visualize quadras por horário."
      description="A grade operacional por quadra e horário será implementada na tarefa dedicada de Agenda."
      Icon={CalendarRange}
    />
  );
}
