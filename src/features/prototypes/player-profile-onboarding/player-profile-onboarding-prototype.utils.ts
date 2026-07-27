import type {
  LevelOption,
  LevelScale,
  SportOption,
} from "./player-profile-onboarding-prototype.types";

function sortActiveSports(
  sports: ReadonlyArray<SportOption>,
): ReadonlyArray<SportOption> {
  return sports
    .filter((sport) => sport.isActive)
    .toSorted((first, second) => first.sortOrder - second.sortOrder);
}

function filterSports(
  sports: ReadonlyArray<SportOption>,
  query: string,
): ReadonlyArray<SportOption> {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  if (!normalizedQuery) {
    return sortActiveSports(sports);
  }

  return sortActiveSports(sports).filter((sport) =>
    sport.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery),
  );
}

function findSport(
  sports: ReadonlyArray<SportOption>,
  sportId: string,
): SportOption | undefined {
  return sports.find((sport) => sport.id === sportId && sport.isActive);
}

function getLevelsForSport(
  sports: ReadonlyArray<SportOption>,
  levelScales: ReadonlyArray<LevelScale>,
  sportId: string,
): ReadonlyArray<LevelOption> {
  const sport = findSport(sports, sportId);
  const scale = sport
    ? levelScales.find((candidate) => candidate.id === sport.levelScaleId)
    : undefined;

  return (
    scale?.levels
      .filter((level) => level.isActive)
      .toSorted((first, second) => first.sortOrder - second.sortOrder) ?? []
  );
}

function isLevelValidForSport(
  sports: ReadonlyArray<SportOption>,
  levelScales: ReadonlyArray<LevelScale>,
  sportId: string,
  levelId: string,
): boolean {
  return getLevelsForSport(sports, levelScales, sportId).some(
    (level) => level.id === levelId,
  );
}

export {
  filterSports,
  findSport,
  getLevelsForSport,
  isLevelValidForSport,
  sortActiveSports,
};
