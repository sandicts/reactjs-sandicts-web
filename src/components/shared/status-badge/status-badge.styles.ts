import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge";
import type { StatusBadgeTone } from "./status-badge.types";

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

const statusBadgeStyles = {
  root: "gap-1.5",
} as const;

export { badgeVariantByTone, statusBadgeStyles };
