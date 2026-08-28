/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { ProtectedRouteBoundary } from "./protected-route-boundary";
import type { ProtectedRouteResourceAccess } from "./protected-route-boundary.types";

const navigationMock = vi.hoisted(() => ({
  pathname: "/app/reservations",
  replace: vi.fn(),
  search: "status=open",
}));

const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "checking" } as {
    account?: { displayName: string | null; email: string; id: string };
    reason?: string;
    session?: { id: string };
    status: string;
  },
  retrySessionVerification: vi.fn<() => Promise<void>>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
  useRouter: () => ({ replace: navigationMock.replace }),
  useSearchParams: () => new URLSearchParams(navigationMock.search),
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useAuthSession: () => authSessionMock,
}));

describe("ProtectedRouteBoundary", () => {
  beforeEach(() => {
    navigationMock.pathname = "/app/reservations";
    navigationMock.replace.mockReset();
    navigationMock.search = "status=open";
    authSessionMock.lifecycle = { status: "checking" };
    authSessionMock.retrySessionVerification.mockReset();
    authSessionMock.retrySessionVerification.mockResolvedValue();
    window.history.replaceState(
      null,
      "",
      "/app/reservations?status=open#details",
    );
  });

  it("keeps the private shell and content unmounted while checking", () => {
    renderBoundary();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Verificando sua sessão…",
    );
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("renders the authenticated shell and protected content", () => {
    setAuthenticatedLifecycle();

    renderBoundary();

    expect(screen.getByTestId("private-shell")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo privado")).toBeInTheDocument();
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("replace-navigates signed-out access with a safe return route and no expiry reason", async () => {
    authSessionMock.lifecycle = { status: "unauthenticated" };

    renderBoundary();

    await waitFor(() =>
      expect(navigationMock.replace).toHaveBeenCalledWith(
        "/sign-in?returnTo=%2Fapp%2Freservations%3Fstatus%3Dopen%23details",
      ),
    );
    expect(navigationMock.replace).toHaveBeenCalledOnce();
    expect(navigationMock.replace.mock.calls[0]?.[0]).not.toContain("reason=");
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
  });

  it("replace-navigates confirmed expiry once under Strict Mode", async () => {
    authSessionMock.lifecycle = { status: "expired" };

    renderBoundary("allowed", true);

    await waitFor(() =>
      expect(navigationMock.replace).toHaveBeenCalledWith(
        "/sign-in?reason=session-expired&returnTo=%2Fapp%2Freservations%3Fstatus%3Dopen%23details",
      ),
    );
    expect(navigationMock.replace).toHaveBeenCalledOnce();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
  });

  it("shows a recoverable state, retries verification, and does not redirect", () => {
    authSessionMock.lifecycle = {
      status: "recoverable-error",
      reason: "network",
    };

    renderBoundary();

    fireEvent.click(
      screen.getByRole("button", { name: "Verificar novamente" }),
    );

    expect(authSessionMock.retrySessionVerification).toHaveBeenCalledOnce();
    expect(navigationMock.replace).not.toHaveBeenCalled();
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
  });

  it("keeps API unavailability outside the private shell", () => {
    authSessionMock.lifecycle = {
      status: "api-unavailable",
      reason: "server",
    };

    renderBoundary();

    expect(
      screen.getByRole("heading", { name: "Não foi possível entrar agora" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("uses a minimal public boundary for account auth forbidden", () => {
    authSessionMock.lifecycle = { status: "forbidden" };

    renderBoundary();

    expect(
      screen.getByRole("heading", {
        name: "Você não tem acesso a esta área",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
    expect(authSessionMock.retrySessionVerification).not.toHaveBeenCalled();
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("preserves the authenticated shell for a resource forbidden decision", () => {
    setAuthenticatedLifecycle();

    renderBoundary("forbidden");

    expect(screen.getByTestId("private-shell")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Você não tem acesso a esta área",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
    expect(authSessionMock.retrySessionVerification).not.toHaveBeenCalled();
    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("fails closed while resource authorization is unresolved", () => {
    setAuthenticatedLifecycle();

    renderBoundary("checking");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Verificando seu acesso…",
    );
    expect(screen.queryByTestId("private-shell")).not.toBeInTheDocument();
    expect(screen.queryByText("Conteúdo privado")).not.toBeInTheDocument();
  });

  it("drops a secret-bearing return route instead of reflecting it", async () => {
    authSessionMock.lifecycle = { status: "unauthenticated" };
    navigationMock.pathname = "/app";
    navigationMock.search = "token=secret";
    window.history.replaceState(null, "", "/app?token=secret");

    renderBoundary();

    await waitFor(() =>
      expect(navigationMock.replace).toHaveBeenCalledWith("/sign-in"),
    );
    expect(navigationMock.replace.mock.calls[0]?.[0]).not.toContain("secret");
  });
});

function renderBoundary(
  resourceAccess: ProtectedRouteResourceAccess = "allowed",
  strict = false,
) {
  const boundary = (
    <ProtectedRouteBoundary
      resourceAccess={resourceAccess}
      renderAuthenticatedShell={(content) => (
        <div data-testid="private-shell">{content}</div>
      )}
    >
      <p>Conteúdo privado</p>
    </ProtectedRouteBoundary>
  );

  return renderWithI18n(
    strict ? <StrictMode>{boundary}</StrictMode> : boundary,
  );
}

function setAuthenticatedLifecycle() {
  authSessionMock.lifecycle = {
    status: "authenticated",
    account: {
      displayName: "Player",
      email: "player@example.com",
      id: "account-id",
    },
    session: { id: "session-id" },
  };
}
