/**
 * @vitest-environment jsdom
 */

import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import { PublicShell } from "./public-shell";

const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "unauthenticated" } as AuthSessionLifecycle,
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useOptionalAuthSession: () => authSessionMock,
}));

function renderPublicShell() {
  return renderWithI18n(
    <PublicShell>
      <main>Conteúdo público</main>
    </PublicShell>,
  );
}

describe("PublicShell", () => {
  beforeEach(() => {
    authSessionMock.lifecycle = { status: "unauthenticated" };
  });

  it("renders public navigation and children", () => {
    renderPublicShell();

    const navigation = screen.getByRole("navigation", {
      name: "Navegação pública",
    });

    expect(
      screen.getByRole("link", { name: "Sandicts — início" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(navigation).getByRole("link", { name: /Explorar/ }),
    ).toHaveAttribute("href", "/discovery");
    expect(
      within(navigation).getByRole("link", { name: "Entrar" }),
    ).toHaveAttribute("href", "/sign-in");
    expect(screen.getByText("Conteúdo público")).toBeInTheDocument();
  });

  it("shows the authenticated identity without inventing a context destination", () => {
    authSessionMock.lifecycle = {
      status: "authenticated",
      account: {
        displayName: "Player",
        email: "player@example.com",
        id: "account-id",
      },
      session: { id: "session-id" },
    };

    renderPublicShell();

    const navigation = screen.getByRole("navigation", {
      name: "Navegação pública",
    });

    expect(within(navigation).getByText("Player")).toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", { name: "Entrar" }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", { name: "Player" }),
    ).not.toBeInTheDocument();
  });
});
