import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import type { Label } from "@/components/ui/label";
import { fieldVariants } from "./field.styles";

type FieldSetProps = ComponentProps<"fieldset">;
type FieldLegendVariant = "legend" | "label";
type FieldLegendProps = ComponentProps<"legend"> &
  Readonly<{
    variant?: FieldLegendVariant;
  }>;
type FieldGroupProps = ComponentProps<"div">;
type FieldProps = ComponentProps<"div"> & VariantProps<typeof fieldVariants>;
type FieldContentProps = ComponentProps<"div">;
type FieldLabelProps = ComponentProps<typeof Label>;
type FieldTitleProps = ComponentProps<"div">;
type FieldDescriptionProps = ComponentProps<"p">;
type FieldSeparatorProps = ComponentProps<"div"> &
  Readonly<{
    children?: ReactNode;
  }>;
type FieldErrorItem = {
  message?: string;
};
type FieldErrorProps = ComponentProps<"div"> &
  Readonly<{
    errors?: Array<FieldErrorItem | undefined>;
  }>;

export type {
  FieldContentProps,
  FieldDescriptionProps,
  FieldErrorItem,
  FieldErrorProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldLegendProps,
  FieldLegendVariant,
  FieldProps,
  FieldSeparatorProps,
  FieldSetProps,
  FieldTitleProps,
};
