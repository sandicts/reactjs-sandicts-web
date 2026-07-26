import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
] as const;

test("keeps the visual foundation stable across target viewports", async ({
  page,
}) => {
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Encontre quadras, partidas e gente para jogar.",
      }),
    ).toBeVisible();

    const foundation = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const heading = document.querySelector("h1");

      return {
        chart: rootStyles.getPropertyValue("--chart-1").trim(),
        fontSans: rootStyles.getPropertyValue("--font-sans-stack").trim(),
        headingFont: heading ? getComputedStyle(heading).fontFamily : "",
        horizontalOverflow:
          document.documentElement.scrollWidth - window.innerWidth,
        radius: rootStyles.getPropertyValue("--radius").trim(),
        sidebar: rootStyles.getPropertyValue("--sidebar").trim(),
        successSubtle: rootStyles.getPropertyValue("--success-subtle").trim(),
      };
    });

    expect(Number.parseFloat(foundation.radius)).toBe(0.45);
    expect(foundation.fontSans).toContain("IBM Plex Sans");
    expect(foundation.headingFont).toContain("Montserrat");
    expect(foundation.chart).toMatch(/^(?:oklch|lab|rgb|color)\(/);
    expect(foundation.sidebar).toMatch(/^(?:oklch|lab|rgb|color)\(/);
    expect(foundation.successSubtle).toMatch(/^(?:oklch|lab|rgb|color)\(/);
    expect(foundation.horizontalOverflow).toBeLessThanOrEqual(0);
  }
});

test("keeps semantic text pairs at WCAG AA contrast in both token maps", async ({
  page,
}) => {
  await page.goto("/");

  const ratios = await page.evaluate(() => {
    const pairs = [
      ["foreground", "background"],
      ["card-foreground", "card"],
      ["primary-foreground", "primary"],
      ["success-foreground", "success"],
      ["success", "success-subtle"],
      ["warning-foreground", "warning"],
      ["warning", "warning-subtle"],
      ["info-foreground", "info"],
      ["info", "info-subtle"],
      ["destructive-foreground", "destructive"],
      ["destructive", "destructive-subtle"],
    ] as const;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    canvas.width = 1;
    canvas.height = 1;

    function toRgb(color: string) {
      context!.clearRect(0, 0, 1, 1);
      context!.fillStyle = color;
      context!.fillRect(0, 0, 1, 1);
      return Array.from(context!.getImageData(0, 0, 1, 1).data.slice(0, 3));
    }

    function luminance([red, green, blue]: number[]) {
      const [r, g, b] = [red, green, blue].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    return ["light", "dark"].flatMap((theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const styles = getComputedStyle(document.documentElement);

      return pairs.map(([foreground, background]) => {
        const foregroundLuminance = luminance(
          toRgb(styles.getPropertyValue(`--${foreground}`).trim()),
        );
        const backgroundLuminance = luminance(
          toRgb(styles.getPropertyValue(`--${background}`).trim()),
        );
        const lighter = Math.max(foregroundLuminance, backgroundLuminance);
        const darker = Math.min(foregroundLuminance, backgroundLuminance);

        return {
          pair: `${theme}:${foreground}/${background}`,
          ratio: (lighter + 0.05) / (darker + 0.05),
        };
      });
    });
  });

  for (const { pair, ratio } of ratios) {
    expect(ratio, pair).toBeGreaterThanOrEqual(4.5);
  }
});
