import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "group/alert relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5",
    "rounded-lg border px-2.5 py-2 text-left text-sm",
    "has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18",
    "has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2",
    "[&>svg]:row-span-2 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    "[&>svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        success: [
          "border-success-border bg-success-subtle text-success",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        warning: [
          "border-warning-border bg-warning-subtle text-warning",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        info: [
          "border-info-border bg-info-subtle text-info",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        destructive: [
          "border-destructive-border bg-destructive-subtle text-destructive",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const alertStyles = {
  title: cn(
    "col-start-2 line-clamp-1 min-h-4 font-heading font-medium",
    "[&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-foreground",
  ),
  description: cn(
    "col-start-2 grid justify-items-start gap-1",
    "text-sm text-balance text-muted-foreground md:text-pretty",
    "[&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-foreground",
    "[&_p:not(:last-child)]:mb-4",
  ),
  action: "absolute top-2 right-2",
} as const;

export { alertStyles, alertVariants };
