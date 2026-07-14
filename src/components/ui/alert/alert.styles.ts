import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5",
    "rounded-lg border px-4 py-3 text-sm",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]",
    "has-[>svg]:gap-x-3 [&>svg]:size-4",
    "[&>svg]:translate-y-0.5 [&>svg]:text-current",
  ],
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        success: [
          "border-success/30 bg-success/10 text-success",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        warning: [
          "border-warning/30 bg-warning/10 text-warning",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        info: [
          "border-info/30 bg-info/10 text-info",
          "*:data-[slot=alert-description]:text-foreground/80",
        ],
        destructive: [
          "border-destructive/30 bg-destructive/10 text-destructive",
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
  title: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
  description: cn(
    "col-start-2 grid justify-items-start gap-1",
    "text-sm text-muted-foreground [&_p]:leading-relaxed",
  ),
} as const;

export { alertStyles, alertVariants };
