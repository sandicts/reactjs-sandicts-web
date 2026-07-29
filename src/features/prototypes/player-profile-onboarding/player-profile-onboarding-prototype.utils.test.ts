import { describe, expect, it } from "vitest";
import {
  DEFAULT_LEVEL_SCALES,
  LARGE_SPORT_CATALOG,
} from "./player-profile-onboarding-prototype.constants";
import {
  filterSports,
  getLevelsForSport,
  isLevelValidForSport,
} from "./player-profile-onboarding-prototype.utils";

describe("player profile onboarding prototype utilities", () => {
  it("searches active sports case-insensitively by displayed name", () => {
    expect(
      filterSports(LARGE_SPORT_CATALOG, "BEACH").map((sport) => sport.name),
    ).toEqual(["Beach Tennis"]);
  });

  it("returns active levels in API order and validates their relationship", () => {
    const levels = getLevelsForSport(
      LARGE_SPORT_CATALOG,
      DEFAULT_LEVEL_SCALES,
      "sport-futevolei",
    );

    expect(levels.map((level) => level.code)).toEqual([
      "rookie",
      "beginner",
      "intermediate",
      "advanced",
    ]);
    expect(
      isLevelValidForSport(
        LARGE_SPORT_CATALOG,
        DEFAULT_LEVEL_SCALES,
        "sport-futevolei",
        "level-intermediate",
      ),
    ).toBe(true);
    expect(
      isLevelValidForSport(
        LARGE_SPORT_CATALOG,
        DEFAULT_LEVEL_SCALES,
        "sport-futevolei",
        "level-unknown",
      ),
    ).toBe(false);
  });
});
