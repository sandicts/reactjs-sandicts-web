import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type PageStateTone = "neutral" | "info" | "success" | "warning" | "destructive";

type PageStateAnnouncement = "polite" | "assertive";

type PageStateHeadingLevel = 1 | 2;

type PageStateProps = Readonly<{
  title: ReactNode;
  description: ReactNode;
  headingLevel: PageStateHeadingLevel;
  eyebrow?: ReactNode;
  Icon?: PhosphorIcon;
  tone?: PageStateTone;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  announcement?: PageStateAnnouncement;
  className?: string;
}>;

export type {
  PageStateAnnouncement,
  PageStateHeadingLevel,
  PageStateProps,
  PageStateTone,
};
