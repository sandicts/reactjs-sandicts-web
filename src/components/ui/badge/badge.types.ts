import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { badgeVariants } from "./badge.styles";

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> &
  Readonly<{
    asChild?: boolean;
  }>;

export type { BadgeProps };
