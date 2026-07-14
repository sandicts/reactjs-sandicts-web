import type { ComponentProps } from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

type SheetSide = "top" | "right" | "bottom" | "left";

type SheetProps = ComponentProps<typeof SheetPrimitive.Root>;
type SheetTriggerProps = ComponentProps<typeof SheetPrimitive.Trigger>;
type SheetCloseProps = ComponentProps<typeof SheetPrimitive.Close>;
type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal>;
type SheetOverlayProps = ComponentProps<typeof SheetPrimitive.Overlay>;
type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> &
  Readonly<{
    closeLabel: string;
    side?: SheetSide;
    showCloseButton?: boolean;
  }>;
type SheetHeaderProps = ComponentProps<"div">;
type SheetFooterProps = ComponentProps<"div">;
type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title>;
type SheetDescriptionProps = ComponentProps<typeof SheetPrimitive.Description>;

export type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetPortalProps,
  SheetProps,
  SheetSide,
  SheetTitleProps,
  SheetTriggerProps,
};
