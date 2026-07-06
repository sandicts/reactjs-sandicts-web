import type { MetadataRoute } from "next";
import { seoEnv, type SeoEnvironment } from "@/lib/env/seo-env";
import { PUBLIC_SITEMAP_PATHS } from "@/lib/seo/seo.constants";
import { createAbsoluteUrl } from "@/lib/seo/seo-url";

function createSitemap(
  environment: SeoEnvironment = seoEnv,
): MetadataRoute.Sitemap {
  if (!environment.indexingEnabled) {
    return [];
  }

  return PUBLIC_SITEMAP_PATHS.map((pathname) => ({
    url: createAbsoluteUrl(pathname, environment),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap();
}

export { createSitemap };
