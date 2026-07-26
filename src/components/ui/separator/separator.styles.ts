import { cn } from "@/lib/utils";

const separatorStyles = {
  root: cn(
    "shrink-0 bg-border",
    "data-horizontal:h-px data-horizontal:w-full",
    "data-vertical:w-px data-vertical:self-stretch",
  ),
} as const;

export { separatorStyles };
