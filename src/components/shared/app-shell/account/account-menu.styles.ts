import { cn } from "@/lib/utils";

const accountMenuStyles = {
  trigger: "max-w-44 gap-2 px-2 sm:px-3",
  triggerIcon: "size-5",
  triggerLabel: "hidden max-w-28 truncate sm:inline",
  content: cn(
    "z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border",
    "bg-popover p-3 text-popover-foreground shadow-lg outline-none",
    "data-[state=closed]:animate-out data-[state=open]:animate-in",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  ),
  accountHeader: "min-w-0 px-2 py-1",
  accountEyebrow:
    "text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase",
  accountName: "mt-1 block truncate text-sm font-semibold",
  accountEmail: "block truncate text-xs text-muted-foreground",
  separator: "my-3 h-px bg-border",
  error: cn(
    "mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2",
    "text-sm text-destructive",
  ),
  signOut: "w-full justify-start",
  pendingIcon: "animate-spin",
} as const;

export { accountMenuStyles };
