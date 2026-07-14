"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { separatorStyles } from "./separator.styles";
import type { SeparatorProps } from "./separator.types";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorStyles.root, className)}
      {...props}
    />
  );
}

export { Separator };
