import type { ComponentProps } from "react";
import {
  activeBrandVariantId,
  getBrandVariant,
  type BrandVariantId,
} from "@/config/brand";
import { getBrandArtwork } from "@/lib/brand/brand-artwork";
import { cn } from "@/lib/utils";

type BrandMarkProps = Omit<ComponentProps<"svg">, "children"> &
  Readonly<{
    label?: string;
    size?: number;
    variantId?: BrandVariantId;
  }>;

function BrandMark({
  className,
  label,
  size = 36,
  variantId = activeBrandVariantId,
  ...props
}: BrandMarkProps) {
  const variant = getBrandVariant(variantId);
  const artwork = getBrandArtwork(variant.artworkId);

  return (
    <svg
      {...props}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("shrink-0 text-brand", className)}
      data-brand-mark=""
      data-brand-variant={variantId}
      focusable="false"
      height={size}
      role={label ? "img" : undefined}
      viewBox={artwork.viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={artwork.path} fill="currentColor" />
    </svg>
  );
}

export { BrandMark };
export type { BrandMarkProps };
