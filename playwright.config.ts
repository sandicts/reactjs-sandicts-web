import { defineConfig, devices } from "@playwright/test";

const localWebAppUrl = "http://localhost:3001";
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
    baseURL: localWebAppUrl,
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
  webServer: {
    command: "npm run dev",
    reuseExistingServer: !process.env.CI,
    timeout: localWebServerTimeoutMilliseconds,
    url: localWebAppUrl,
  },
});
