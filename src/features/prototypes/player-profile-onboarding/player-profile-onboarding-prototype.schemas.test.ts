import { describe, expect, it } from "vitest";
import { createPlayerProfileOnboardingSchema } from "./player-profile-onboarding-prototype.schemas";

const messages = {
  displayNameRequired: "required name",
  displayNameMin: "short name",
  displayNameMax: "long name",
  sportRequired: "required sport",
  levelRequired: "required level",
};

const schema = createPlayerProfileOnboardingSchema({
  messages,
  isLevelValidForSport: (sportId, levelId) =>
    sportId === "sport-futevolei" && levelId === "level-intermediate",
});

describe("createPlayerProfileOnboardingSchema", () => {
  it("trims the display name and accepts a valid sport-level relationship", () => {
    expect(
      schema.parse({
        displayName: "  Lucas Lima  ",
        mainSportId: "sport-futevolei",
        mainSportLevelId: "level-intermediate",
      }),
    ).toEqual({
      displayName: "Lucas Lima",
      mainSportId: "sport-futevolei",
      mainSportLevelId: "level-intermediate",
    });
  });

  it("keeps required, length, and relationship failures on their fields", () => {
    const result = schema.safeParse({
      displayName: " ",
      mainSportId: "sport-futevolei",
      mainSportLevelId: "level-advanced",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        displayName: expect.arrayContaining(["required name"]),
        mainSportLevelId: expect.arrayContaining(["required level"]),
      });
    }
  });
});
