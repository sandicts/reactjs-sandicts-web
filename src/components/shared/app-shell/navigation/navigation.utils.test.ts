import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import {
  createOrganizationNavigationGroups,
  PLAYER_NAVIGATION_GROUPS,
} from "./navigation.constants";
import { getActiveNavigationItem } from "./navigation.utils";

describe("app shell navigation matching", () => {
  it("keeps the Player home exact while nested routes select their owner", () => {
    expect(
      getActiveNavigationItem(APP_ROUTES.player.home, PLAYER_NAVIGATION_GROUPS)
        ?.id,
    ).toBe("home");
    expect(
      getActiveNavigationItem(
        `${APP_ROUTES.player.reservations}/reservation-1`,
        PLAYER_NAVIGATION_GROUPS,
      )?.id,
    ).toBe("reservations");
    expect(
      getActiveNavigationItem(
        `${APP_ROUTES.player.openMatches}/new`,
        PLAYER_NAVIGATION_GROUPS,
      )?.id,
    ).toBe("open-matches");
  });

  it("chooses the most specific Organization destination", () => {
    const groups = createOrganizationNavigationGroups("arena-sul");

    expect(
      getActiveNavigationItem("/organizations/arena-sul/calendar", groups)?.id,
    ).toBe("calendar");
    expect(
      getActiveNavigationItem(
        "/organizations/arena-sul/calendar/configuration",
        groups,
      )?.id,
    ).toBe("availability");
  });

  it("adds only capability-backed Organization destinations", () => {
    const baseGroups = createOrganizationNavigationGroups("arena-sul");
    const extendedGroups = createOrganizationNavigationGroups("arena-sul", {
      units: true,
      members: true,
    });

    expect(baseGroups.flatMap((group) => group.items)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "units" }),
        expect.objectContaining({ id: "members" }),
      ]),
    );
    expect(extendedGroups.flatMap((group) => group.items)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "units" }),
        expect.objectContaining({ id: "members" }),
      ]),
    );
  });
});
