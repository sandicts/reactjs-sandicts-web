import { cva } from "class-variance-authority";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1",
    "overflow-hidden rounded-full border border-transparent px-2 py-0.5",
    "text-xs font-medium whitespace-nowrap transition-[color,box-shadow]",
    "focus-visible:border-ring focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50 aria-invalid:border-destructive",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        success:
          "border-success/30 bg-success/10 text-success [a&]:hover:bg-success/20",
        warning:
          "border-warning/30 bg-warning/10 text-warning [a&]:hover:bg-warning/20",
        info: "border-info/30 bg-info/10 text-info [a&]:hover:bg-info/20",
        destructive: [
          "bg-destructive text-destructive-foreground",
          "focus-visible:ring-destructive/30 [a&]:hover:bg-destructive/90",
        ],
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export { badgeVariants };
