import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAuthSessionLifecycle,
  resetAuthSessionRuntime,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import {
  isSandictsAuthUrl,
  refreshSandictsAuthSession,
} from "./sandicts-api-auth";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  resetAuthSessionRuntime();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  resetAuthSessionRuntime();
  vi.unstubAllGlobals();
});

describe("isSandictsAuthUrl", () => {
  it.each([
    "/auth/refresh",
    "/auth/google/sign-in",
    "https://api.sandicts.com.br/auth/magic-link/request",
  ])("recognizes an authentication endpoint: %s", (url) => {
    expect(isSandictsAuthUrl(url)).toBe(true);
  });

  it.each(["/players/me", "/sports", "/authentication"])(
    "does not classify a non-auth endpoint as browser authentication: %s",
    (url) => {
      expect(isSandictsAuthUrl(url)).toBe(false);
    },
  );
});

describe("refreshSandictsAuthSession", () => {
  it("classifies the first terminal rejection as signed out", async () => {
    fetchMock.mockResolvedValueOnce(
      authErrorResponse(401, "refresh_token_expired"),
    );

    await expect(refreshSandictsAuthSession()).resolves.toEqual({
      kind: "rejected",
      reason: "expired",
    });
    expect(getAuthSessionLifecycle()).toEqual({ status: "unauthenticated" });
  });

  it("classifies a terminal rejection after authentication as expired", async () => {
    setAuthSession({
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
      accessToken: "access-token",
      accessTokenExpiresAt: "2026-08-04T18:00:00.000Z",
    });
    fetchMock.mockResolvedValueOnce(
      authErrorResponse(401, "refresh_token_revoked"),
    );

    await refreshSandictsAuthSession();

    expect(getAuthSessionLifecycle()).toEqual({ status: "expired" });
  });

  it("keeps concurrent refreshes single-flight", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          account: {
            displayName: "Player",
            email: "player@example.com",
            id: "account-id",
          },
          session: { id: "session-id" },
          accessToken: "access-token",
          accessTokenExpiresAt: "2026-08-04T18:00:00.000Z",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );

    const [firstResult, secondResult] = await Promise.all([
      refreshSandictsAuthSession(),
      refreshSandictsAuthSession(),
    ]);

    expect(firstResult).toEqual(secondResult);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("treats a malformed success payload as API unavailability", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ account: null }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(refreshSandictsAuthSession()).resolves.toEqual({
      kind: "unavailable",
      cause: "invalid-response",
    });
    expect(getAuthSessionLifecycle()).toEqual({
      status: "api-unavailable",
      reason: "invalid-response",
    });
  });
});

function authErrorResponse(statusCode: number, code: string) {
  return new Response(
    JSON.stringify({
      statusCode,
      code,
      message: "Public auth error",
      path: "/auth/refresh",
      timestamp: "2026-08-04T17:00:00.000Z",
      requestId: "request-id",
    }),
    { status: statusCode, headers: { "content-type": "application/json" } },
  );
}
