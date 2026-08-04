import {
  clearAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import type { AuthSessionSnapshot } from "@/lib/auth/auth-session.types";
import { publicEnv } from "@/lib/env/public-env";
import { parseSandictsApiError } from "./sandicts-api-error";

const refreshAuthSessionPath = "/auth/refresh";
const authPathPrefix = "/auth/";

let inFlightRefreshAuthSession: Promise<boolean> | null = null;

function isRefreshAuthSessionUrl(url: string) {
  return readUrlPath(url) === refreshAuthSessionPath;
}

function isSandictsAuthUrl(url: string) {
  return readUrlPath(url).startsWith(authPathPrefix);
}

async function refreshSandictsAuthSession() {
  if (!publicEnv.authEnabled) {
    clearAuthSession();

    return false;
  }

  inFlightRefreshAuthSession ??= executeRefreshAuthSession().finally(() => {
    inFlightRefreshAuthSession = null;
  });

  return inFlightRefreshAuthSession;
}

async function executeRefreshAuthSession() {
  try {
    const response = await fetch(
      `${publicEnv.apiBaseUrl}${refreshAuthSessionPath}`,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      throw await parseSandictsApiError(response);
    }

    const responseBody = (await response.json()) as unknown;

    if (!isAuthSessionSnapshot(responseBody)) {
      clearAuthSession();

      return false;
    }

    setAuthSession(responseBody);

    return true;
  } catch {
    clearAuthSession();

    return false;
  }
}

function isAuthSessionSnapshot(value: unknown): value is AuthSessionSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSessionSnapshot>;

  return (
    typeof candidate.accessToken === "string" &&
    typeof candidate.accessTokenExpiresAt === "string" &&
    isAccount(candidate.account) &&
    isSession(candidate.session)
  );
}

function isAccount(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSessionSnapshot["account"]>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    (typeof candidate.displayName === "string" ||
      candidate.displayName === null)
  );
}

function isSession(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSessionSnapshot["session"]>;

  return typeof candidate.id === "string";
}

function readUrlPath(url: string) {
  try {
    return new URL(url, publicEnv.apiBaseUrl).pathname;
  } catch {
    return url;
  }
}

export {
  isSandictsAuthUrl,
  isRefreshAuthSessionUrl,
  refreshAuthSessionPath,
  refreshSandictsAuthSession,
};
