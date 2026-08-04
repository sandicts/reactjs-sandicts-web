import { describe, expect, it } from "vitest";
import { parseSignInSearchParams } from "./sign-in-search-params.schemas";

describe("parseSignInSearchParams", () => {
  it("accepts the approved expiry reason and a return hint", () => {
    expect(
      parseSignInSearchParams({
        reason: "session-expired",
        returnTo: "/app/reservations",
      }),
    ).toEqual({
      reason: "session-expired",
      returnTo: "/app/reservations",
    });
  });

  it.each([
    { reason: "unknown" },
    { reason: ["session-expired", "unknown"] },
    { returnTo: ["/app", "/organizations/arena"] },
  ])("discards malformed or ambiguous parameters", (value) => {
    expect(parseSignInSearchParams(value)).toEqual({});
  });
});
