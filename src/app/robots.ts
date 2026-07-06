import type { MetadataRoute } from "next";
import { seoEnv, type SeoEnvironment } from "@/lib/env/seo-env";
import { createAbsoluteUrl } from "@/lib/seo/seo-url";

function createRobots(
  environment: SeoEnvironment = seoEnv,
): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    ...(environment.indexingEnabled
      ? { sitemap: createAbsoluteUrl("/sitemap.xml", environment) }
      : {}),
  };
}

export default function robots(): MetadataRoute.Robots {
  return createRobots();
}

export { createRobots };
