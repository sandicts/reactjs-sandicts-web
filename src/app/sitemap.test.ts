import { describe, expect, it } from "vitest";
import { createSeoEnvironment } from "@/lib/env/seo-env";
import { createSitemap } from "./sitemap";

describe("createSitemap", () => {
  it("contains only explicitly indexable public routes", () => {
    const environment = createSeoEnvironment({
      indexingEnabled: "true",
      webOrigin: "https://sandicts.com.br",
    });

    expect(createSitemap(environment)).toEqual([
      {
        url: "https://sandicts.com.br/",
      },
      {
        url: "https://sandicts.com.br/discovery",
      },
    ]);
  });

  it("is empty when indexing is disabled", () => {
    const environment = createSeoEnvironment({
      indexingEnabled: "false",
      webOrigin: "https://preview.sandicts.com.br",
    });

    expect(createSitemap(environment)).toEqual([]);
  });
});
