import type { Metadata } from "next";
import { seoEnv, type SeoEnvironment } from "@/lib/env/seo-env";
import {
  OPEN_GRAPH_IMAGE_PATH,
  SEO_DEFAULT_DESCRIPTION,
  SEO_LOCALE,
  SEO_SITE_NAME,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  TWITTER_IMAGE_PATH,
} from "./seo.constants";
import { createAbsoluteUrl } from "./seo-url";

type PageMetadataDefinition = Readonly<{
  description: string;
  title: string;
}>;

type PublicPageMetadataDefinition = PageMetadataDefinition &
  Readonly<{
    canonicalPath: string;
    useAbsoluteTitle?: boolean;
  }>;

type PrivatePageMetadataDefinition = PageMetadataDefinition &
  Readonly<{
    follow?: boolean;
  }>;

function createRootMetadata(environment: SeoEnvironment = seoEnv): Metadata {
  return {
    applicationName: SEO_SITE_NAME,
    description: SEO_DEFAULT_DESCRIPTION,
    metadataBase: environment.webOrigin,
    openGraph: {
      description: SEO_DEFAULT_DESCRIPTION,
      images: [createOpenGraphImage(environment)],
      locale: SEO_LOCALE,
      siteName: SEO_SITE_NAME,
      title: SEO_SITE_NAME,
      type: "website",
      url: environment.webOrigin,
    },
    robots: createRobotsDirective(false, false),
    title: {
      default: SEO_SITE_NAME,
      template: `%s | ${SEO_SITE_NAME}`,
    },
    twitter: {
      card: "summary_large_image",
      description: SEO_DEFAULT_DESCRIPTION,
      images: [createTwitterImage(environment)],
      title: SEO_SITE_NAME,
    },
  };
}

function createPublicPageMetadata(
  definition: PublicPageMetadataDefinition,
  environment: SeoEnvironment = seoEnv,
): Metadata {
  const canonicalUrl = createAbsoluteUrl(definition.canonicalPath, environment);

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    description: definition.description,
    openGraph: {
      description: definition.description,
      images: [createOpenGraphImage(environment)],
      locale: SEO_LOCALE,
      siteName: SEO_SITE_NAME,
      title: definition.title,
      type: "website",
      url: canonicalUrl,
    },
    robots: createRobotsDirective(environment.indexingEnabled, true),
    title: definition.useAbsoluteTitle
      ? { absolute: definition.title }
      : definition.title,
    twitter: {
      card: "summary_large_image",
      description: definition.description,
      images: [createTwitterImage(environment)],
      title: definition.title,
    },
  };
}

function createPrivatePageMetadata(
  definition: PrivatePageMetadataDefinition,
): Metadata {
  return {
    description: definition.description,
    robots: createRobotsDirective(false, definition.follow ?? false),
    title: definition.title,
  };
}

function createRobotsDirective(index: boolean, follow: boolean) {
  return {
    follow,
    index,
  } satisfies NonNullable<Metadata["robots"]>;
}

function createOpenGraphImage(environment: SeoEnvironment) {
  return {
    alt: SOCIAL_IMAGE_ALT,
    height: SOCIAL_IMAGE_SIZE.height,
    type: SOCIAL_IMAGE_CONTENT_TYPE,
    url: createAbsoluteUrl(OPEN_GRAPH_IMAGE_PATH, environment),
    width: SOCIAL_IMAGE_SIZE.width,
  };
}

function createTwitterImage(environment: SeoEnvironment) {
  return {
    alt: SOCIAL_IMAGE_ALT,
    height: SOCIAL_IMAGE_SIZE.height,
    url: createAbsoluteUrl(TWITTER_IMAGE_PATH, environment),
    width: SOCIAL_IMAGE_SIZE.width,
  };
}

export {
  createPrivatePageMetadata,
  createPublicPageMetadata,
  createRootMetadata,
};
export type {
  PageMetadataDefinition,
  PrivatePageMetadataDefinition,
  PublicPageMetadataDefinition,
};
