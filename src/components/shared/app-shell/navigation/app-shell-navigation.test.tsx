/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import {
  ORGANIZATION_NAVIGATION_LABELS,
  PLAYER_NAVIGATION_LABELS,
} from "@test/fixtures/navigation-labels";
import { AppShellNavigation } from "./app-shell-navigation";
import {
  createOrganizationNavigationGroups,
  createPlayerNavigationGroups,
} from "./navigation.constants";

vi.mock("next/link", () => ({
  default: ({
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

describe("AppShellNavigation", () => {
  it("renders the stable Player order and marks the route-owned destination", () => {
    const groups = createPlayerNavigationGroups(PLAYER_NAVIGATION_LABELS);

    render(
      <AppShellNavigation
        ariaLabel="Navegação Player"
        groups={groups}
        pathname={`${APP_ROUTES.player.reservations}/reservation-1`}
        presentation="bottom"
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Navegação Player",
    });
    const links = within(navigation).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Início",
      "Explorar",
      "Reservas",
      "Partidas",
      "Perfil",
    ]);
    expect(
      within(navigation).getByRole("link", { name: "Reservas" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(navigation).getByRole("link", { name: "Início" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      within(navigation).queryByRole("heading", { name: "Player" }),
    ).not.toBeInTheDocument();
  });

  it("renders adaptive navigation titles and active organization state", () => {
    const groups = createOrganizationNavigationGroups(
      "arena-sul",
      ORGANIZATION_NAVIGATION_LABELS,
    );

    render(
      <AppShellNavigation
        ariaLabel="Navegação da organização"
        groups={groups}
        pathname="/organizations/arena-sul/calendar"
        presentation="adaptive"
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Navegação da organização",
    });
    const calendarLink = within(navigation).getByRole("link", {
      name: "Agenda",
    });

    expect(
      within(navigation).getByRole("heading", { name: "Visão geral" }),
    ).toBeInTheDocument();
    expect(calendarLink).toHaveAttribute("title", "Agenda");
    expect(calendarLink).toHaveAttribute("aria-current", "page");
  });

  it("calls onNavigate when a drawer link is selected", () => {
    const groups = createOrganizationNavigationGroups(
      "arena-sul",
      ORGANIZATION_NAVIGATION_LABELS,
    );
    const onNavigate = vi.fn();

    render(
      <AppShellNavigation
        ariaLabel="Navegação da organização"
        groups={groups}
        pathname="/organizations/arena-sul/calendar"
        presentation="drawer"
        onNavigate={onNavigate}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Navegação da organização",
    });
    const calendarLink = within(navigation).getByRole("link", {
      name: "Agenda",
    });

    fireEvent.click(calendarLink);

    expect(calendarLink).not.toHaveAttribute("title");
    expect(calendarLink).toHaveAttribute("aria-current", "page");
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
