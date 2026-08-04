import {
  hasEstablishedAuthSession,
  markAuthSessionApiUnavailable,
  markAuthSessionExpired,
  markAuthSessionForbidden,
  markAuthSessionRecoverableError,
  markAuthSessionUnauthenticated,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import {
  adaptAuthSessionSnapshot,
  AuthSessionContractError,
  classifyAuthSessionFailure,
} from "@/lib/auth/auth-session.adapters";
import type { AuthSessionRefreshResult } from "@/lib/auth/auth-session.types";
import { publicEnv } from "@/lib/env/public-env";
import { parseSandictsApiError } from "./sandicts-api-error";

const refreshAuthSessionPath = "/auth/refresh";
const authPathPrefix = "/auth/";

let inFlightRefreshAuthSession: Promise<AuthSessionRefreshResult> | null = null;

function isRefreshAuthSessionUrl(url: string) {
  return readUrlPath(url) === refreshAuthSessionPath;
}

function isSandictsAuthUrl(url: string) {
  return readUrlPath(url).startsWith(authPathPrefix);
}

async function refreshSandictsAuthSession() {
  if (!publicEnv.authEnabled) {
    const result = { kind: "unavailable", cause: "disabled" } as const;
    applyAuthSessionRefreshResult(result);

    return result;
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

    const snapshot = adaptAuthSessionSnapshot(responseBody);
    const result = { kind: "refreshed", snapshot } as const;

    applyAuthSessionRefreshResult(result);

    return result;
  } catch (error) {
    const result =
      error instanceof AuthSessionContractError
        ? ({ kind: "unavailable", cause: "invalid-response" } as const)
        : classifyAuthSessionFailure(error);

    applyAuthSessionRefreshResult(result);

    return result;
  }
}

function applyAuthSessionRefreshResult(result: AuthSessionRefreshResult) {
  switch (result.kind) {
    case "refreshed":
      setAuthSession(result.snapshot);
      return;
    case "rejected":
      if (hasEstablishedAuthSession()) {
        markAuthSessionExpired();
      } else {
        markAuthSessionUnauthenticated();
      }
      return;
    case "forbidden":
      markAuthSessionForbidden();
      return;
    case "rate-limited":
      markAuthSessionRecoverableError("rate-limited");
      return;
    case "temporarily-unavailable":
      markAuthSessionRecoverableError(result.cause);
      return;
    case "unavailable":
      markAuthSessionApiUnavailable(result.cause);
  }
}

function publishAuthSessionFailure(error: unknown) {
  const result = classifyAuthSessionFailure(error);

  applyAuthSessionRefreshResult(result);

  return result;
}

function readUrlPath(url: string) {
  try {
    return new URL(url, publicEnv.apiBaseUrl).pathname;
  } catch {
    return url;
  }
}

export {
  isRefreshAuthSessionUrl,
  isSandictsAuthUrl,
  publishAuthSessionFailure,
  refreshAuthSessionPath,
  refreshSandictsAuthSession,
};
