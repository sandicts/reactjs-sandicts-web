/**
 * @vitest-environment jsdom
 */

import { forwardRef } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

const TestIcon = forwardRef<SVGSVGElement, Omit<IconProps, "ref">>(
  function TestIcon(props, ref) {
    return <svg data-testid="status-badge-icon" ref={ref} {...props} />;
  },
) as Icon;

describe("StatusBadge", () => {
  it("renders a neutral status by default", () => {
    render(<StatusBadge label="Aguardando" />);

    const badge = screen.getByText("Aguardando");

    expect(badge).toHaveAttribute("data-slot", "status-badge");
    expect(badge).toHaveAttribute("data-tone", "neutral");
    expect(badge).toHaveAttribute("data-variant", "outline");
  });

  it("maps semantic tones to presentation variants and keeps icons decorative", () => {
    render(<StatusBadge label="Confirmada" tone="success" Icon={TestIcon} />);

    const badge = screen.getByText("Confirmada");

    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveAttribute("data-variant", "success");
    expect(screen.getByTestId("status-badge-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
