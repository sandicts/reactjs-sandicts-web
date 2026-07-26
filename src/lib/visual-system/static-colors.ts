/**
 * Static sRGB fallbacks for renderers that cannot consume the runtime CSS
 * custom properties, such as Next.js ImageResponse.
 *
 * These values serialize the active Stone/Amber direction. Brand artwork can
 * replace the mark-specific entries when KAN-145 lands.
 */
const staticVisualColors = {
  amber: "#f59e0b",
  amberDeep: "#b45309",
  background: "#0c0a09",
  foreground: "#fafaf9",
  surface: "#292524",
} as const;

export { staticVisualColors };
