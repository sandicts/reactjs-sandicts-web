import { SpinnerGapIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pendingButtonStyles } from "./pending-button.styles";
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
      className={cn(pendingButtonStyles.root, className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      <span
        aria-hidden={pending}
        className={cn(
          pendingButtonStyles.content,
          pending && pendingButtonStyles.hiddenContent,
        )}
      >
        {children}
      </span>
      <span
        aria-hidden={!pending}
        className={cn(
          pendingButtonStyles.content,
          !pending && pendingButtonStyles.hiddenContent,
        )}
      >
        <SpinnerGapIcon
          className={pendingButtonStyles.spinner}
          aria-hidden="true"
        />
        {pendingLabel}
      </span>
    </Button>
  );
}

export { PendingButton };
