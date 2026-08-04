"use client";

import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { labelStyles } from "./label.styles";
import type { LabelProps } from "./label.types";

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelStyles.root, className)}
      {...props}
    />
  );
}

export { Label };
