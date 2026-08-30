import { e2eGoogleCredential, expect, test } from "./fixtures/auth.fixture";

test("signs in and resumes the authenticated Player area", async ({
  authApi,
  page,
}) => {
  await page.goto("/app");

  await expect(page).toHaveURL(/\/sign-in\?returnTo=%2Fapp$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Entre para continuar" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continuar com Google" }).click();

  await expect
    .poll(() => authApi.googleCredentials)
    .toEqual([e2eGoogleCredential]);
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Seu próximo jogo começa aqui.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Abrir menu da conta de Jogadora E2E",
    }),
  ).toBeVisible();
});
