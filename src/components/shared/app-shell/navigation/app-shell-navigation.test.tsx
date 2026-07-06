/**
 * @vitest-environment jsdom
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { PLAYER_NAVIGATION_LABELS } from "@test/fixtures/navigation-labels";
import { AppShellNavigation } from "./app-shell-navigation";
import { createPlayerNavigationGroups } from "./navigation.constants";

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
  });
});
