import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PendingButtonProps } from "./pending-button.types";

function PendingButton({
  children,
  className,
  disabled,
  pending,
  pendingLabel,
  ...props
}: PendingButtonProps) {
  return (
    <Button
      {...props}
      className={cn("grid", className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      <span
        aria-hidden={pending}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
          pending && "invisible",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden={!pending}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
          !pending && "invisible",
        )}
      >
        <LoaderCircle
          className="animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
        {pendingLabel}
      </span>
    </Button>
  );
}

export { PendingButton };
