/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { AccountMenu } from "./account-menu";

const authSessionMock = vi.hoisted(() => ({
  lifecycle: {
    status: "authenticated",
    account: {
      displayName: "Lucas Lima",
      email: "lucas@example.com",
      id: "account-id",
    },
    session: { id: "session-id" },
  },
}));
const signOutMock = vi.hoisted(() => ({
  failureReason: null as "rate-limited" | "unavailable" | null,
  isError: false,
  isPending: false,
  mutate: vi.fn(),
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useOptionalAuthSession: () => authSessionMock,
}));

vi.mock("@/features/auth/hooks/use-sign-out", () => ({
  useSignOut: () => signOutMock,
}));

describe("AccountMenu", () => {
  beforeEach(() => {
    signOutMock.failureReason = null;
    signOutMock.isError = false;
    signOutMock.isPending = false;
    signOutMock.mutate.mockReset();
  });

  it("shows account identity and exposes sign-out from the authenticated shell", () => {
    renderWithI18n(<AccountMenu />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu da conta de Lucas Lima",
      }),
    );

    expect(screen.getByText("lucas@example.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sair da conta" }));

    expect(signOutMock.mutate).toHaveBeenCalledOnce();
  });

  it("keeps a failed sign-out recoverable and states that the session is active", () => {
    signOutMock.failureReason = "unavailable";
    signOutMock.isError = true;

    renderWithI18n(<AccountMenu />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu da conta de Lucas Lima",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível confirmar a saída. Sua conta permanece aberta nesta tela. Tente novamente.",
    );
    expect(screen.getByRole("button", { name: "Sair da conta" })).toBeEnabled();
  });

  it("disables repeated attempts while sign-out is pending", () => {
    signOutMock.isPending = true;

    renderWithI18n(<AccountMenu />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu da conta de Lucas Lima",
      }),
    );

    expect(screen.getByRole("button", { name: "Saindo…" })).toBeDisabled();
  });
});
