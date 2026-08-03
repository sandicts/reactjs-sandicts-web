import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ImageResponse } from "next/og";
import { activeBrandVariant } from "@/config/brand";
import { getBrandArtwork } from "@/lib/brand/brand-artwork";
import { staticVisualColors } from "@/lib/visual-system/static-colors";
import { SOCIAL_IMAGE_SIZE } from "./seo.constants";

type SocialImageCopy = Readonly<{
  eyebrow: string;
  symbolLabel: string;
  title: string;
}>;

const brandFontPath = resolve(
  process.cwd(),
  "public/fonts/roboto-latin-500-normal.woff",
);
const brandFontDataPromise = readFile(brandFontPath).then(
  (fontBuffer) =>
    fontBuffer.buffer.slice(
      fontBuffer.byteOffset,
      fontBuffer.byteOffset + fontBuffer.byteLength,
    ) as ArrayBuffer,
);

async function createSocialImage(copy: SocialImageCopy) {
  const artwork = getBrandArtwork(activeBrandVariant.artworkId);
  const brandFontData = await brandFontDataPromise;

  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: staticVisualColors.background,
        color: staticVisualColors.foreground,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"IBM Plex Sans", Arial, sans-serif',
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "72px 80px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: `radial-gradient(circle at center, ${staticVisualColors.brandGlow}, transparent 68%)`,
          display: "flex",
          height: "620px",
          position: "absolute",
          right: "-180px",
          top: "-260px",
          width: "620px",
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "24px",
        }}
      >
        <svg
          aria-label={copy.symbolLabel}
          height="96"
          viewBox={artwork.viewBox}
          width="96"
        >
          <path d={artwork.path} fill={staticVisualColors.brand} />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: "46px",
            fontWeight: 500,
            fontFamily: "Roboto",
            letterSpacing: "6px",
          }}
        >
          {activeBrandVariant.displayName}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            color: staticVisualColors.brand,
            display: "flex",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          {copy.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "66px",
            fontWeight: 800,
            fontFamily: 'Montserrat, "IBM Plex Sans", Arial, sans-serif',
            letterSpacing: "-2.5px",
            lineHeight: 1.05,
          }}
        >
          {copy.title}
        </div>
      </div>

      <div
        style={{
          background: staticVisualColors.brand,
          borderRadius: "999px",
          display: "flex",
          height: "10px",
          width: "180px",
        }}
      />
    </div>,
    {
      ...SOCIAL_IMAGE_SIZE,
      fonts: [
        {
          data: brandFontData,
          name: "Roboto",
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}

export { createSocialImage };
export type { SocialImageCopy };
