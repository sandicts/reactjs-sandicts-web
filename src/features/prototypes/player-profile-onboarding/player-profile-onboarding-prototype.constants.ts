import type {
  ActionFeedback,
  LevelScale,
  PrototypeScenario,
  PrototypeScenarioId,
  RouteOutcome,
  ScenarioFormState,
  SportOption,
} from "./player-profile-onboarding-prototype.types";

const MAIN_LEVEL_SCALE_ID = "level-scale-main-sport-v1";
const EMPTY_LEVEL_SCALE_ID = "level-scale-empty-demo";

const DEFAULT_SPORTS = [
  {
    id: "sport-futevolei",
    code: "futevolei",
    name: "Futevôlei",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "sport-beach-tennis",
    code: "beach_tennis",
    name: "Beach Tennis",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "sport-beach-volleyball",
    code: "beach_volleyball",
    name: "Vôlei de Praia",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 30,
    isActive: true,
  },
] as const satisfies ReadonlyArray<SportOption>;

const LARGE_SPORT_CATALOG = [
  ...DEFAULT_SPORTS,
  {
    id: "sport-beach-soccer",
    code: "beach_soccer",
    name: "Futebol de Areia",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 40,
    isActive: true,
  },
  {
    id: "sport-frescobol",
    code: "frescobol",
    name: "Frescobol",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 50,
    isActive: true,
  },
  {
    id: "sport-beach-handball",
    code: "beach_handball",
    name: "Handebol de Praia",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 60,
    isActive: true,
  },
  {
    id: "sport-beach-rugby",
    code: "beach_rugby",
    name: "Rugby de Praia",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 70,
    isActive: true,
  },
  {
    id: "sport-beach-badminton",
    code: "beach_badminton",
    name: "Badminton de Praia",
    levelScaleId: MAIN_LEVEL_SCALE_ID,
    sortOrder: 80,
    isActive: true,
  },
] as const satisfies ReadonlyArray<SportOption>;

const DEFAULT_LEVEL_SCALES = [
  {
    id: MAIN_LEVEL_SCALE_ID,
    code: "main-sport-v1",
    title: "Nível no esporte",
    levels: [
      {
        id: "level-rookie",
        code: "rookie",
        name: "Estreante",
        friendlyName: "Começando",
        description:
          "Estou conhecendo o esporte e aprendendo suas regras e fundamentos.",
        sortOrder: 10,
        isActive: true,
      },
      {
        id: "level-beginner",
        code: "beginner",
        name: "Iniciante",
        friendlyName: "Em evolução",
        description:
          "Já conheço os fundamentos, mas ainda estou desenvolvendo execução e consistência.",
        sortOrder: 20,
        isActive: true,
      },
      {
        id: "level-intermediate",
        code: "intermediate",
        name: "Intermediário",
        friendlyName: "Chegando lá",
        description:
          "Executo os principais fundamentos e consigo jogar com consistência.",
        sortOrder: 30,
        isActive: true,
      },
      {
        id: "level-advanced",
        code: "advanced",
        name: "Avançado",
        friendlyName: "Experiente",
        description:
          "Tenho domínio consistente dos fundamentos e jogo em ritmo intenso e estratégico.",
        sortOrder: 40,
        isActive: true,
      },
    ],
  },
  {
    id: EMPTY_LEVEL_SCALE_ID,
    code: "empty-demo",
    title: "Nível no esporte",
    levels: [],
  },
] as const satisfies ReadonlyArray<LevelScale>;

const EMPTY_LEVEL_SPORTS = [
  {
    ...DEFAULT_SPORTS[0],
    levelScaleId: EMPTY_LEVEL_SCALE_ID,
  },
  DEFAULT_SPORTS[1],
  DEFAULT_SPORTS[2],
] as const satisfies ReadonlyArray<SportOption>;

const PROTOTYPE_SCENARIOS = [
  { id: "defaultEmpty", group: "form" },
  { id: "missingProfile", group: "form" },
  { id: "incompleteProfile", group: "form" },
  { id: "partialForm", group: "form" },
  { id: "validForm", group: "form" },
  { id: "validationErrors", group: "form" },
  { id: "initialLoading", group: "loadingAndReads" },
  { id: "profileReadFailure", group: "loadingAndReads" },
  { id: "sportsReadFailure", group: "loadingAndReads" },
  { id: "emptySportCatalog", group: "catalogs" },
  { id: "emptyLevelScale", group: "catalogs" },
  { id: "largeCatalog", group: "catalogs" },
  { id: "searchNoResults", group: "catalogs" },
  { id: "saving", group: "commands" },
  { id: "success", group: "commands" },
  { id: "knownSaveFailure", group: "commands" },
  { id: "unknownOutcome", group: "commands" },
  { id: "conflict", group: "commands" },
  { id: "rateLimit", group: "commands" },
  { id: "expiredSession", group: "sessionAndExit" },
  { id: "exitConfirmation", group: "sessionAndExit" },
  { id: "alternateContext", group: "routing" },
  { id: "publicFallback", group: "routing" },
  { id: "authorizedContinuation", group: "routing" },
  { id: "rejectedContinuation", group: "routing" },
] as const satisfies ReadonlyArray<PrototypeScenario>;

const EMPTY_FORM_VALUES = {
  displayName: "",
  mainSportId: "",
  mainSportLevelId: "",
} as const;

const VALID_FORM_VALUES = {
  displayName: "Lucas Lima",
  mainSportId: "sport-futevolei",
  mainSportLevelId: "level-intermediate",
} as const;

const CONFLICT_SERVER_VALUES = {
  displayName: "Lucas L.",
  mainSportId: "sport-beach-tennis",
  mainSportLevelId: "level-beginner",
} as const;

const scenarioFormStates: Record<PrototypeScenarioId, ScenarioFormState> = {
  initialLoading: { values: EMPTY_FORM_VALUES },
  missingProfile: {
    accountDisplayName: "Lucas Lima",
    values: { ...EMPTY_FORM_VALUES, displayName: "Lucas Lima" },
  },
  incompleteProfile: {
    accountDisplayName: "Nome da conta",
    values: {
      displayName: "Bia Ramos",
      mainSportId: "sport-beach-tennis",
      mainSportLevelId: "",
    },
  },
  defaultEmpty: { values: EMPTY_FORM_VALUES },
  partialForm: {
    values: {
      displayName: "Lucas Lima",
      mainSportId: "sport-futevolei",
      mainSportLevelId: "",
    },
  },
  validForm: { values: VALID_FORM_VALUES },
  validationErrors: {
    values: EMPTY_FORM_VALUES,
    forceValidation: true,
  },
  saving: { values: VALID_FORM_VALUES },
  success: { values: VALID_FORM_VALUES },
  profileReadFailure: { values: EMPTY_FORM_VALUES },
  sportsReadFailure: {
    values: { ...EMPTY_FORM_VALUES, displayName: "Lucas Lima" },
  },
  emptySportCatalog: {
    values: { ...EMPTY_FORM_VALUES, displayName: "Lucas Lima" },
  },
  emptyLevelScale: {
    values: {
      displayName: "Lucas Lima",
      mainSportId: "sport-futevolei",
      mainSportLevelId: "",
    },
  },
  largeCatalog: {
    values: { ...EMPTY_FORM_VALUES, displayName: "Lucas Lima" },
  },
  searchNoResults: {
    values: { ...EMPTY_FORM_VALUES, displayName: "Lucas Lima" },
  },
  knownSaveFailure: { values: VALID_FORM_VALUES },
  unknownOutcome: { values: VALID_FORM_VALUES },
  conflict: { values: VALID_FORM_VALUES },
  rateLimit: { values: VALID_FORM_VALUES },
  expiredSession: { values: EMPTY_FORM_VALUES },
  exitConfirmation: {
    values: {
      displayName: "Lucas",
      mainSportId: "sport-futevolei",
      mainSportLevelId: "",
    },
    openExitDialog: true,
  },
  alternateContext: { values: EMPTY_FORM_VALUES },
  publicFallback: { values: EMPTY_FORM_VALUES },
  authorizedContinuation: { values: VALID_FORM_VALUES },
  rejectedContinuation: { values: VALID_FORM_VALUES },
};

const scenarioActionFeedback: Partial<
  Record<PrototypeScenarioId, ActionFeedback>
> = {
  success: { kind: "success" },
  knownSaveFailure: { kind: "knownFailure" },
  unknownOutcome: { kind: "unknownOutcome" },
  conflict: { kind: "conflict" },
  rateLimit: { kind: "rateLimit" },
};

const scenarioRouteOutcomes: Partial<
  Record<PrototypeScenarioId, RouteOutcome>
> = {
  alternateContext: {
    kind: "alternateContext",
    destination: "/organizations/arena-do-sol",
  },
  publicFallback: { kind: "publicFallback", destination: "/" },
  authorizedContinuation: {
    kind: "authorizedContinuation",
    destination: "/app/reservations",
  },
  rejectedContinuation: {
    kind: "rejectedContinuation",
    destination: "/app",
  },
};

function getSportsForScenario(
  scenarioId: PrototypeScenarioId,
): ReadonlyArray<SportOption> {
  if (scenarioId === "emptySportCatalog") {
    return [];
  }

  if (scenarioId === "emptyLevelScale") {
    return EMPTY_LEVEL_SPORTS;
  }

  if (scenarioId === "largeCatalog" || scenarioId === "searchNoResults") {
    return LARGE_SPORT_CATALOG;
  }

  return DEFAULT_SPORTS;
}

export {
  CONFLICT_SERVER_VALUES,
  DEFAULT_LEVEL_SCALES,
  DEFAULT_SPORTS,
  EMPTY_FORM_VALUES,
  LARGE_SPORT_CATALOG,
  PROTOTYPE_SCENARIOS,
  VALID_FORM_VALUES,
  getSportsForScenario,
  scenarioActionFeedback,
  scenarioFormStates,
  scenarioRouteOutcomes,
};
