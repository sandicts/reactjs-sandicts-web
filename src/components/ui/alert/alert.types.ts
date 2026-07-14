import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { alertVariants } from "./alert.styles";

type AlertProps = ComponentProps<"div"> & VariantProps<typeof alertVariants>;
type AlertTitleProps = ComponentProps<"div">;
type AlertDescriptionProps = ComponentProps<"div">;

export type { AlertDescriptionProps, AlertProps, AlertTitleProps };
