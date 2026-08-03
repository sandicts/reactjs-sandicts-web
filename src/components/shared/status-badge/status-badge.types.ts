import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

type StatusBadgeTone =
  "neutral" | "info" | "success" | "warning" | "destructive";

type StatusBadgeProps = Readonly<{
  label: string;
  tone?: StatusBadgeTone;
  Icon?: PhosphorIcon;
  className?: string;
}>;

export type { StatusBadgeProps, StatusBadgeTone };
