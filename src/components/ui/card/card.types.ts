import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> &
  Readonly<{
    size?: "default" | "sm";
  }>;
type CardHeaderProps = ComponentProps<"div">;
type CardTitleProps = ComponentProps<"div">;
type CardDescriptionProps = ComponentProps<"div">;
type CardActionProps = ComponentProps<"div">;
type CardContentProps = ComponentProps<"div">;
type CardFooterProps = ComponentProps<"div">;

export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
