import { expect, test } from "@playwright/test";

test("navigates from the public app shell to sign-in", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Find courts. Join games. Keep the sand moving.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sign in starts here.",
    }),
  ).toBeVisible();
});
