/**
 * @vitest-environment jsdom
 */

import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { OrganizationProtectedLayout } from "./organization-protected-layout";
import { PlayerProtectedLayout } from "./player-protected-layout";

const navigationMock = vi.hoisted(() => ({
  pathname: "/app",
  replace: vi.fn(),
}));

const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "checking" } as {
    account?: { displayName: string | null; email: string; id: string };
    session?: { id: string };
    status: string;
  },
  retrySessionVerification: vi.fn<() => Promise<void>>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
  useRouter: () => ({ replace: navigationMock.replace }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/auth/auth-session-provider", () => ({
  useAuthSession: () => authSessionMock,
}));

vi.mock("@/components/shared/app-shell/player/player-shell", () => ({
  PlayerShell: ({ children }: Readonly<{ children: ReactNode }>) => (
    <div data-testid="player-shell">{children}</div>
  ),
}));

vi.mock(
  "@/components/shared/app-shell/organization/organization-shell",
  () => ({
    OrganizationShell: ({
      children,
      organizationLabel,
      organizationSlug,
    }: Readonly<{
      children: ReactNode;
      organizationLabel: string;
      organizationSlug: string;
    }>) => (
      <div
        data-organization-label={organizationLabel}
        data-organization-slug={organizationSlug}
        data-testid="organization-shell"
      >
        {children}
      </div>
    ),
  }),
);

describe("protected layout integrations", () => {
  beforeEach(() => {
    authSessionMock.lifecycle = { status: "checking" };
    authSessionMock.retrySessionVerification.mockReset();
    navigationMock.replace.mockReset();
    window.history.replaceState(null, "", "/app");
  });

  it.each([
    ["Player", () => <PlayerProtectedLayout>Privado</PlayerProtectedLayout>],
    [
      "Organization",
      () => (
        <OrganizationProtectedLayout
          organizationLabel="Arena Sul"
          organizationSlug="arena-sul"
        >
          Privado
        </OrganizationProtectedLayout>
      ),
    ],
  ])("keeps the %s shell unmounted while checking", (_name, createLayout) => {
    renderWithI18n(createLayout());

    expect(screen.queryByText("Privado")).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-shell")).not.toBeInTheDocument();
    expect(screen.queryByTestId("organization-shell")).not.toBeInTheDocument();
  });

  it("releases the Player shell through the shared boundary contract", () => {
    setAuthenticatedLifecycle();

    renderWithI18n(
      <PlayerProtectedLayout>Conteúdo Player</PlayerProtectedLayout>,
    );

    expect(screen.getByTestId("player-shell")).toHaveTextContent(
      "Conteúdo Player",
    );
  });

  it("releases the Organization shell through the shared boundary contract", () => {
    setAuthenticatedLifecycle();
    navigationMock.pathname = "/organizations/arena-sul";

    renderWithI18n(
      <OrganizationProtectedLayout
        organizationLabel="Arena Sul"
        organizationSlug="arena-sul"
      >
        Conteúdo Organization
      </OrganizationProtectedLayout>,
    );

    expect(screen.getByTestId("organization-shell")).toHaveTextContent(
      "Conteúdo Organization",
    );
    expect(screen.getByTestId("organization-shell")).toHaveAttribute(
      "data-organization-slug",
      "arena-sul",
    );
  });
});

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
