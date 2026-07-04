type AppContextKind = "player" | "organization" | "academy" | "admin";

type AppContextOption = Readonly<{
  id: string;
  kind: AppContextKind;
  label: string;
  detail?: string;
  homeHref: string;
  current?: boolean;
}>;

export type { AppContextKind, AppContextOption };
