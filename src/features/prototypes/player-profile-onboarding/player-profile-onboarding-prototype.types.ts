import type { BaseSyntheticEvent } from "react";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import type {
  PlayerProfileOnboardingInput,
  PlayerProfileOnboardingValues,
} from "./player-profile-onboarding-prototype.schemas";

type PrototypeScenarioId =
  | "initialLoading"
  | "missingProfile"
  | "incompleteProfile"
  | "defaultEmpty"
  | "partialForm"
  | "validForm"
  | "validationErrors"
  | "saving"
  | "success"
  | "profileReadFailure"
  | "sportsReadFailure"
  | "emptySportCatalog"
  | "emptyLevelScale"
  | "largeCatalog"
  | "searchNoResults"
  | "knownSaveFailure"
  | "unknownOutcome"
  | "conflict"
  | "rateLimit"
  | "expiredSession"
  | "exitConfirmation"
  | "alternateContext"
  | "publicFallback"
  | "authorizedContinuation"
  | "rejectedContinuation";

type PrototypeScenarioGroup =
  | "form"
  | "loadingAndReads"
  | "catalogs"
  | "commands"
  | "sessionAndExit"
  | "routing";

type PrototypeScenario = Readonly<{
  id: PrototypeScenarioId;
  group: PrototypeScenarioGroup;
}>;

type SportOption = Readonly<{
  id: string;
  code: string;
  name: string;
  levelScaleId: string;
  sortOrder: number;
  isActive: boolean;
}>;

type LevelOption = Readonly<{
  id: string;
  code: string;
  name: string;
  friendlyName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}>;

type LevelScale = Readonly<{
  id: string;
  code: string;
  title: string;
  levels: ReadonlyArray<LevelOption>;
}>;

type ActionFeedbackKind =
  | "success"
  | "knownFailure"
  | "unknownOutcome"
  | "conflict"
  | "rateLimit"
  | "info";

type ActionFeedback = Readonly<{
  kind: ActionFeedbackKind;
}>;

type RouteOutcomeKind =
  | "alternateContext"
  | "publicFallback"
  | "authorizedContinuation"
  | "rejectedContinuation"
  | "signIn";

type RouteOutcome = Readonly<{
  kind: RouteOutcomeKind;
  destination: string;
}>;

type ScenarioFormState = Readonly<{
  values: PlayerProfileOnboardingInput;
  accountDisplayName?: string;
  forceValidation?: boolean;
  openExitDialog?: boolean;
}>;

type UsePlayerProfileOnboardingPrototypeOptions = Readonly<{
  scenarioId: PrototypeScenarioId;
  sports: ReadonlyArray<SportOption>;
  levelScales: ReadonlyArray<LevelScale>;
  initialState: ScenarioFormState;
  onSaved: (values: PlayerProfileOnboardingValues) => void;
}>;

type UsePlayerProfileOnboardingPrototypeResult = Readonly<{
  form: UseFormReturn<
    PlayerProfileOnboardingInput,
    unknown,
    PlayerProfileOnboardingValues
  >;
  errors: FieldErrors<PlayerProfileOnboardingInput>;
  isSubmitting: boolean;
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  handleSportChange: (sportId: string) => void;
  focusFirstError: (errors: FieldErrors<PlayerProfileOnboardingInput>) => void;
}>;

export type {
  ActionFeedback,
  ActionFeedbackKind,
  LevelOption,
  LevelScale,
  PrototypeScenario,
  PrototypeScenarioGroup,
  PrototypeScenarioId,
  RouteOutcome,
  RouteOutcomeKind,
  ScenarioFormState,
  SportOption,
  UsePlayerProfileOnboardingPrototypeOptions,
  UsePlayerProfileOnboardingPrototypeResult,
};
