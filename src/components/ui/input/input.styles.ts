import { cn } from "@/lib/utils";

const inputStyles = {
  root: cn(
    "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent",
    "px-2.5 py-1 text-base transition-colors",
    "outline-none selection:bg-primary selection:text-primary-foreground",
    "file:inline-flex file:h-8 file:border-0 file:bg-transparent",
    "file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground disabled:pointer-events-none",
    "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
    "md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
  ),
  focus:
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  invalid: cn(
    "aria-invalid:border-destructive aria-invalid:ring-[3px]",
    "aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50",
    "dark:aria-invalid:ring-destructive/40",
  ),
} as const;

export { inputStyles };
