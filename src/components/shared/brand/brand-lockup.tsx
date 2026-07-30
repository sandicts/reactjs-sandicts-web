import type { ComponentProps } from "react";
import {
  activeBrandVariantId,
  getBrandVariant,
  type BrandVariantId,
} from "@/config/brand";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { BrandName } from "./brand-name";

type BrandLockupProps = ComponentProps<"span"> &
  Readonly<{
    markSize?: number;
    orientation?: "horizontal" | "stacked";
    treatment?: "flat" | "expressive";
    variantId?: BrandVariantId;
  }>;

function BrandLockup({
  className,
  markSize = 36,
  orientation = "horizontal",
  treatment,
  variantId = activeBrandVariantId,
  ...props
}: BrandLockupProps) {
  const variant = getBrandVariant(variantId);
  const resolvedTreatment = treatment ?? variant.defaultTreatment;

  return (
    <span
      {...props}
      className={cn(
        "inline-flex text-brand",
        orientation === "horizontal"
          ? "items-center gap-2.5"
          : "flex-col items-center gap-3",
        className,
      )}
      data-brand-lockup=""
      data-brand-orientation={orientation}
      data-brand-treatment={resolvedTreatment}
      data-brand-variant={variantId}
    >
      <BrandMark
        className={
          resolvedTreatment === "expressive"
            ? "brand-mark-expressive"
            : undefined
        }
        size={markSize}
        variantId={variantId}
      />
      <BrandName
        aria-hidden={props["aria-label"] ? true : undefined}
        variantId={variantId}
      />
    </span>
  );
}

export { BrandLockup };
export type { BrandLockupProps };
