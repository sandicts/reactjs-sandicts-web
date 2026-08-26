import { describe, expect, it } from "vitest";
import { SandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import {
  adaptAuthSessionProjection,
  adaptAuthSessionSnapshot,
  AuthSessionContractError,
  classifyAuthSessionFailure,
  toAuthSessionProjection,
} from "./auth-session.adapters";

const authSession = {
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: { id: "session-id" },
  accessToken: "access-token",
  accessTokenExpiresAt: "2026-08-04T18:00:00.000Z",
};

describe("auth session adapters", () => {
  it("validates a session snapshot and removes credentials from its projection", () => {
    const snapshot = adaptAuthSessionSnapshot(authSession);

    expect(toAuthSessionProjection(snapshot)).toEqual({
      account: authSession.account,
      session: authSession.session,
    });
    expect(toAuthSessionProjection(snapshot)).not.toHaveProperty("accessToken");
  });

  it("rejects an invalid transport contract", () => {
    expect(() =>
      adaptAuthSessionSnapshot({ ...authSession, accessToken: "" }),
    ).toThrow(AuthSessionContractError);
    expect(() => adaptAuthSessionProjection({ account: null })).toThrow(
      AuthSessionContractError,
    );
  });

  it.each([
    [401, "refresh_token_expired", { kind: "rejected", reason: "expired" }],
    [401, "refresh_token_reused", { kind: "rejected", reason: "reused" }],
    [403, "account_auth_forbidden", { kind: "forbidden" }],
    [429, "rate_limited", { kind: "rate-limited" }],
    [500, "internal_error", { kind: "unavailable", cause: "server" }],
  ])(
    "classifies HTTP %s without leaking its transport message",
    (statusCode, code, expected) => {
      const error = new SandictsApiError({
        code,
        message: "Transport detail",
        path: "/auth/refresh",
        requestId: "request-id",
        statusCode,
        timestamp: "2026-08-04T17:00:00.000Z",
      });

      expect(classifyAuthSessionFailure(error)).toEqual(expected);
    },
  );

  it("distinguishes network and timeout failures", () => {
    expect(
      classifyAuthSessionFailure(new TypeError("Failed to fetch")),
    ).toEqual({ kind: "temporarily-unavailable", cause: "network" });

    const timeout = new Error("aborted");
    timeout.name = "AbortError";

    expect(classifyAuthSessionFailure(timeout)).toEqual({
      kind: "temporarily-unavailable",
      cause: "timeout",
    });
  });
});
