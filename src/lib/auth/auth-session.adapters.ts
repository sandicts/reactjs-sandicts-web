import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import {
  authSessionProjectionSchema,
  authSessionSnapshotSchema,
} from "./auth-session.schemas";
import type {
  AuthSessionProjection,
  AuthSessionRefreshRejectionReason,
  AuthSessionRefreshResult,
  AuthSessionSnapshot,
} from "./auth-session.types";

const terminalRefreshErrorReasons = new Map<
  string,
  AuthSessionRefreshRejectionReason
>([
  ["auth_session_inactive", "inactive"],
  ["invalid_refresh_token", "invalid"],
  ["refresh_token_expired", "expired"],
  ["refresh_token_reused", "reused"],
  ["refresh_token_revoked", "revoked"],
]);

class AuthSessionContractError extends Error {
  constructor() {
    super("The API returned an invalid authentication session contract.");
    this.name = "AuthSessionContractError";
  }
}

function adaptAuthSessionSnapshot(value: unknown): AuthSessionSnapshot {
  const result = authSessionSnapshotSchema.safeParse(value);

  if (!result.success) {
    throw new AuthSessionContractError();
  }

  return result.data;
}

function adaptAuthSessionProjection(value: unknown): AuthSessionProjection {
  const result = authSessionProjectionSchema.safeParse(value);

  if (!result.success) {
    throw new AuthSessionContractError();
  }

  return result.data;
}

function toAuthSessionProjection(
  snapshot: AuthSessionSnapshot,
): AuthSessionProjection {
  return {
    account: snapshot.account,
    session: snapshot.session,
  };
}

function classifyAuthSessionFailure(error: unknown): AuthSessionRefreshResult {
  if (isSandictsApiError(error)) {
    if (error.statusCode === 401) {
      return {
        kind: "rejected",
        reason: terminalRefreshErrorReasons.get(error.code) ?? "invalid",
      };
    }

    if (error.statusCode === 403) {
      return { kind: "forbidden" };
    }

    if (error.statusCode === 429) {
      return { kind: "rate-limited" };
    }

    if (error.statusCode >= 500) {
      return { kind: "unavailable", cause: "server" };
    }
  }

  if (isAbortError(error)) {
    return { kind: "temporarily-unavailable", cause: "timeout" };
  }

  if (error instanceof TypeError) {
    return { kind: "temporarily-unavailable", cause: "network" };
  }

  return { kind: "temporarily-unavailable", cause: "unexpected" };
}

function isAbortError(error: unknown) {
  return (
    (typeof DOMException !== "undefined" &&
      error instanceof DOMException &&
      error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export {
  adaptAuthSessionProjection,
  adaptAuthSessionSnapshot,
  AuthSessionContractError,
  classifyAuthSessionFailure,
  toAuthSessionProjection,
};
