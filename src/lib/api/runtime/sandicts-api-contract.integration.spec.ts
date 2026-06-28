import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeMagicLinkControllerConsume,
  getCurrentAuthSessionControllerGetCurrentSession,
  googleSignInControllerSignIn,
  requestMagicLinkControllerRequest,
} from "@/lib/api/generated/sandicts-api/auth/auth";
import {
  clearAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import {
  isKnownSandictsApiErrorCode,
  parseSandictsApiError,
} from "./sandicts-api-error";

const fetchMock = vi.fn<typeof fetch>();

describe("Sandicts API cross-stack contract", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    clearAuthSession();
  });

  afterEach(() => {
    clearAuthSession();
    vi.unstubAllGlobals();
  });

  it("reads the generated 202 magic link success contract", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(202, {
        status: "accepted",
      }),
    );

    const result = await requestMagicLinkControllerRequest({
      email: "player@example.com",
    });

    expect(result).toEqual({ status: "accepted" });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      credentials: "include",
      method: "POST",
    });
  });

  it.each([
    {
      statusCode: 400,
      code: "validation_error",
      operation: () =>
        requestMagicLinkControllerRequest({ email: "invalid-email" }),
      issues: [{ path: ["email"], message: "Invalid email" }],
    },
    {
      statusCode: 409,
      code: "magic_link_already_used",
      operation: () =>
        consumeMagicLinkControllerConsume({ token: "already-used-token" }),
    },
    {
      statusCode: 410,
      code: "magic_link_expired",
      operation: () =>
        consumeMagicLinkControllerConsume({ token: "expired-token" }),
    },
    {
      statusCode: 429,
      code: "rate_limited",
      operation: () =>
        requestMagicLinkControllerRequest({ email: "player@example.com" }),
    },
    {
      statusCode: 503,
      code: "email_delivery_unavailable",
      operation: () =>
        requestMagicLinkControllerRequest({ email: "player@example.com" }),
    },
    {
      statusCode: 500,
      code: "internal_error",
      operation: () =>
        requestMagicLinkControllerRequest({ email: "player@example.com" }),
    },
  ])(
    "preserves $statusCode $code from the generated error contract",
    async ({ code, issues, operation, statusCode }) => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse(statusCode, {
          statusCode,
          code,
          message: `Public ${code} message`,
          path: "/auth/magic-link",
          timestamp: "2026-06-28T00:00:00.000Z",
          requestId: "request-id",
          issues,
        }),
      );

      await expect(operation()).rejects.toMatchObject({
        statusCode,
        code,
        message: `Public ${code} message`,
        path: "/auth/magic-link",
        requestId: "request-id",
        issues,
      });
    },
  );

  it("does not refresh a public sign-in request after a semantic 401", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(401, {
        statusCode: 401,
        code: "invalid_google_credential",
        message: "Google credential is invalid",
        path: "/auth/google/sign-in",
        timestamp: "2026-06-28T00:00:00.000Z",
        requestId: "request-id",
      }),
    );

    await expect(
      googleSignInControllerSignIn({ credential: "invalid-google-token" }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "invalid_google_credential",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("refreshes once and retries an authenticated current-session read", async () => {
    setAuthSession({
      account: {
        id: "account-id",
        email: "player@example.com",
        displayName: "Player",
      },
      session: {
        id: "old-session-id",
      },
      accessToken: "old-access-token",
      accessTokenExpiresAt: "2026-06-28T00:15:00.000Z",
    });

    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, {
          statusCode: 401,
          code: "invalid_access_token",
          message: "Access token is invalid",
          path: "/auth/me",
          timestamp: "2026-06-28T00:00:00.000Z",
          requestId: "request-id-1",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, {
          account: {
            id: "account-id",
            email: "player@example.com",
            displayName: "Player",
          },
          session: {
            id: "new-session-id",
          },
          accessToken: "new-access-token",
          accessTokenExpiresAt: "2026-06-28T00:30:00.000Z",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, {
          account: {
            id: "account-id",
            email: "player@example.com",
            displayName: "Player",
          },
          session: {
            id: "new-session-id",
          },
        }),
      );

    const result = await getCurrentAuthSessionControllerGetCurrentSession();

    expect(result.session.id).toBe("new-session-id");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(readAuthorizationHeader(fetchMock.mock.calls[0]?.[1])).toBe(
      "Bearer old-access-token",
    );
    expect(readAuthorizationHeader(fetchMock.mock.calls[2]?.[1])).toBe(
      "Bearer new-access-token",
    );
  });

  it("preserves an unknown future code while exposing known-code detection", async () => {
    const error = await parseSandictsApiError(
      jsonResponse(409, {
        statusCode: 409,
        code: "future_policy_conflict",
        message: "A future policy rejected the request",
        path: "/future",
        timestamp: "2026-06-28T00:00:00.000Z",
        requestId: "request-id",
      }),
    );

    expect(error.code).toBe("future_policy_conflict");
    expect(isKnownSandictsApiErrorCode(error.code)).toBe(false);
    expect(isKnownSandictsApiErrorCode("magic_link_expired")).toBe(true);
  });
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function readAuthorizationHeader(options: RequestInit | undefined) {
  return new Headers(options?.headers).get("Authorization");
}
