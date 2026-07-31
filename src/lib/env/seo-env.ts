import { parseAppEnvironment } from "./app-environment";

const DEFAULT_WEB_ORIGIN = "http://localhost:3001";

type SeoEnvironment = Readonly<{
  indexingEnabled: boolean;
  webOrigin: URL;
}>;

type SeoEnvironmentInput = Readonly<{
  appEnvironment?: string;
  indexingEnabled?: string;
  nodeEnvironment?: string;
  webOrigin?: string;
}>;

function createSeoEnvironment(
  input: SeoEnvironmentInput = {
    appEnvironment: process.env.NEXT_PUBLIC_APP_ENV,
    indexingEnabled: process.env.SEO_INDEXING_ENABLED,
    nodeEnvironment: process.env.NODE_ENV,
    webOrigin: process.env.WEB_ORIGIN,
  },
): SeoEnvironment {
  const appEnvironment = parseAppEnvironment(input.appEnvironment);
  const indexingEnabled = parseIndexingEnabled(input.indexingEnabled);
  const webOrigin = parseWebOrigin(input.webOrigin);

  if (
    indexingEnabled &&
    input.nodeEnvironment === "production" &&
    appEnvironment !== "production"
  ) {
    throw new Error(
      "SEO_INDEXING_ENABLED must be false in production builds outside the production deployment.",
    );
  }

  if (
    indexingEnabled &&
    input.nodeEnvironment === "production" &&
    (webOrigin.protocol !== "https:" || isLocalHostname(webOrigin.hostname))
  ) {
    throw new Error(
      "WEB_ORIGIN must use HTTPS and a non-local hostname when SEO indexing is enabled in production.",
    );
  }

  return {
    indexingEnabled,
    webOrigin,
  };
}

function parseIndexingEnabled(value: string | undefined) {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue || normalizedValue === "false") {
    return false;
  }

  if (normalizedValue === "true") {
    return true;
  }

  throw new Error('SEO_INDEXING_ENABLED must be either "true" or "false".');
}

function parseWebOrigin(value: string | undefined) {
  const candidate = value?.trim() || DEFAULT_WEB_ORIGIN;
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(candidate);
  } catch {
    throw new Error("WEB_ORIGIN must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("WEB_ORIGIN must use the HTTP or HTTPS protocol.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("WEB_ORIGIN must not contain credentials.");
  }

  if (
    parsedUrl.pathname !== "/" ||
    parsedUrl.search.length > 0 ||
    parsedUrl.hash.length > 0
  ) {
    throw new Error(
      "WEB_ORIGIN must contain only the origin, without a path, query, or hash.",
    );
  }

  return new URL(parsedUrl.origin);
}

function isLocalHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  return (
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname === "::1" ||
    normalizedHostname === "0.0.0.0" ||
    normalizedHostname.startsWith("127.")
  );
}

const seoEnv = createSeoEnvironment();

export { DEFAULT_WEB_ORIGIN, createSeoEnvironment, isLocalHostname, seoEnv };
export type { SeoEnvironment, SeoEnvironmentInput };
