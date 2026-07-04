/**
 * @vitest-environment jsdom
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { AppShellNavigation } from "./app-shell-navigation";
import { PLAYER_NAVIGATION_GROUPS } from "./navigation.constants";

describe("AppShellNavigation", () => {
  it("renders the stable Player order and marks the route-owned destination", () => {
    render(
      <AppShellNavigation
        ariaLabel="Navegação Player"
        groups={PLAYER_NAVIGATION_GROUPS}
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
