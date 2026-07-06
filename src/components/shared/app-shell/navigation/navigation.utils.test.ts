import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import {
  ORGANIZATION_NAVIGATION_LABELS,
  PLAYER_NAVIGATION_LABELS,
} from "@test/fixtures/navigation-labels";
import {
  createOrganizationNavigationGroups,
  createPlayerNavigationGroups,
} from "./navigation.constants";
import { getActiveNavigationItem } from "./navigation.utils";

describe("app shell navigation matching", () => {
  it("keeps the Player home exact while nested routes select their owner", () => {
    const groups = createPlayerNavigationGroups(PLAYER_NAVIGATION_LABELS);

    expect(getActiveNavigationItem(APP_ROUTES.player.home, groups)?.id).toBe(
      "home",
    );
    expect(
      getActiveNavigationItem(
        `${APP_ROUTES.player.reservations}/reservation-1`,
        groups,
      )?.id,
    ).toBe("reservations");
    expect(
      getActiveNavigationItem(`${APP_ROUTES.player.openMatches}/new`, groups)
        ?.id,
    ).toBe("open-matches");
  });

  it("chooses the most specific Organization destination", () => {
    const groups = createOrganizationNavigationGroups(
      "arena-sul",
      ORGANIZATION_NAVIGATION_LABELS,
    );

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
    const baseGroups = createOrganizationNavigationGroups(
      "arena-sul",
      ORGANIZATION_NAVIGATION_LABELS,
    );
    const extendedGroups = createOrganizationNavigationGroups(
      "arena-sul",
      ORGANIZATION_NAVIGATION_LABELS,
      {
        units: true,
        members: true,
      },
    );

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
