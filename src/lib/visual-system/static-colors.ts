import { activeBrandVariant } from "@/config/brand";

/**
 * Static sRGB values for renderers that cannot consume runtime CSS custom
 * properties. The active brand variant remains the single source of truth.
 */
const staticVisualColors = activeBrandVariant.theme.static;

export { staticVisualColors };
