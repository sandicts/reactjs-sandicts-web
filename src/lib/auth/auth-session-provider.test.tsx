/**
 * @vitest-environment jsdom
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import {
  AuthSessionProvider,
  resetInitialAuthSession,
  useAuthSession,
} from "./auth-session-provider";
import { resetAuthSessionRuntime } from "./auth-session-store";

const fetchMock = vi.fn<typeof fetch>();
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

let queryClient = createQueryClient();

describe("AuthSessionProvider", () => {
  beforeEach(() => {
    queryClient = createQueryClient();
    fetchMock.mockReset();
    resetInitialAuthSession();
    resetAuthSessionRuntime();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    queryClient.clear();
    resetInitialAuthSession();
    resetAuthSessionRuntime();
    vi.unstubAllGlobals();
  });

  it("hydrates once under Strict Mode and seeds only the public projection", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, authSession));

    renderProvider(true);

    await screen.findByText("authenticated");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(queryKeys.auth.session())).toEqual({
      account: authSession.account,
      session: authSession.session,
    });
    expect(queryClient.getQueryData(queryKeys.auth.session())).not.toHaveProperty(
      "accessToken",
    );
  });

  it("treats an initial terminal rejection as unauthenticated", async () => {
    fetchMock.mockResolvedValueOnce(
      authErrorResponse(401, "invalid_refresh_token"),
    );

    renderProvider();

    await screen.findByText("unauthenticated");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("keeps network failure recoverable without retrying refresh", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    renderProvider();

    await screen.findByText("recoverable-error");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("distinguishes API unavailability from expiry", async () => {
    fetchMock.mockResolvedValueOnce(authErrorResponse(500, "internal_error"));

    renderProvider();

    await screen.findByText("api-unavailable");
    expect(screen.queryByText("expired")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

function SessionProbe() {
  const { lifecycle } = useAuthSession();

  return <span>{lifecycle.status}</span>;
}

function renderProvider(strict = false) {
  const tree = (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <SessionProbe />
      </AuthSessionProvider>
    </QueryClientProvider>
  );

  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function authErrorResponse(statusCode: number, code: string) {
  return jsonResponse(statusCode, {
    statusCode,
    code,
    message: "Public auth error",
    path: "/auth/refresh",
    timestamp: "2026-08-04T17:00:00.000Z",
    requestId: "request-id",
  });
}
