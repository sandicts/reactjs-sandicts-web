import { e2eAuthSession, expect, test } from "./fixtures/auth.fixture";

test("navigates from the public shell to sign-in", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Encontre quadras, partidas e gente para jogar.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Entrar", exact: true }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Entre para continuar",
    }),
  ).toBeVisible();
});

test("uses the Player bottom navigation on compact viewports", async ({
  authApi,
  page,
}) => {
  authApi.setSession(e2eAuthSession);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app");

  const compactNavigation = page.locator(
    '[data-navigation-presentation="bottom"]',
  );
  const adaptiveNavigation = page.locator(
    '[data-navigation-presentation="adaptive"]',
  );

  await expect(compactNavigation).toBeVisible();
  await expect(adaptiveNavigation).toBeHidden();
  await expect(
    compactNavigation.getByRole("link", { name: "Início" }),
  ).toHaveAttribute("aria-current", "page");

  await compactNavigation.getByRole("link", { name: "Reservas" }).click();

  await expect(page).toHaveURL(/\/app\/reservations$/);
  await expect(
    compactNavigation.getByRole("link", { name: "Reservas" }),
  ).toHaveAttribute("aria-current", "page");
});

test("adapts Player navigation from rail to labeled sidebar", async ({
  authApi,
  page,
}) => {
  authApi.setSession(e2eAuthSession);
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/app/open-matches");

  const adaptiveNavigation = page.locator(
    '[data-navigation-presentation="adaptive"]',
  );
  const matchesLabel = adaptiveNavigation
    .getByRole("link", { name: "Partidas" })
    .locator("span");

  await expect(adaptiveNavigation).toBeVisible();
  await expect(
    page.locator('[data-navigation-presentation="bottom"]'),
  ).toBeHidden();
  expect(
    await matchesLabel.evaluate(
      (element) => element.getBoundingClientRect().width,
    ),
  ).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 1440, height: 900 });

  await expect(matchesLabel).toBeVisible();
  expect(
    await matchesLabel.evaluate(
      (element) => element.getBoundingClientRect().width,
    ),
  ).toBeGreaterThan(20);
  await expect(
    adaptiveNavigation.getByRole("link", { name: "Partidas" }),
  ).toHaveAttribute("aria-current", "page");
});

test("opens and closes the Organization compact drawer with focus return", async ({
  authApi,
  page,
}) => {
  authApi.setSession(e2eAuthSession);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/organizations/arena-sul");

  const menuButton = page.getByRole("button", {
    name: "Abrir navegação da organização",
  });

  await menuButton.click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "Agenda" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page.getByRole("dialog").getByRole("link", { name: "Agenda" }).click();

  await expect(page).toHaveURL(/\/organizations\/arena-sul\/calendar$/);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("selects the most specific Organization route on expanded viewports", async ({
  authApi,
  page,
}) => {
  authApi.setSession(e2eAuthSession);
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/organizations/arena-sul/calendar/configuration");

  const adaptiveNavigation = page.locator(
    '[data-navigation-presentation="adaptive"]',
  );

  await expect(adaptiveNavigation).toBeVisible();
  await expect(
    adaptiveNavigation.getByRole("link", { name: "Disponibilidade" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    adaptiveNavigation.getByRole("link", { name: "Agenda" }),
  ).not.toHaveAttribute("aria-current");
  expect(consoleErrors).toEqual([]);
});
