/**
 * @vitest-environment jsdom
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import {
  getAuthSession,
  resetAuthSessionRuntime,
} from "@/lib/auth/auth-session-store";
import { MagicLinkCallbackScreen } from "./magic-link-callback-screen";

const consumeMock = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
}));
const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));
vi.mock("@/lib/api/generated/sandicts-api/auth/auth", () => ({
  useConsumeMagicLinkControllerConsume: () => consumeMock,
}));

const authSession = {
  accessToken: "access-token",
  accessTokenExpiresAt: "2026-08-27T03:00:00.000Z",
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: { id: "session-id" },
};

describe("MagicLinkCallbackScreen", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    consumeMock.mutateAsync.mockReset();
    routerMock.replace.mockReset();
    resetAuthSessionRuntime();
  });

  afterEach(() => {
    queryClient.clear();
    resetAuthSessionRuntime();
  });

  it("scrubs the token, consumes it once, and hydrates the shared session", async () => {
    const token = "a".repeat(32);
    window.history.replaceState({}, "", `/sign-in/magic-link?token=${token}`);
    consumeMock.mutateAsync.mockResolvedValue(authSession);

    renderCallback();

    await waitFor(() => {
      expect(consumeMock.mutateAsync).toHaveBeenCalledWith({ data: { token } });
    });
    expect(window.location.pathname).toBe("/sign-in/magic-link");
    expect(window.location.search).toBe("");

    await waitFor(() => {
      expect(getAuthSession()).toEqual(authSession);
      expect(routerMock.replace).toHaveBeenCalledWith("/");
    });
  });

  it("rejects a malformed link without sending it to the API", async () => {
    window.history.replaceState({}, "", "/sign-in/magic-link?token=short");

    renderCallback();

    expect(
      await screen.findByRole("heading", { name: "Este link não é válido" }),
    ).toBeInTheDocument();
    expect(window.location.search).toBe("");
    expect(consumeMock.mutateAsync).not.toHaveBeenCalled();
  });

  it("rejects an ambiguous callback with more than one token", async () => {
    window.history.replaceState(
      {},
      "",
      `/sign-in/magic-link?token=${"a".repeat(32)}&token=${"b".repeat(32)}`,
    );

    renderCallback();

    expect(
      await screen.findByRole("heading", { name: "Este link não é válido" }),
    ).toBeInTheDocument();
    expect(window.location.search).toBe("");
    expect(consumeMock.mutateAsync).not.toHaveBeenCalled();
  });

  function renderCallback() {
    return renderWithI18n(
      <QueryClientProvider client={queryClient}>
        <MagicLinkCallbackScreen />
      </QueryClientProvider>,
    );
  }
});
