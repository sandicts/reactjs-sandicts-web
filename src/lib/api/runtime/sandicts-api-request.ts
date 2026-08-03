import { getAuthAccessToken } from "@/lib/auth/auth-session-store";
import { publicEnv } from "@/lib/env/public-env";
import {
  isSandictsAuthUrl,
  isRefreshAuthSessionUrl,
  refreshSandictsAuthSession,
} from "./sandicts-api-auth";
import { SandictsApiError, parseSandictsApiError } from "./sandicts-api-error";

const unauthorizedStatusCode = 401;
const emptyResponseStatusCodes = new Set([204, 205, 304]);

async function sandictsApiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  if (!publicEnv.authEnabled && isSandictsAuthUrl(url)) {
    throw new Error(
      "Browser authentication is disabled for this deployment environment.",
    );
  }

  const targetUrl = buildSandictsApiUrl(url);
  const requestOptions = buildRequestOptions(options);

  let response = await fetch(targetUrl, requestOptions);

  if (await shouldRetryAfterRefresh(response, url, requestOptions)) {
    response = await fetch(targetUrl, buildRequestOptions(options));
  }

  return readSandictsApiResponse<T>(response);
}

function buildSandictsApiUrl(url: string) {
  try {
    return new URL(url).toString();
  } catch {
    return new URL(url, publicEnv.apiBaseUrl).toString();
  }
}

function buildRequestOptions(options: RequestInit) {
  return {
    ...options,
    credentials: "include" as RequestCredentials,
    headers: buildHeaders(options.headers, options.body),
  };
}

function buildHeaders(
  headers: HeadersInit | undefined,
  body: BodyInit | null | undefined,
) {
  const nextHeaders = new Headers(headers);
  const accessToken = getAuthAccessToken();

  if (!nextHeaders.has("Accept")) {
    nextHeaders.set("Accept", "application/json");
  }

  if (
    body &&
    shouldSetJsonContentType(body) &&
    !nextHeaders.has("Content-Type")
  ) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (accessToken && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return nextHeaders;
}

function shouldSetJsonContentType(body: BodyInit) {
  return typeof body === "string";
}

async function shouldRetryAfterRefresh(
  response: Response,
  url: string,
  requestOptions: RequestInit,
) {
  if (
    response.status !== unauthorizedStatusCode ||
    isRefreshAuthSessionUrl(url) ||
    !hasBearerAccessToken(requestOptions)
  ) {
    return false;
  }

  return refreshSandictsAuthSession();
}

function hasBearerAccessToken(options: RequestInit) {
  const authorization = new Headers(options.headers).get("Authorization");

  return authorization?.startsWith("Bearer ") === true;
}

async function readSandictsApiResponse<T>(response: Response) {
  if (!response.ok) {
    throw await parseSandictsApiError(response);
  }

  if (emptyResponseStatusCodes.has(response.status) || !response.body) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { sandictsApiRequest };
export type BodyType<BodyData> = BodyData;
export type ErrorType<ErrorResponse = unknown> =
  SandictsApiError<ErrorResponse>;
