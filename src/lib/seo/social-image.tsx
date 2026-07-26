import { ImageResponse } from "next/og";
import { staticVisualColors } from "@/lib/visual-system/static-colors";
import { SEO_SITE_NAME, SOCIAL_IMAGE_SIZE } from "./seo.constants";

type SocialImageCopy = Readonly<{
  eyebrow: string;
  symbolLabel: string;
  title: string;
}>;

function createSocialImage(copy: SocialImageCopy) {
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
          background:
            "radial-gradient(circle at center, rgba(245, 158, 11, 0.18), rgba(12, 10, 9, 0) 68%)",
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
          viewBox="0 0 96 96"
          width="96"
        >
          <rect
            fill={staticVisualColors.surface}
            height="96"
            rx="20"
            width="96"
          />
          <path
            d="M25 58c8 10 31 11 43 0 6-5 5-14-2-18-10-6-29 5-38-3-5-4-1-12 8-14 8-2 19 0 27 6"
            fill="none"
            stroke={staticVisualColors.amber}
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            d="M69 29l7-13M74 38l14-5M25 59l-13 8M31 66l-6 14"
            fill="none"
            stroke={staticVisualColors.amberDeep}
            strokeLinecap="round"
            strokeWidth="6"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: "46px",
            fontWeight: 800,
            fontFamily: 'Montserrat, "IBM Plex Sans", Arial, sans-serif',
            letterSpacing: "-1.5px",
          }}
        >
          {SEO_SITE_NAME}
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
            color: staticVisualColors.amber,
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
          background: staticVisualColors.amber,
          borderRadius: "999px",
          display: "flex",
          height: "10px",
          width: "180px",
        }}
      />
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
}

export { createSocialImage };
export type { SocialImageCopy };
