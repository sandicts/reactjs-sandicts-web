/**
 * @vitest-environment jsdom
 */

import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { PublicShell } from "./public-shell";

function renderPublicShell() {
  return renderWithI18n(
    <PublicShell>
      <main>Conteúdo público</main>
    </PublicShell>,
  );
}

describe("PublicShell", () => {
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
});
