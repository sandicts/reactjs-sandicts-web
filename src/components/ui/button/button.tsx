import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button.styles";
import type { ButtonProps } from "./button.types";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
