import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusBadgeProps, StatusBadgeTone } from "./status-badge.types";

const badgeVariantByTone: Record<
  StatusBadgeTone,
  ComponentProps<typeof Badge>["variant"]
> = {
  neutral: "outline",
  info: "info",
  success: "success",
  warning: "warning",
  destructive: "destructive",
};

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
      className={cn("gap-1.5", className)}
    >
      {Icon && <Icon aria-hidden="true" />}
      {label}
    </Badge>
  );
}

export { StatusBadge };
