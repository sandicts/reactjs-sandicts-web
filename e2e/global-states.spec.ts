import { expect, test } from "@playwright/test";

test("renders a privacy-safe global not-found state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const response = await page.goto("/rota-inexistente");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Não encontramos esta página.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "O endereço pode estar incorreto ou o conteúdo pode não estar mais disponível.",
    ),
  ).toBeVisible();
  const mainContent = page.locator("#shell-main");

  await expect(
    mainContent.getByRole("link", { name: "Explorar quadras", exact: true }),
  ).toHaveAttribute("href", "/discovery");
  await expect(
    mainContent.getByRole("link", { name: "Voltar ao início", exact: true }),
  ).toHaveAttribute("href", "/");
  const robotsContents = await page
    .locator('meta[name="robots"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("content") ?? ""),
    );

  expect(robotsContents.some((content) => content.includes("noindex"))).toBe(
    true,
  );
});
