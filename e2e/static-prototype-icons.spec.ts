import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

const PROTOTYPES = [
  {
    name: "global states",
    path: "docs/frontend/prototypes/global-states/index.html",
  },
  {
    name: "sign in",
    path: "docs/frontend/prototypes/auth-sign-in/index.html",
  },
  {
    name: "magic link",
    path: "docs/frontend/prototypes/auth-magic-link/index.html",
  },
  {
    name: "app shells",
    path: "docs/frontend/prototypes/app-shells/index.html",
  },
] as const;

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
] as const;

const LEGACY_ICON_GLYPHS = [
  "⌕",
  "↗",
  "!",
  "⌄",
  "●",
  "⌂",
  "▣",
  "◎",
  "○",
  "☰",
  "▦",
  "◷",
  "$",
  "◇",
  "＋",
  "×",
  "›",
] as const;

test("uses complete Phosphor sprites without legacy glyph placeholders", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const prototype of PROTOTYPES) {
    const prototypeUrl = pathToFileURL(resolve(process.cwd(), prototype.path));

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      await page.goto(prototypeUrl.href);

      const result = await page.evaluate((legacyIconGlyphs) => {
        const missingReferences = Array.from(
          document.querySelectorAll("use"),
          (use) => use.getAttribute("href") ?? "",
        ).filter((href) => {
          const targetId = href.startsWith("#") ? href.slice(1) : "";
          return !targetId || !document.getElementById(targetId);
        });
        const legacyGlyphs = Array.from(
          document.querySelectorAll('[aria-hidden="true"]'),
          (element) => element.textContent?.trim() ?? "",
        ).filter((text) => legacyIconGlyphs.some((glyph) => glyph === text));
        const brandImages = Array.from(
          document.querySelectorAll<HTMLImageElement>(
            'img[src$="public/sandicts-mark.svg"]',
          ),
          (image) => ({
            complete: image.complete,
            naturalWidth: image.naturalWidth,
          }),
        );

        return {
          brandImages,
          brandNameCount: document.querySelectorAll(".brand-name").length,
          brandVariant: document.documentElement.dataset.brandVariant,
          horizontalOverflow:
            document.documentElement.scrollWidth - window.innerWidth,
          iconCount: document.querySelectorAll("svg.icon use").length,
          legacyGlyphs,
          missingReferences,
        };
      }, LEGACY_ICON_GLYPHS);

      expect(
        result.iconCount,
        `${prototype.name}:${viewport.width}px`,
      ).toBeGreaterThan(0);
      expect(
        result.missingReferences,
        `${prototype.name}:${viewport.width}px`,
      ).toEqual([]);
      expect(
        result.legacyGlyphs,
        `${prototype.name}:${viewport.width}px`,
      ).toEqual([]);
      expect(
        result.horizontalOverflow,
        `${prototype.name}:${viewport.width}px`,
      ).toBeLessThanOrEqual(0);
      expect(result.brandVariant).toBe("default");
      expect(result.brandNameCount).toBeGreaterThan(0);
      expect(result.brandImages.length).toBeGreaterThan(0);
      expect(
        result.brandImages.every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      ).toBe(true);
    }
  }

  expect(pageErrors).toEqual([]);
});
