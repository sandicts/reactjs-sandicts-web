import { cn } from "@/lib/utils";
import { alertStyles, alertVariants } from "./alert.styles";
import type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
} from "./alert.types";

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className={cn(alertStyles.title, className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertStyles.description, className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
