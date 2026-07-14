/**
 * @vitest-environment jsdom
 */

import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { PlayerShell } from "./player-shell";
import type { PlayerShellProps } from "./player-shell.types";

const navigationMock = vi.hoisted(() => ({
  pathname: "/app/reservations",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
}));

type RenderPlayerShellOptions = Partial<PlayerShellProps>;

function renderPlayerShell({
  children = <p>Conteúdo Player</p>,
  ...props
}: RenderPlayerShellOptions = {}) {
  return renderWithI18n(<PlayerShell {...props}>{children}</PlayerShell>);
}

describe("PlayerShell", () => {
  beforeEach(() => {
    navigationMock.pathname = "/app/reservations";
  });

  it("renders the active Player route, navigations, and main content", () => {
    renderPlayerShell();

    const navigations = screen.getAllByRole("navigation", {
      name: "Navegação Player",
    });

    expect(navigations).toHaveLength(2);
    expect(screen.getAllByText("Reservas").length).toBeGreaterThan(0);
    expect(
      within(navigations[0]).getByRole("link", { name: "Reservas" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(navigations[1]).getByRole("link", { name: "Reservas" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(screen.getByRole("main")).getByText("Conteúdo Player"),
    ).toBeInTheDocument();
  });

  it("uses the default Player context when contexts are not provided", () => {
    renderPlayerShell();

    expect(screen.getByText("Contexto atual")).toBeInTheDocument();
    expect(screen.getAllByText("Player").length).toBeGreaterThan(0);
  });

  it("uses custom contexts when provided", () => {
    renderPlayerShell({
      contexts: [
        {
          id: "player",
          kind: "player",
          label: "Minha área",
          homeHref: "/app",
          current: true,
        },
      ],
    });

    expect(screen.getByText("Minha área")).toBeInTheDocument();
  });
});
