import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { buttonVariants } from "./button.styles";

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &
  Readonly<{
    asChild?: boolean;
  }>;

export type { ButtonProps };
