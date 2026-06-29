/**
 * @vitest-environment jsdom
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";
import type { AuthSessionSnapshot } from "@/lib/auth/auth-session.types";
import { createQueryClient } from "@/lib/query/query-client";
import { useGoogleSignIn } from "./use-google-sign-in";

const fetchMock = vi.fn<typeof fetch>();

const authSession = {
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: {
    id: "session-id",
  },
  accessToken: "access-token",
  accessTokenExpiresAt: "2026-06-28T01:00:00.000Z",
} satisfies AuthSessionSnapshot;

let queryClient = createQueryClient();

describe("useGoogleSignIn", () => {
  beforeEach(() => {
    queryClient = createQueryClient();
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
    fetchMock.mockResolvedValueOnce(jsonResponse(200, authSession));

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
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("clears a previous session when sign-in fails", async () => {
    setAuthSession(authSession);
    fetchMock.mockResolvedValueOnce(
      jsonResponse(400, {
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

    expect(getAuthSession()).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

function renderUseGoogleSignIn() {
  return renderHook(() => useGoogleSignIn(), {
    wrapper: QueryClientTestWrapper,
  });
}

function QueryClientTestWrapper({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}
