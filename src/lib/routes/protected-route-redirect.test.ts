import { describe, expect, it } from "vitest";
import { maximumReturnToLength } from "./safe-return-to";
import {
  createProtectedRouteSignInHref,
  readSafeProtectedRouteReturnTo,
} from "./protected-route-redirect";

const webOrigin = new URL("https://sandicts.example");

describe("readSafeProtectedRouteReturnTo", () => {
  it.each([
    [
      "/app/reservations?status=open#next",
      "/app/reservations?status=open#next",
    ],
    ["/organizations/arena-sul/calendar", "/organizations/arena-sul/calendar"],
  ])("keeps a safe protected destination: %s", (value, expected) => {
    expect(readSafeProtectedRouteReturnTo(value, webOrigin)).toBe(expected);
  });

  it.each([
    "https://evil.example/app",
    "//evil.example/app",
    "/sign-in",
    "/sign-in/magic-link",
    "/auth/callback",
    "/discovery",
    "/not-yet-classified",
    "/app/%",
    "/app?access_token=secret",
    "/app?email=player@example.com",
    `/${"a".repeat(maximumReturnToLength)}`,
  ])("discards a non-protected or unsafe destination: %s", (value) => {
    expect(readSafeProtectedRouteReturnTo(value, webOrigin)).toBeNull();
  });
});

describe("createProtectedRouteSignInHref", () => {
  it("creates an ordinary sign-in replacement with a safe return route", () => {
    expect(
      createProtectedRouteSignInHref({
        currentLocation: "/app/reservations?status=open#next",
        sessionExpired: false,
        webOrigin,
      }),
    ).toBe("/sign-in?returnTo=%2Fapp%2Freservations%3Fstatus%3Dopen%23next");
  });

  it("adds the expiry reason before the safe return route", () => {
    expect(
      createProtectedRouteSignInHref({
        currentLocation: "/organizations/arena-sul/calendar",
        sessionExpired: true,
        webOrigin,
      }),
    ).toBe(
      "/sign-in?reason=session-expired&returnTo=%2Forganizations%2Farena-sul%2Fcalendar",
    );
  });

  it("omits an unsafe destination without reflecting it", () => {
    expect(
      createProtectedRouteSignInHref({
        currentLocation: "/app?token=secret",
        sessionExpired: false,
        webOrigin,
      }),
    ).toBe("/sign-in");
  });
});
