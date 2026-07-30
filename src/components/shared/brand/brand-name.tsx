import type { ComponentProps } from "react";
import {
  activeBrandVariantId,
  getBrandVariant,
  type BrandVariantId,
} from "@/config/brand";
import { cn } from "@/lib/utils";

type BrandNameProps = ComponentProps<"span"> &
  Readonly<{
    variantId?: BrandVariantId;
  }>;

function BrandName({
  className,
  variantId = activeBrandVariantId,
  ...props
}: BrandNameProps) {
  const variant = getBrandVariant(variantId);

  return (
    <span
      {...props}
      className={cn(
        "font-brand text-[0.82em] leading-none font-medium tracking-[0.16em] text-brand",
        className,
      )}
      data-brand-name=""
    >
      {variant.displayName}
    </span>
  );
}

export { BrandName };
export type { BrandNameProps };
