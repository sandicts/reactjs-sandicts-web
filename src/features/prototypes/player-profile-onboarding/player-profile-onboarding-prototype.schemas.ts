import { z } from "zod";

type PlayerProfileOnboardingValidationMessages = Readonly<{
  displayNameRequired: string;
  displayNameMin: string;
  displayNameMax: string;
  sportRequired: string;
  levelRequired: string;
}>;

type CreatePlayerProfileOnboardingSchemaOptions = Readonly<{
  messages: PlayerProfileOnboardingValidationMessages;
  isLevelValidForSport: (sportId: string, levelId: string) => boolean;
}>;

function createPlayerProfileOnboardingSchema({
  isLevelValidForSport,
  messages,
}: CreatePlayerProfileOnboardingSchemaOptions) {
  return z
    .object({
      displayName: z
        .string()
        .trim()
        .min(1, messages.displayNameRequired)
        .min(2, messages.displayNameMin)
        .max(80, messages.displayNameMax),
      mainSportId: z.string().min(1, messages.sportRequired),
      mainSportLevelId: z.string().min(1, messages.levelRequired),
    })
    .superRefine((values, context) => {
      if (
        values.mainSportId &&
        values.mainSportLevelId &&
        !isLevelValidForSport(values.mainSportId, values.mainSportLevelId)
      ) {
        context.addIssue({
          code: "custom",
          message: messages.levelRequired,
          path: ["mainSportLevelId"],
        });
      }
    });
}

type PlayerProfileOnboardingSchema = ReturnType<
  typeof createPlayerProfileOnboardingSchema
>;
type PlayerProfileOnboardingInput = z.input<PlayerProfileOnboardingSchema>;
type PlayerProfileOnboardingValues = z.output<PlayerProfileOnboardingSchema>;

export { createPlayerProfileOnboardingSchema };
export type {
  PlayerProfileOnboardingInput,
  PlayerProfileOnboardingValidationMessages,
  PlayerProfileOnboardingValues,
};
