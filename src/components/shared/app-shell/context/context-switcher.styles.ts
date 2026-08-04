import { cn } from "@/lib/utils";

const contextSwitcherStyles = {
  singleContainer: cn(
    "min-w-0 rounded-lg border border-border bg-popover/70 px-3 py-2",
    "text-right supports-backdrop-filter:backdrop-blur-2xl",
  ),
  singleEyebrow: "block text-xs text-muted-foreground",
  singleLabel: "block truncate text-sm font-medium",
  trigger: "h-auto min-w-0 justify-between gap-3 px-3 py-2",
  triggerText: "min-w-0 text-left",
  triggerEyebrow: "block text-xs font-normal text-muted-foreground",
  triggerLabel: "block truncate text-sm font-medium",
  triggerIcon: "size-4",
  sheetContent: "mx-auto max-w-2xl",
  content: "overflow-y-auto px-5 pb-6",
  group: "mt-5 first:mt-0",
  groupTitle:
    "mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase",
  groupOptions: "grid gap-2",
  optionLink: cn(
    "flex min-h-14 items-center gap-3 rounded-lg border border-border",
    "bg-popover/70 px-4 py-3 transition outline-none",
    "supports-backdrop-filter:backdrop-blur-2xl",
    "hover:border-primary/70 hover:bg-accent",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
  ),
  optionAvatar: cn(
    "flex size-9 shrink-0 items-center justify-center rounded-full",
    "bg-secondary text-sm font-semibold text-secondary-foreground",
  ),
  optionBody: "min-w-0 flex-1",
  optionLabel: "block truncate text-sm",
  optionDetail: "block truncate text-xs text-muted-foreground",
  currentIcon: "size-5 text-success",
} as const;

export { contextSwitcherStyles };
