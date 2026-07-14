import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center",
          "[&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start",
          "@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

const fieldStyles = {
  set: cn(
    "flex flex-col gap-6",
    "has-[>[data-slot=checkbox-group]]:gap-3",
    "has-[>[data-slot=radio-group]]:gap-3",
  ),
  legend:
    "mb-3 font-medium data-[variant=legend]:text-base data-[variant=label]:text-sm",
  group: cn(
    "group/field-group @container/field-group flex w-full flex-col gap-7",
    "data-[slot=checkbox-group]:gap-3",
    "[&>[data-slot=field-group]]:gap-4",
  ),
  content: "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
  label: cn(
    "group/field-label peer/field-label flex w-fit gap-2 leading-snug",
    "group-data-[disabled=true]/field:opacity-50",
    "has-[>[data-slot=field]]:w-full",
    "has-[>[data-slot=field]]:flex-col",
    "has-[>[data-slot=field]]:rounded-md",
    "has-[>[data-slot=field]]:border",
    "[&>*]:data-[slot=field]:p-4",
    "has-data-[state=checked]:border-primary",
    "has-data-[state=checked]:bg-primary/5",
  ),
  title: cn(
    "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
    "group-data-[disabled=true]/field:opacity-50",
  ),
  description: cn(
    "text-sm leading-normal font-normal text-muted-foreground",
    "group-has-[[data-orientation=horizontal]]/field:text-balance",
    "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
    "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
  ),
  separator:
    "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
  separatorLine: "absolute inset-0 top-1/2",
  separatorContent:
    "relative mx-auto block w-fit bg-background px-2 text-muted-foreground",
  error: "text-sm font-normal text-destructive",
  errorList: "ml-4 flex list-disc flex-col gap-1",
} as const;

export { fieldStyles, fieldVariants };
