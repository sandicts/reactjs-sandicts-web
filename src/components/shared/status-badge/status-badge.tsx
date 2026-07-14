import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { badgeVariantByTone, statusBadgeStyles } from "./status-badge.styles";
import type { StatusBadgeProps } from "./status-badge.types";

function StatusBadge({
  className,
  Icon,
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <Badge
      data-slot="status-badge"
      data-tone={tone}
      variant={badgeVariantByTone[tone]}
      className={cn(statusBadgeStyles.root, className)}
    >
      {Icon && <Icon aria-hidden="true" />}
      {label}
    </Badge>
  );
}

export { StatusBadge };
