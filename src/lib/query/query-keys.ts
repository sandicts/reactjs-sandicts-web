const queryKeys = {
  all: ["sandicts"] as const,
  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    session: () => [...queryKeys.auth.all(), "session"] as const,
  },
  courts: {
    all: () => [...queryKeys.all, "courts"] as const,
    discovery: (filters: Readonly<Record<string, unknown>>) =>
      [...queryKeys.courts.all(), "discovery", filters] as const,
  },
  playerProfile: {
    all: () => [...queryKeys.all, "player-profile"] as const,
    current: () => [...queryKeys.playerProfile.all(), "current"] as const,
  },
};

export { queryKeys };
