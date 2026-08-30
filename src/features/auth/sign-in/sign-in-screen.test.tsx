/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import { SignInScreen } from "./sign-in-screen";

const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "unauthenticated" } as AuthSessionLifecycle,
  retrySessionVerification: vi.fn(),
}));
const googleSignInMock = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
}));
const magicLinkMock = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
}));
const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useAuthSession: () => authSessionMock,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));
vi.mock("@/lib/env/public-env", () => ({
  publicEnv: {
    googleClientId: "local-client-id.apps.googleusercontent.com",
  },
}));
vi.mock("@/features/auth/hooks/use-google-sign-in", () => ({
  useGoogleSignIn: () => ({
    error: null,
    isError: false,
    isPending: false,
    mutate: googleSignInMock.mutate,
    reset: googleSignInMock.reset,
  }),
}));
vi.mock("@/lib/api/generated/sandicts-api/auth/auth", () => ({
  useRequestMagicLinkControllerRequest: () => magicLinkMock,
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    authSessionMock.lifecycle = { status: "unauthenticated" };
    authSessionMock.retrySessionVerification.mockReset();
    googleSignInMock.mutate.mockReset();
    googleSignInMock.reset.mockReset();
    magicLinkMock.mutateAsync.mockReset();
    routerMock.replace.mockReset();
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
    expect(screen.getByText("ou continue por e-mail")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar link" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("note", { name: "Beta fechado para convidados" }),
    ).toHaveTextContent(
      "O acesso está disponível somente para testadores convidados.",
    );
    expect(
      screen.getByRole("note", { name: "Beta fechado para convidados" }),
    ).toHaveTextContent("você pode solicitar a exclusão dos seus dados");
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

  it("resumes a safe protected destination after authentication", async () => {
    authSessionMock.lifecycle = {
      status: "authenticated",
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
    };

    renderWithI18n(<SignInScreen returnTo="/app/reservations" />);

    expect(
      screen.getByRole("region", { name: "Preparando sua área…" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Sua sessão está ativa")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledOnce();
    });
    expect(routerMock.replace).toHaveBeenCalledWith("/app/reservations");
  });

  it("does not invent a destination when the authenticated context is unresolved", () => {
    authSessionMock.lifecycle = {
      status: "authenticated",
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
    };

    renderWithI18n(<SignInScreen />);

    expect(screen.getByText("Sua sessão está ativa")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voltar ao início" }),
    ).toHaveAttribute("href", "/");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});
