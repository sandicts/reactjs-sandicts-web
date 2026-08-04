import { describe, expect, it } from "vitest";
import { createSeoEnvironment } from "@/lib/env/seo-env";
import { createRobots } from "./robots";

describe("createRobots", () => {
  it("advertises the sitemap when indexing is enabled", () => {
    const environment = createSeoEnvironment({
      indexingEnabled: "true",
      webOrigin: "https://sandicts.com.br",
    });

    expect(createRobots(environment)).toEqual({
      rules: {
        allow: "/",
        userAgent: "*",
      },
      sitemap: "https://sandicts.com.br/sitemap.xml",
    });
  });

  it("keeps pages crawlable for noindex and omits preview sitemaps", () => {
    const environment = createSeoEnvironment({
      indexingEnabled: "false",
      webOrigin: "https://preview.sandicts.com.br",
    });

    expect(createRobots(environment)).toEqual({
      rules: {
        allow: "/",
        userAgent: "*",
      },
    });
  });
});
