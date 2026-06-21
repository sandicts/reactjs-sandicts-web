import { CalendarDays } from "lucide-react";
import { AreaPlaceholder } from "@/components/area-placeholder";

export default function OrganizationPage() {
  return (
    <AreaPlaceholder
      eyebrow="Organization area"
      title="Operate courts from the agenda."
      description="Organization flows will focus on availability, reservations, manual payment state, and court setup."
      Icon={CalendarDays}
    />
  );
}
