import { MapPin } from "lucide-react";
import { AreaPlaceholder } from "@/components/area-placeholder";

export default function PlayerPage() {
  return (
    <AreaPlaceholder
      eyebrow="Player area"
      title="Discover courts and open matches."
      description="Player flows will start with discovery, reservation status, open matches, and basic profile completion."
      Icon={MapPin}
    />
  );
}
