/**
 * @vitest-environment jsdom
 */

import { MapPin } from "lucide-react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaPlaceholder } from "./area-placeholder";

describe("AreaPlaceholder", () => {
  it("renders its content and a semantic link back to the app shell", () => {
    render(
      <AreaPlaceholder
        eyebrow="Player area"
        title="Discover courts and open matches."
        description="Find the next place to play."
        Icon={MapPin}
      />,
    );

    expect(screen.getByText("Player area")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Discover courts and open matches.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Find the next place to play."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to Sandicts" }),
    ).toHaveAttribute("href", "/");
  });
});
