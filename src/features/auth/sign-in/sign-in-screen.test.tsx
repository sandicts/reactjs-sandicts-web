/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import { SignInScreen } from "./sign-in-screen";

const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "unauthenticated" } as AuthSessionLifecycle,
  retrySessionVerification: vi.fn(),
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useAuthSession: () => authSessionMock,
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    authSessionMock.lifecycle = { status: "unauthenticated" };
    authSessionMock.retrySessionVerification.mockReset();
  });

  it("renders the responsive sign-in hierarchy and provider-owned host", () => {
    renderWithI18n(<SignInScreen returnTo="/app/reservations" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Entre para continuar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Entre na sua conta",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Preparando acesso com Google…" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("ou continue por e-mail"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("sign-in-session-surface")).toHaveAttribute(
      "data-return-intent",
      "present",
    );
  });

  it("shows the canonical expiry copy from the URL without requiring runtime history", () => {
    renderWithI18n(<SignInScreen reason="session-expired" />);

    expect(screen.getByText("Sua sessão expirou")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Entre novamente para continuar. Alterações não salvas não foram mantidas.",
      ),
    ).toBeInTheDocument();
  });

  it("offers only session verification retry after a recoverable failure", () => {
    authSessionMock.lifecycle = {
      status: "recoverable-error",
      reason: "network",
    };

    renderWithI18n(<SignInScreen />);

    fireEvent.click(
      screen.getByRole("button", { name: "Verificar novamente" }),
    );

    expect(authSessionMock.retrySessionVerification).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("region", { name: "Preparando acesso com Google…" }),
    ).not.toBeInTheDocument();
  });

  it("keeps an authenticated account on a safe public handoff", () => {
    authSessionMock.lifecycle = {
      status: "authenticated",
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
    };

    renderWithI18n(<SignInScreen returnTo="/organizations/arena" />);

    expect(screen.getByText("Sua sessão está ativa")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voltar ao início" }),
    ).toHaveAttribute("href", "/");
    expect(screen.queryByText("/organizations/arena")).not.toBeInTheDocument();
  });
});
