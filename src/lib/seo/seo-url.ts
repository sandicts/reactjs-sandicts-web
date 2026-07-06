import { seoEnv, type SeoEnvironment } from "@/lib/env/seo-env";

function createAbsoluteUrl(
  pathname: string,
  environment: SeoEnvironment = seoEnv,
) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    throw new Error("SEO paths must start with one slash.");
  }

  return new URL(pathname, environment.webOrigin).toString();
}

export { createAbsoluteUrl };
