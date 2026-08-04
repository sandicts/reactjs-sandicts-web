/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { OrganizationShell } from "./organization-shell";
import type { OrganizationShellProps } from "./organization-shell.types";

const navigationMock = vi.hoisted(() => ({
  pathname: "/organizations/arena-sul/calendar",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
}));

type RenderOrganizationShellOptions = Partial<OrganizationShellProps>;

function renderOrganizationShell({
  children = <p>Conteúdo operacional</p>,
  organizationSlug = "arena-sul",
  ...props
}: RenderOrganizationShellOptions = {}) {
  return renderWithI18n(
    <OrganizationShell organizationSlug={organizationSlug} {...props}>
      {children}
    </OrganizationShell>,
  );
}

describe("OrganizationShell", () => {
  beforeEach(() => {
    navigationMock.pathname = "/organizations/arena-sul/calendar";
  });

  it("renders the active organization route and main content", () => {
    renderOrganizationShell({ organizationLabel: "Arena Sul" });

    const navigation = screen.getByRole("navigation", {
      name: "Navegação da organização",
    });

    expect(screen.getByText("Organização")).toBeInTheDocument();
    expect(screen.getAllByText("Agenda").length).toBeGreaterThan(0);
    expect(
      within(navigation).getByRole("link", { name: "Agenda" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(screen.getByRole("main")).getByText("Conteúdo operacional"),
    ).toBeInTheDocument();
  });

  it("uses the default context label and renders capability gated links", () => {
    navigationMock.pathname = "/organizations/arena-sul";

    renderOrganizationShell({
      capabilities: {
        members: true,
        units: true,
      },
    });

    const navigation = screen.getByRole("navigation", {
      name: "Navegação da organização",
    });

    expect(screen.getAllByText("Organização").length).toBeGreaterThan(0);
    expect(
      within(navigation).getByRole("link", { name: "Unidades" }),
    ).toHaveAttribute("href", "/organizations/arena-sul/units");
    expect(
      within(navigation).getByRole("link", { name: "Membros" }),
    ).toHaveAttribute("href", "/organizations/arena-sul/settings/members");
  });

  it("opens the mobile drawer with organization navigation", () => {
    renderOrganizationShell({ organizationLabel: "Arena Sul" });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir navegação da organização",
      }),
    );

    const drawerNavigation = screen.getByRole("navigation", {
      name: "Navegação da organização",
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Arena Sul" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Navegue pelas áreas operacionais autorizadas."),
    ).toBeInTheDocument();
    expect(
      within(drawerNavigation).getByRole("link", { name: "Agenda" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
