import { describe, expect, it } from "vitest";
import { formatRouteSlugLabel } from "./route-labels";

describe("formatRouteSlugLabel", () => {
  it("turns a route slug into a readable temporary context label", () => {
    expect(formatRouteSlugLabel("arena-sul")).toBe("Arena Sul");
    expect(formatRouteSlugLabel("centro_treinamento")).toBe(
      "Centro Treinamento",
    );
  });
});
