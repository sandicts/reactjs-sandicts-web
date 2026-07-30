/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLockup } from "./brand-lockup";
import { BrandMark } from "./brand-mark";
import { BrandName } from "./brand-name";

describe("brand primitives", () => {
  it("keeps an unlabeled mark decorative", () => {
    render(<BrandMark data-testid="decorative-mark" />);
    const mark = screen.getByTestId("decorative-mark");

    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).not.toHaveAttribute("role");
  });

  it("exposes a single accessible image name for a standalone mark", () => {
    render(<BrandMark label="Símbolo Sandicts" size={24} />);

    expect(
      screen.getByRole("img", { name: "Símbolo Sandicts" }),
    ).toHaveAttribute("width", "24");
  });

  it("renders the brand name as Roboto-backed text", () => {
    render(<BrandName />);

    expect(screen.getByText("SANDICTS")).toHaveClass("font-brand");
  });

  it("supports stacked expressive fixture lockups without changing geometry", () => {
    render(
      <BrandLockup
        data-testid="fixture-lockup"
        orientation="stacked"
        treatment="expressive"
        variantId="celebration-fixture"
      />,
    );
    const lockup = screen.getByTestId("fixture-lockup");

    expect(lockup).toHaveAttribute("data-brand-variant", "celebration-fixture");
    expect(lockup).toHaveAttribute("data-brand-orientation", "stacked");
    expect(lockup).toHaveAttribute("data-brand-treatment", "expressive");
  });
});
