import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

const PROTOTYPE_FILE_URL = pathToFileURL(
  resolve(process.cwd(), "docs/frontend/prototypes/auth-magic-link/index.html"),
);

const STATES = [
  "email-entry",
  "session-expired-entry",
  "email-invalid",
  "requesting",
  "sent-cooldown",
  "resend-ready",
  "resending",
  "request-rate-limited",
  "delivery-unavailable",
  "request-failed",
  "verifying",
  "invalid-link",
  "expired-link",
  "used-link",
  "superseded-link",
  "consume-rate-limited",
  "auth-forbidden",
  "verification-failed",
  "routing",
] as const;

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
] as const;

function prototypeUrl(state: (typeof STATES)[number], longCopy = false) {
  const url = new URL(PROTOTYPE_FILE_URL);
  url.searchParams.set("state", state);

  if (longCopy) {
    url.searchParams.set("long", "1");
  }

  return url.href;
}

test("renders every KAN-104 state with the shared visual foundation", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto(prototypeUrl("email-entry", true));

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("#state-selector option")).toHaveCount(
      STATES.length,
    );

    const visualFoundation = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const heading = document.querySelector("#hero-title");

      return {
        fontSans: rootStyles.getPropertyValue("--font-sans-stack").trim(),
        headingFont: heading ? getComputedStyle(heading).fontFamily : "",
        radius: rootStyles.getPropertyValue("--radius").trim(),
      };
    });

    expect(visualFoundation.fontSans).toContain("IBM Plex Sans");
    expect(visualFoundation.headingFont).toContain("Montserrat");
    expect(Number.parseFloat(visualFoundation.radius)).toBe(0.45);

    for (const state of STATES) {
      await page.locator("#state-selector").selectOption(state);
      await expect(page.locator("#prototype-status")).not.toBeEmpty();
      await expect(
        page.locator("#auth-card:not([hidden]), #boundary-state:not([hidden])"),
      ).toHaveCount(1);

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(
        horizontalOverflow,
        `${viewport.width}px:${state}`,
      ).toBeLessThanOrEqual(0);
    }
  }

  expect(pageErrors).toEqual([]);
});

test("keeps validation, confirmation, and recovery privacy-safe", async ({
  page,
}) => {
  await page.goto(prototypeUrl("email-entry"));

  const email = page.locator("#email-input");
  await page.locator("#email-submit").click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#email-error")).toBeVisible();

  const submittedEmail = "known-player@example.com";
  await email.fill(submittedEmail);
  await page.locator("#email-submit").click();
  await expect(page).toHaveURL(/state=requesting/);
  await expect(page).toHaveURL(/state=sent-cooldown/, { timeout: 2_000 });

  await expect(page.locator("#auth-card")).not.toContainText(submittedEmail);
  await expect(page.locator("#auth-card")).toContainText(
    "Se o endereço informado estiver correto",
  );

  await page.goto(prototypeUrl("request-rate-limited", true));
  await expect(page.locator("#boundary-state")).toContainText(
    "Nenhum tempo exato é prometido.",
  );
  await expect(page.locator("#boundary-state")).not.toContainText(/\d+:\d+/);

  await page.goto(prototypeUrl("verification-failed"));
  await expect(page.locator("#boundary-state")).toContainText(
    "A tentativa não será repetida automaticamente.",
  );
});
