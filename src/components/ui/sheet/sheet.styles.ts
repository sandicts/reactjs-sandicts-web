import type { SheetSide } from "./sheet.types";
import { cn } from "@/lib/utils";

const sheetContentSideClasses: Record<SheetSide, string> = {
  right: cn(
    "inset-y-0 right-0 h-full w-[min(24rem,90vw)] border-l",
    "data-[state=closed]:slide-out-to-right",
    "data-[state=open]:slide-in-from-right",
  ),
  left: cn(
    "inset-y-0 left-0 h-full w-[min(24rem,90vw)] border-r",
    "data-[state=closed]:slide-out-to-left",
    "data-[state=open]:slide-in-from-left",
  ),
  top: cn(
    "inset-x-0 top-0 max-h-[90vh] border-b",
    "data-[state=closed]:slide-out-to-top",
    "data-[state=open]:slide-in-from-top",
  ),
  bottom: cn(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl border-t",
    "pb-[env(safe-area-inset-bottom)]",
    "data-[state=closed]:slide-out-to-bottom",
    "data-[state=open]:slide-in-from-bottom",
  ),
};

const sheetStyles = {
  overlay: cn(
    "fixed inset-0 z-50 bg-black/70 backdrop-blur-xs",
    "data-[state=closed]:animate-out data-[state=open]:animate-in",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ),
  content: cn(
    "fixed z-50 flex flex-col gap-4 border-border bg-background",
    "shadow-2xl transition ease-in-out",
    "data-[state=closed]:duration-200 data-[state=open]:duration-300",
  ),
  closeButton: cn(
    "absolute top-4 right-4 inline-flex size-11 items-center justify-center",
    "rounded-md text-muted-foreground transition",
    "hover:bg-accent hover:text-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "focus-visible:outline-none disabled:pointer-events-none",
  ),
  closeIcon: "size-5",
  header: "flex flex-col gap-1.5 p-5 pr-16",
  footer: "mt-auto flex flex-col gap-2 border-t p-5",
  title: "text-lg font-semibold text-foreground",
  description: "text-sm leading-6 text-muted-foreground",
} as const;

export { sheetContentSideClasses, sheetStyles };
