/**
 * @vitest-environment jsdom
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { PlayerProfileOnboardingPrototype } from "./player-profile-onboarding-prototype";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect() {}
      observe() {}
      unobserve() {}
    },
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("PlayerProfileOnboardingPrototype", () => {
  it("validates on submit and focuses the first invalid field", async () => {
    const user = userEvent.setup();

    renderWithI18n(<PlayerProfileOnboardingPrototype />);

    await user.click(screen.getByRole("button", { name: "Continuar" }));

    const displayName = screen.getByRole("textbox", {
      name: "Nome de exibição",
    });

    expect(displayName).toHaveFocus();
    expect(displayName).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText("Informe seu nome de exibição."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Escolha seu esporte principal."),
    ).toBeInTheDocument();
  });

  it("supports the card radio groups and completes a mocked atomic save", async () => {
    const user = userEvent.setup();

    renderWithI18n(<PlayerProfileOnboardingPrototype />);

    await user.type(
      screen.getByRole("textbox", { name: "Nome de exibição" }),
      "  Lucas Lima  ",
    );
    await user.click(screen.getByRole("radio", { name: "Futevôlei" }));
    await user.click(
      screen.getByRole("radio", {
        name: /Intermediário.*Chegando lá/,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(
      screen.getByRole("button", { name: "Salvando perfil…" }),
    ).toBeDisabled();

    expect(await screen.findByText("Perfil salvo.")).toBeVisible();
    expect(
      screen.getByText(/A continuação Player foi revalidada/),
    ).toBeVisible();
  });

  it("opens the dirty-form exit confirmation with the safe action first", async () => {
    const user = userEvent.setup();

    renderWithI18n(<PlayerProfileOnboardingPrototype />);

    await user.type(
      screen.getByRole("textbox", { name: "Nome de exibição" }),
      "Lucas",
    );
    const exitButton = screen.getByRole("button", { name: "Sair" });
    await user.click(exitButton);

    expect(
      screen.getByRole("alertdialog", {
        name: "Sair sem concluir o perfil?",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Continuar preenchendo" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(exitButton).toHaveFocus();
  });
});
