import { expect, test, type Page } from "@playwright/test";

async function expectRobotsContent(page: Page, expectedContent: string) {
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    expectedContent,
  );
}

test("publishes complete metadata for the public home page", async ({
  page,
  request,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Sandicts");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3001",
  );
  await expectRobotsContent(page, "index, follow");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "pt_BR",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  const openGraphImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(openGraphImageUrl).toBeTruthy();
  expect(twitterImageUrl).toBeTruthy();

  const [openGraphImageResponse, twitterImageResponse] = await Promise.all([
    request.get(openGraphImageUrl!),
    request.get(twitterImageUrl!),
  ]);

  expect(openGraphImageResponse.ok()).toBe(true);
  expect(openGraphImageResponse.headers()["content-type"]).toContain(
    "image/png",
  );
  expect(twitterImageResponse.ok()).toBe(true);
  expect(twitterImageResponse.headers()["content-type"]).toContain("image/png");
});

test("publishes route-specific discovery metadata", async ({ page }) => {
  await page.goto("/discovery");

  await expect(page).toHaveTitle("Descobrir quadras | Sandicts");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3001/discovery",
  );
  await expectRobotsContent(page, "index, follow");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "http://localhost:3001/discovery",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Descobrir quadras",
  );
});

test("keeps sign-in and operational routes out of the index", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expectRobotsContent(page, "noindex, follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

  await page.goto("/app");
  await expectRobotsContent(page, "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

  await page.goto("/organizations/arena-sul");
  await expectRobotsContent(page, "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("exposes crawler files with only explicitly public URLs", async ({
  request,
}) => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
  ]);

  expect(robotsResponse.ok()).toBe(true);
  expect(await robotsResponse.text()).toContain(
    "Sitemap: http://localhost:3001/sitemap.xml",
  );

  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  const locations = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map(
    ([, location]) => location,
  );

  expect(locations).toEqual([
    "http://localhost:3001/",
    "http://localhost:3001/discovery",
  ]);
  expect(sitemap).not.toContain("/sign-in");
  expect(sitemap).not.toContain("/app");
  expect(sitemap).not.toContain("/organizations/");
});
