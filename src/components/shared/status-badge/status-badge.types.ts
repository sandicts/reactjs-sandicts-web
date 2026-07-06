import type { LucideIcon } from "lucide-react";

type StatusBadgeTone =
  "neutral" | "info" | "success" | "warning" | "destructive";

type StatusBadgeProps = Readonly<{
  label: string;
  tone?: StatusBadgeTone;
  Icon?: LucideIcon;
  className?: string;
}>;

export type { StatusBadgeProps, StatusBadgeTone };
