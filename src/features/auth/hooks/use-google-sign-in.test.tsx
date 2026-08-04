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
import { queryKeys } from "@/lib/query/query-keys";
import {
  authSession,
  createAuthQueryClient,
  createJsonResponse,
  createQueryClientTestWrapper,
} from "./auth-hooks.test-utils";
import { useGoogleSignIn } from "./use-google-sign-in";

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createAuthQueryClient();

describe("useGoogleSignIn", () => {
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

  it("persists the authenticated session after a successful sign-in", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, authSession));

    const { result } = renderUseGoogleSignIn();

    act(() => {
      result.current.mutate({
        data: { credential: "google-identity-token" },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getAuthSession()).toEqual(authSession);
    expect(queryClient.getQueryData(queryKeys.auth.session())).toEqual({
      account: authSession.account,
      session: authSession.session,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("preserves an established session when a new Google interaction fails", async () => {
    setAuthSession(authSession);
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(400, {
        statusCode: 400,
        code: "validation_error",
        message: "Google credential is required",
        path: "/auth/google/sign-in",
        timestamp: "2026-06-28T00:00:00.000Z",
        requestId: "request-id",
      }),
    );

    const { result } = renderUseGoogleSignIn();

    act(() => {
      result.current.mutate({
        data: { credential: "invalid-google-token" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getAuthSession()).toEqual(authSession);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

function renderUseGoogleSignIn() {
  return renderHook(() => useGoogleSignIn(), {
    wrapper: createQueryClientTestWrapper(queryClient),
  });
}
