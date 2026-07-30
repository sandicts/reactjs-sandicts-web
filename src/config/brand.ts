import type { BrandArtworkId } from "../lib/brand/brand-artwork";

type BrandThemeTokens = Readonly<{
  brand: string;
  brandForeground: string;
  brandGlow: string;
  brandSurface: string;
  primary: string;
  primaryForeground: string;
  ring: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
}>;

type StaticBrandColors = Readonly<{
  background: string;
  brand: string;
  brandDeep: string;
  brandGlow: string;
  foreground: string;
  surface: string;
}>;

type BrandVariant = Readonly<{
  artworkId: BrandArtworkId;
  defaultTreatment: "flat" | "expressive";
  displayName: string;
  id: string;
  theme: Readonly<{
    dark: BrandThemeTokens;
    light: BrandThemeTokens;
    static: StaticBrandColors;
  }>;
}>;

const brandVariants = {
  default: {
    artworkId: "sandicts-s",
    defaultTreatment: "flat",
    displayName: "SANDICTS",
    id: "default",
    theme: {
      dark: {
        brand: "oklch(0.769 0.188 70.08)",
        brandForeground: "oklch(0.279 0.077 45.635)",
        brandGlow: "oklch(0.769 0.188 70.08 / 46%)",
        brandSurface: "oklch(0.279 0.077 45.635)",
        primary: "oklch(0.473 0.137 46.201)",
        primaryForeground: "oklch(0.987 0.022 95.277)",
        ring: "oklch(0.553 0.013 58.071)",
        sidebarPrimary: "oklch(0.769 0.188 70.08)",
        sidebarPrimaryForeground: "oklch(0.279 0.077 45.635)",
      },
      light: {
        brand: "oklch(0.555 0.163 48.998)",
        brandForeground: "oklch(0.987 0.022 95.277)",
        brandGlow: "oklch(0.705 0.213 47.604 / 32%)",
        brandSurface: "oklch(0.987 0.022 95.277)",
        primary: "oklch(0.555 0.163 48.998)",
        primaryForeground: "oklch(0.987 0.022 95.277)",
        ring: "oklch(0.709 0.01 56.259)",
        sidebarPrimary: "oklch(0.666 0.179 58.318)",
        sidebarPrimaryForeground: "oklch(0.987 0.022 95.277)",
      },
      static: {
        background: "#0c0a09",
        brand: "#f59e0b",
        brandDeep: "#b45309",
        brandGlow: "rgba(245, 158, 11, 0.28)",
        foreground: "#fafaf9",
        surface: "#292524",
      },
    },
  },
  "celebration-fixture": {
    artworkId: "sandicts-s",
    defaultTreatment: "expressive",
    displayName: "SANDICTS",
    id: "celebration-fixture",
    theme: {
      dark: {
        brand: "oklch(0.707 0.165 254.624)",
        brandForeground: "oklch(0.282 0.091 267.935)",
        brandGlow: "oklch(0.707 0.165 254.624 / 46%)",
        brandSurface: "oklch(0.282 0.091 267.935)",
        primary: "oklch(0.623 0.214 259.815)",
        primaryForeground: "oklch(0.97 0.014 254.604)",
        ring: "oklch(0.707 0.165 254.624)",
        sidebarPrimary: "oklch(0.707 0.165 254.624)",
        sidebarPrimaryForeground: "oklch(0.282 0.091 267.935)",
      },
      light: {
        brand: "oklch(0.546 0.245 262.881)",
        brandForeground: "oklch(0.97 0.014 254.604)",
        brandGlow: "oklch(0.623 0.214 259.815 / 32%)",
        brandSurface: "oklch(0.932 0.032 255.585)",
        primary: "oklch(0.546 0.245 262.881)",
        primaryForeground: "oklch(0.97 0.014 254.604)",
        ring: "oklch(0.623 0.214 259.815)",
        sidebarPrimary: "oklch(0.546 0.245 262.881)",
        sidebarPrimaryForeground: "oklch(0.97 0.014 254.604)",
      },
      static: {
        background: "#172554",
        brand: "#60a5fa",
        brandDeep: "#2563eb",
        brandGlow: "rgba(96, 165, 250, 0.3)",
        foreground: "#eff6ff",
        surface: "#1e3a8a",
      },
    },
  },
} as const satisfies Record<string, BrandVariant>;

type BrandVariantId = keyof typeof brandVariants;

const activeBrandVariantId = "default" satisfies BrandVariantId;
const activeBrandVariant = brandVariants[activeBrandVariantId];

function getBrandVariant(variantId: BrandVariantId = activeBrandVariantId) {
  return brandVariants[variantId];
}

export {
  activeBrandVariant,
  activeBrandVariantId,
  brandVariants,
  getBrandVariant,
};
export type {
  BrandThemeTokens,
  BrandVariant,
  BrandVariantId,
  StaticBrandColors,
};
