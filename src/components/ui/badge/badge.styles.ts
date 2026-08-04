import { cva } from "class-variance-authority";

const badgeVariants = cva(
  [
    "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1",
    "overflow-hidden rounded-4xl border border-transparent px-2 py-0.5",
    "text-xs font-medium whitespace-nowrap transition-all",
    "focus-visible:border-ring focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5",
    "has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&>svg]:pointer-events-none [&>svg]:size-3!",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        success:
          "border-success-border bg-success-subtle text-success [a&]:hover:bg-success-subtle/80",
        warning:
          "border-warning-border bg-warning-subtle text-warning [a&]:hover:bg-warning-subtle/80",
        info: "border-info-border bg-info-subtle text-info [a&]:hover:bg-info-subtle/80",
        destructive: [
          "border-destructive-border bg-destructive-subtle text-destructive",
          "focus-visible:ring-destructive/20",
          "dark:focus-visible:ring-destructive/40",
          "[a&]:hover:bg-destructive-subtle/80",
        ],
        outline:
          "border-border text-foreground [a&]:hover:bg-muted [a&]:hover:text-muted-foreground",
        ghost:
          "[a&]:hover:bg-muted [a&]:hover:text-muted-foreground dark:[a&]:hover:bg-muted/50",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export { badgeVariants };
