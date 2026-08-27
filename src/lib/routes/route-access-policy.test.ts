import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "./app-routes";
import {
  isGoogleOneTapEligibleRoute,
  resolveRouteAccessPolicy,
} from "./route-access-policy";

describe("resolveRouteAccessPolicy", () => {
  it.each([
    [APP_ROUTES.public.home, "public-home"],
    [APP_ROUTES.public.discovery, "public-discovery-home"],
    [APP_ROUTES.public.signIn, "public-sign-in"],
  ])("marks %s as a public One Tap route", (pathname, id) => {
    expect(resolveRouteAccessPolicy(pathname)).toEqual({
      access: "public",
      googleOneTap: "eligible",
      id,
    });
    expect(isGoogleOneTapEligibleRoute(pathname)).toBe(true);
  });

  it("normalizes a query, hash, and trailing slash before matching", () => {
    expect(
      resolveRouteAccessPolicy(
        `${APP_ROUTES.public.signIn}/?reason=session-expired#content`,
      ),
    ).toEqual({
      access: "public",
      googleOneTap: "eligible",
      id: "public-sign-in",
    });
  });

  it("keeps the magic-link callback public and One Tap ineligible", () => {
    expect(
      resolveRouteAccessPolicy(
        `${APP_ROUTES.public.magicLinkCallback}?token=transient`,
      ),
    ).toEqual({
      access: "public",
      googleOneTap: "ineligible",
      id: "public-magic-link-callback",
    });
    expect(
      isGoogleOneTapEligibleRoute(APP_ROUTES.public.magicLinkCallback),
    ).toBe(false);
  });

  it.each([
    [APP_ROUTES.player.legacyHome, "player-legacy-redirect"],
    [APP_ROUTES.player.home, "player-app"],
    [`${APP_ROUTES.player.reservations}/reservation-1`, "player-app"],
    ["/organizations/arena-sul", "organization-app"],
    ["/organizations/arena-sul/calendar", "organization-app"],
  ])("marks %s as protected and One Tap ineligible", (pathname, id) => {
    expect(resolveRouteAccessPolicy(pathname)).toEqual({
      access: "protected",
      googleOneTap: "ineligible",
      id,
    });
    expect(isGoogleOneTapEligibleRoute(pathname)).toBe(false);
  });

  it.each([
    "/discovery/courts",
    "/courts/quadra-central",
    "/organizations",
    "/players/player-1",
    "/academies/academy-1",
    "/not-yet-classified",
    "https://sandicts.com.br/",
  ])("fails closed for an unclassified route: %s", (pathname) => {
    expect(resolveRouteAccessPolicy(pathname)).toEqual({
      access: "unknown",
      googleOneTap: "ineligible",
      id: "unknown",
    });
    expect(isGoogleOneTapEligibleRoute(pathname)).toBe(false);
  });
});
