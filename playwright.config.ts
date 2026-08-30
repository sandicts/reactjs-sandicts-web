import { defineConfig, devices } from "@playwright/test";

const localWebAppUrl = "http://localhost:3001";
const configuredWebAppUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const webAppUrl = configuredWebAppUrl || localWebAppUrl;
const localWebServerTimeoutMilliseconds = 120_000;
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: webAppUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: browserChannel,
      },
    },
  ],
  webServer: configuredWebAppUrl
    ? undefined
    : {
        command: "npm run dev",
        env: {
          NEXT_PUBLIC_APP_ENV: "local",
          NEXT_PUBLIC_AUTH_ENABLED: "true",
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: "playwright.invalid",
          NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED: "false",
          SEO_INDEXING_ENABLED: "true",
          WEB_ORIGIN: localWebAppUrl,
        },
        reuseExistingServer: !process.env.CI,
        timeout: localWebServerTimeoutMilliseconds,
        url: localWebAppUrl,
      },
});
