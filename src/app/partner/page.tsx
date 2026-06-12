import { CalendarDays } from "lucide-react";
import { AreaPlaceholder } from "@/components/area-placeholder";

export default function PartnerPage() {
  return (
    <AreaPlaceholder
      eyebrow="Partner area"
      title="Operate courts from the agenda."
      description="Partner flows will focus on availability, reservations, manual payment state, and court setup."
      Icon={CalendarDays}
    />
  );
}
