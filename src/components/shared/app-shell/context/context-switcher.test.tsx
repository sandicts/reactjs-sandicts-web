/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AppContextOption } from "./app-context.types";
import { ContextSwitcher } from "./context-switcher";

const contexts: readonly AppContextOption[] = [
  {
    id: "player",
    kind: "player",
    label: "Player",
    homeHref: "/app",
    current: true,
  },
  {
    id: "arena-sul",
    kind: "organization",
    label: "Arena Sul",
    homeHref: "/organizations/arena-sul",
  },
  {
    id: "arena-norte",
    kind: "organization",
    label: "Arena Norte",
    homeHref: "/organizations/arena-norte",
  },
];

describe("ContextSwitcher", () => {
  it("identifies one context without rendering a switcher trigger", () => {
    render(<ContextSwitcher contexts={[contexts[0]]} />);

    expect(screen.getByText("Contexto atual")).toBeInTheDocument();
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /trocar contexto/i }),
    ).not.toBeInTheDocument();
  });

  it("groups multiple contexts in an accessible dialog", () => {
    render(<ContextSwitcher contexts={contexts} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Trocar contexto. Contexto atual: Player",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Trocar contexto" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Player" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Organizações" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Arena Sul/ })).toHaveAttribute(
      "href",
      "/organizations/arena-sul",
    );
    expect(screen.getByRole("link", { name: /Player/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
