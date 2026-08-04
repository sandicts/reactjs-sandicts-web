/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "./loading-region";

describe("LoadingRegion", () => {
  it("marks the pending region as busy and exposes accessible status text", () => {
    render(
      <LoadingRegion label="Carregando reservas">
        <Skeleton className="h-12 w-full" />
      </LoadingRegion>,
    );

    expect(
      screen.getByRole("region", { name: "Carregando reservas" }),
    ).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Carregando reservas");
  });

  it("keeps visual skeletons decorative", () => {
    render(<Skeleton data-testid="decorative-skeleton" className="h-6 w-20" />);

    expect(screen.getByTestId("decorative-skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
