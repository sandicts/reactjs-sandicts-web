import { describe, expect, it } from "vitest";
import { maximumReturnToLength, readSafeReturnTo } from "./safe-return-to";

const webOrigin = new URL("https://sandicts.example");

describe("readSafeReturnTo", () => {
  it.each([
    ["/app", "/app"],
    [
      "/app/reservations?status=open#next",
      "/app/reservations?status=open#next",
    ],
    ["/organizations/arena/calendar", "/organizations/arena/calendar"],
  ])(
    "preserves a structurally safe internal destination",
    (value, expected) => {
      expect(readSafeReturnTo(value, webOrigin)).toBe(expected);
    },
  );

  it.each([
    "https://evil.example/app",
    "https://sandicts.example/app",
    "//evil.example/app",
    "/\\evil.example/app",
    "/%2f%2fevil.example/app",
    "/%5cevil.example/app",
    "/sign-in",
    "/sign-in/magic-link",
    "/%73ign-in",
    "/%2573ign-in",
    "/auth/callback",
    "/app/%",
    "/app?next=%E0%A4%A",
    "/app?access_token=secret",
    "/app?email=player@example.com",
    "/app#refresh_token=secret",
  ])("rejects an unsafe destination: %s", (value) => {
    expect(readSafeReturnTo(value, webOrigin)).toBeNull();
  });

  it("rejects oversized and ambiguous values", () => {
    expect(
      readSafeReturnTo(`/${"a".repeat(maximumReturnToLength)}`, webOrigin),
    ).toBeNull();
    expect(readSafeReturnTo("/app\n/next", webOrigin)).toBeNull();
    expect(readSafeReturnTo(undefined, webOrigin)).toBeNull();
  });
});
