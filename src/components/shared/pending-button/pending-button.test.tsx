/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PendingButton } from "./pending-button";

describe("PendingButton", () => {
  it("renders as a normal enabled button when no action is pending", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <PendingButton
        pending={false}
        pendingLabel="Salvando…"
        type="button"
        onClick={onClick}
      >
        Salvar
      </PendingButton>,
    );

    const button = screen.getByRole("button", { name: "Salvar" });

    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables duplicate interaction and announces the pending label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <PendingButton
        pending
        pendingLabel="Salvando…"
        type="button"
        onClick={onClick}
      >
        Salvar
      </PendingButton>,
    );

    const button = screen.getByRole("button", { name: "Salvando…" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});
