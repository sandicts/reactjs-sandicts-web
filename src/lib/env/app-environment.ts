const appEnvironmentValues = [
  "local",
  "pr-preview",
  "preview",
  "production",
] as const;

type AppEnvironment = (typeof appEnvironmentValues)[number];

function parseAppEnvironment(value: string | undefined): AppEnvironment {
  const normalizedValue = value?.trim().toLowerCase() || "local";

  if (isAppEnvironment(normalizedValue)) {
    return normalizedValue;
  }

  throw new Error(
    `NEXT_PUBLIC_APP_ENV must be one of: ${appEnvironmentValues.join(", ")}.`,
  );
}

function isAppEnvironment(value: string): value is AppEnvironment {
  return appEnvironmentValues.some((environment) => environment === value);
}

export { appEnvironmentValues, parseAppEnvironment };
export type { AppEnvironment };
