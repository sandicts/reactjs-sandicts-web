import { cn } from "@/lib/utils";

const inputStyles = {
  root: cn(
    "h-10 w-full min-w-0 rounded-md border border-input bg-transparent",
    "px-3 py-1 text-base shadow-xs transition-[color,box-shadow]",
    "outline-none selection:bg-primary selection:text-primary-foreground",
    "file:inline-flex file:h-8 file:border-0 file:bg-transparent",
    "file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground disabled:pointer-events-none",
    "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  ),
  focus:
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  invalid:
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
} as const;

export { inputStyles };
