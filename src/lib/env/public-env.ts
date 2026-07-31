import { parseAppEnvironment } from "./app-environment";

const defaultApiBaseUrl = "http://localhost:3000";

type PublicEnvironmentInput = Readonly<{
  apiBaseUrl?: string;
  appEnvironment?: string;
  authEnabled?: string;
  googleClientId?: string;
  googleOneTapEnabled?: string;
}>;

function createPublicEnvironment(
  input: PublicEnvironmentInput = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    appEnvironment: process.env.NEXT_PUBLIC_APP_ENV,
    authEnabled: process.env.NEXT_PUBLIC_AUTH_ENABLED,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    googleOneTapEnabled: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED,
  },
) {
  const appEnvironment = parseAppEnvironment(input.appEnvironment);
  const apiBaseUrl = parseApiBaseUrl(input.apiBaseUrl);
  const authEnabled = parseBoolean(
    "NEXT_PUBLIC_AUTH_ENABLED",
    input.authEnabled,
    appEnvironment !== "pr-preview",
  );
  const googleClientId = input.googleClientId?.trim() || null;
  const googleOneTapEnabled = parseBoolean(
    "NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED",
    input.googleOneTapEnabled,
    false,
  );

  if (appEnvironment !== "local" && !apiBaseUrl.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must use HTTPS outside local development.",
    );
  }

  if (appEnvironment === "pr-preview" && authEnabled) {
    throw new Error(
      "NEXT_PUBLIC_AUTH_ENABLED must be false in pr-preview deployments.",
    );
  }

  if (googleOneTapEnabled && (!authEnabled || !googleClientId)) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED requires browser authentication and NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
    );
  }

  return {
    apiBaseUrl,
    appEnvironment,
    authEnabled,
    googleClientId,
    googleOneTapEnabled,
  } as const;
}

function parseApiBaseUrl(value: string | undefined) {
  const candidate = value?.trim() || defaultApiBaseUrl;
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(candidate);
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must use the HTTP or HTTPS protocol.",
    );
  }

  if (
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must not contain credentials, a query, or a hash.",
    );
  }

  const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");

  return `${parsedUrl.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
}

function parseBoolean(
  name: string,
  value: string | undefined,
  defaultValue: boolean,
) {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return defaultValue;
  }

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  throw new Error(`${name} must be either "true" or "false".`);
}

const publicEnv = createPublicEnvironment();

export { createPublicEnvironment, defaultApiBaseUrl, publicEnv };
export type { PublicEnvironmentInput };
