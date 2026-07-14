import { describe, expect, it } from "vitest";
import type { AppContextOption } from "./app-context.types";
import {
  getContextInitials,
  getContextsByKind,
  getCurrentContext,
} from "./context-switcher.utils";

const contexts: readonly AppContextOption[] = [
  {
    id: "player",
    kind: "player",
    label: "Player",
    homeHref: "/app",
  },
  {
    id: "arena-sul",
    kind: "organization",
    label: "Arena Sul",
    homeHref: "/organizations/arena-sul",
    current: true,
  },
  {
    id: "arena-norte",
    kind: "organization",
    label: "Arena Norte",
    homeHref: "/organizations/arena-norte",
  },
];

describe("context-switcher utils", () => {
  it("selects the current context when one is marked current", () => {
    expect(getCurrentContext(contexts)).toEqual(contexts[1]);
  });

  it("falls back to the first context when none is marked current", () => {
    expect(getCurrentContext([{ ...contexts[0] }, { ...contexts[2] }])).toEqual(
      contexts[0],
    );
  });

  it("groups contexts by kind", () => {
    expect(getContextsByKind(contexts, "organization")).toEqual([
      contexts[1],
      contexts[2],
    ]);
  });

  it("derives the two-letter context initials", () => {
    expect(getContextInitials("Arena Sul")).toBe("AR");
  });
});
