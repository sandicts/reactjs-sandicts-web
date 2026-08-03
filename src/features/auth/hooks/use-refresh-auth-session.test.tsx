/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import {
  authSession,
  createAuthQueryClient,
  createJsonResponse,
  createQueryClientTestWrapper,
} from "./auth-hooks.test-utils";
import { useRefreshAuthSession } from "./use-refresh-auth-session";

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createAuthQueryClient();

describe("useRefreshAuthSession", () => {
  beforeEach(() => {
    queryClient = createAuthQueryClient();
    fetchMock.mockReset();
    clearAuthSession();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    queryClient.clear();
    clearAuthSession();
    vi.unstubAllGlobals();
  });

  it("persists the authenticated session after a successful refresh", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, authSession));

    const { result } = renderUseRefreshAuthSession();

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getAuthSession()).toEqual(authSession);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("clears a previous session when refresh fails", async () => {
    setAuthSession(authSession);
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(401, {
        statusCode: 401,
        code: "unauthorized",
        message: "Refresh session is invalid",
        path: "/auth/refresh",
        timestamp: "2026-06-28T00:00:00.000Z",
        requestId: "request-id",
      }),
    );

    const { result } = renderUseRefreshAuthSession();

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getAuthSession()).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

function renderUseRefreshAuthSession() {
  return renderHook(() => useRefreshAuthSession(), {
    wrapper: createQueryClientTestWrapper(queryClient),
  });
}
