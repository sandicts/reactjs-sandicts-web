import { cn } from "@/lib/utils";

const publicHomeScreenStyles = {
  root: "min-h-[calc(100vh-4.5rem)]",
  container: cn(
    "mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl content-center",
    "gap-10 px-5 py-12 sm:px-8",
    "lg:grid-cols-[minmax(0,1fr)_26rem]",
  ),
  hero: "flex max-w-3xl flex-col justify-center",
  badge: "mb-4 w-fit gap-2 px-3 py-2 text-sm text-muted-foreground",
  badgeIcon: "text-primary",
  title:
    "max-w-3xl text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl",
  description: "mt-6 max-w-2xl text-lg leading-8 text-muted-foreground",
  actionsGrid: "mt-8 grid gap-3 sm:grid-cols-3",
  actionCard: {
    root: cn(
      "group rounded-xl bg-card p-4 ring-1 ring-foreground/10",
      "transition outline-none hover:ring-primary",
      "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    ),
    iconContainer:
      "mb-5 flex size-10 items-center justify-center rounded-lg bg-secondary text-success",
    icon: "size-5",
    headingRow: "flex items-center justify-between gap-3",
    heading: "text-base font-semibold",
    arrow: "size-4 text-muted-foreground transition group-hover:text-primary",
    detail: "mt-2 text-sm leading-6 text-muted-foreground",
  },
  statusCardAside: "self-center",
  statusCard: {
    root: "gap-0 overflow-hidden py-0",
    header:
      "grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border/70 p-5",
    eyebrow: "text-sm text-muted-foreground",
    title: "mt-1 text-2xl font-semibold",
    icon: "size-7 text-success",
    content: "space-y-4 p-5",
  },
  signalRow: {
    root: "flex items-start justify-between gap-4 rounded-lg border border-border/70 p-4",
    label: "text-sm text-muted-foreground",
    value: "max-w-52 text-right text-sm leading-6 font-medium",
  },
} as const;

export { publicHomeScreenStyles };
