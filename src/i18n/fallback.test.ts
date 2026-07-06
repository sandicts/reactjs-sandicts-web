import { describe, expect, it } from "vitest";
import { getI18nMessageFallback } from "./fallback";

describe("getI18nMessageFallback", () => {
  it("keeps missing messages visible and diagnosable", () => {
    expect(
      getI18nMessageFallback({
        key: "missing",
        namespace: "Example",
      }),
    ).toBe("[Example.missing]");
    expect(getI18nMessageFallback({ key: "missing" })).toBe("[missing]");
  });
});
