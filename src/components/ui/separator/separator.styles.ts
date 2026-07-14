import { cn } from "@/lib/utils";

const separatorStyles = {
  root: cn(
    "shrink-0 bg-border",
    "data-[orientation=horizontal]:h-px",
    "data-[orientation=horizontal]:w-full",
    "data-[orientation=vertical]:h-full",
    "data-[orientation=vertical]:w-px",
  ),
} as const;

export { separatorStyles };
