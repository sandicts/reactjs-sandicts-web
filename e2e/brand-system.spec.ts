import { expect, test } from "@playwright/test";

const representativeViewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
] as const;

test("publishes the active variant and accessible shared brand link", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute(
    "data-brand-variant",
    "default",
  );
  await expect(
    page.getByRole("link", { name: "Sandicts — início" }),
  ).toHaveCount(1);
  await expect(page.locator("[data-brand-link] [data-brand-mark]")).toHaveCount(
    1,
  );
  await expect(page.locator("[data-brand-link] [data-brand-name]")).toHaveText(
    "SANDICTS",
  );
});

test("renders the gallery and propagates fixture theme tokens", async ({
  page,
}) => {
  await page.goto("/prototypes/brand");

  await expect(
    page.getByRole("heading", { level: 1, name: "Galeria da marca Sandicts" }),
  ).toBeVisible();

  const defaultVariant = page.locator('[data-brand-gallery-variant="default"]');
  const fixtureVariant = page.locator(
    '[data-brand-gallery-variant="celebration-fixture"]',
  );

  await expect(defaultVariant).toHaveCount(1);
  await expect(fixtureVariant).toHaveCount(1);

  const defaultBrandColor = await defaultVariant.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--brand"),
  );
  const fixtureBrandColor = await fixtureVariant.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--brand"),
  );

  expect(defaultBrandColor).toBeTruthy();
  expect(fixtureBrandColor).toBeTruthy();
  expect(fixtureBrandColor).not.toBe(defaultBrandColor);

  const [darkSurfaceColor, lightSurfaceColor] = await Promise.all([
    defaultVariant
      .locator('[data-brand-gallery-surface="flat-dark"]')
      .evaluate((element) => {
        const lockup = element.querySelector("[data-brand-lockup]");

        return lockup
          ? getComputedStyle(lockup).getPropertyValue("--brand")
          : "";
      }),
    defaultVariant
      .locator('[data-brand-gallery-surface="flat-light"]')
      .evaluate((element) => {
        const lockup = element.querySelector("[data-brand-lockup]");

        return lockup
          ? getComputedStyle(lockup).getPropertyValue("--brand")
          : "";
      }),
  ]);

  expect(darkSurfaceColor).not.toBe(lightSurfaceColor);
  expect(await page.locator("[data-brand-mark] path").count()).toBeGreaterThan(
    20,
  );
});

for (const viewport of representativeViewports) {
  test(`keeps the brand gallery stable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/prototypes/brand");

    const layoutMetrics = await page.locator("html").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));

    expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(
      layoutMetrics.clientWidth,
    );
    await expect(page.locator("[data-brand-mark] path")).not.toHaveCount(0);
  });
}

test("serves generated mark and icon assets from the canonical geometry", async ({
  request,
}) => {
  const [markResponse, iconResponse] = await Promise.all([
    request.get("/sandicts-mark.svg"),
    request.get("/icon.svg"),
  ]);

  expect(markResponse.ok()).toBe(true);
  expect(iconResponse.ok()).toBe(true);

  const [mark, icon] = await Promise.all([
    markResponse.text(),
    iconResponse.text(),
  ]);

  expect(mark).toContain("M8 90V74H57");
  expect(icon).toContain("M8 90V74H57");
  expect(mark).not.toContain("M25 58c8 10 31 11 43 0");
});
