/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  getAuthSession,
  getAuthSessionLifecycle,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import { queryKeys } from "@/lib/query/query-keys";
import {
  authSession,
  createAuthQueryClient,
  createJsonResponse,
  createQueryClientTestWrapper,
} from "./auth-hooks.test-utils";
import { useSignOut } from "./use-sign-out";

const navigationMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));
const fetchMock = vi.fn<typeof fetch>();
const discoveryFilters = { city: "Santos" };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: navigationMock.replace }),
}));

let queryClient = createAuthQueryClient();

describe("useSignOut", () => {
  beforeEach(() => {
    queryClient = createAuthQueryClient();
    fetchMock.mockReset();
    navigationMock.replace.mockReset();
    clearAuthSession();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    queryClient.clear();
    clearAuthSession();
    vi.unstubAllGlobals();
  });

  it("revokes the session, clears private state, and replace-navigates to sign-in", async () => {
    seedAuthenticatedState();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const { result } = renderUseSignOut();

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getAuthSession()).toBeNull();
    expect(getAuthSessionLifecycle()).toEqual({ status: "unauthenticated" });
    expect(queryClient.getQueryState(queryKeys.auth.session())).toBeUndefined();
    expect(
      queryClient.getQueryState(queryKeys.playerProfile.current()),
    ).toBeUndefined();
    expect(
      queryClient.getQueryData(queryKeys.courts.discovery(discoveryFilters)),
    ).toEqual({ courts: ["Praia Sul"] });
    expect(queryClient.getMutationCache().getAll()).toHaveLength(1);
    expect(
      queryClient.getMutationCache().getAll()[0]?.options.mutationKey,
    ).toEqual(["signOutControllerSignOutCurrentSession"]);
    expect(navigationMock.replace).toHaveBeenCalledWith("/sign-in");
    expect(fetchMock).toHaveBeenCalledOnce();

    const [, requestOptions] = fetchMock.mock.calls[0] ?? [];

    expect(requestOptions?.method).toBe("POST");
    expect(requestOptions?.credentials).toBe("include");
    expect(new Headers(requestOptions?.headers).get("Authorization")).toBe(
      "Bearer access-token",
    );
  });

  it("keeps the authenticated state and exposes a recoverable rate-limit failure", async () => {
    seedAuthenticatedState();
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(429, {
        statusCode: 429,
        code: "rate_limited",
        message: "Too many requests",
        path: "/auth/sign-out",
        timestamp: "2026-08-28T18:00:00.000Z",
        requestId: "request-id",
      }),
    );

    const { result } = renderUseSignOut();

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.failureReason).toBe("rate-limited");
    expect(getAuthSession()).toEqual(authSession);
    expect(queryClient.getQueryData(queryKeys.auth.session())).toEqual({
      account: authSession.account,
      session: authSession.session,
    });
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("finishes local sign-out without an expiry state when the session is already invalid", async () => {
    seedAuthenticatedState();
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse(401, {
          statusCode: 401,
          code: "invalid_access_token",
          message: "Invalid access token",
          path: "/auth/sign-out",
          timestamp: "2026-08-28T18:00:00.000Z",
          requestId: "sign-out-request-id",
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse(401, {
          statusCode: 401,
          code: "refresh_token_revoked",
          message: "Refresh token revoked",
          path: "/auth/refresh",
          timestamp: "2026-08-28T18:00:01.000Z",
          requestId: "refresh-request-id",
        }),
      );

    const { result } = renderUseSignOut();

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(navigationMock.replace).toHaveBeenCalledWith("/sign-in");
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getAuthSession()).toBeNull();
    expect(getAuthSessionLifecycle()).toEqual({ status: "unauthenticated" });
    expect(queryClient.getQueryState(queryKeys.auth.session())).toBeUndefined();
  });
});

function seedAuthenticatedState() {
  setAuthSession(authSession);
  queryClient.setQueryData(queryKeys.auth.session(), {
    account: authSession.account,
    session: authSession.session,
  });
  queryClient.setQueryData(queryKeys.playerProfile.current(), {
    displayName: "Player",
  });
  queryClient.setQueryData(queryKeys.courts.discovery(discoveryFilters), {
    courts: ["Praia Sul"],
  });
  queryClient.getMutationCache().build(queryClient, {
    mutationKey: ["googleSignInControllerSignIn"],
    mutationFn: () => Promise.resolve(authSession),
  });
}

function renderUseSignOut() {
  return renderHook(() => useSignOut(), {
    wrapper: createQueryClientTestWrapper(queryClient),
  });
}
