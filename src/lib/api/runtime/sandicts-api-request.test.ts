import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAuthSessionLifecycle,
  resetAuthSessionRuntime,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import { sandictsApiRequest } from "./sandicts-api-request";

const fetchMock = vi.fn<typeof fetch>();

describe("sandictsApiRequest", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    resetAuthSessionRuntime();
    setAuthSession({
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
      accessToken: "access-token",
      accessTokenExpiresAt: "2026-08-28T04:00:00.000Z",
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    resetAuthSessionRuntime();
    vi.unstubAllGlobals();
  });

  it("does not refresh or clear a valid session after a resource 403", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          statusCode: 403,
          code: "forbidden",
          message: "Access denied",
          path: "/organizations/arena-sul",
          timestamp: "2026-08-28T03:00:00.000Z",
          requestId: "request-id",
        }),
        { status: 403, headers: { "content-type": "application/json" } },
      ),
    );

    await expect(
      sandictsApiRequest("/organizations/arena-sul"),
    ).rejects.toMatchObject({
      code: "forbidden",
      statusCode: 403,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(getAuthSessionLifecycle()).toMatchObject({
      status: "authenticated",
    });
  });
});
