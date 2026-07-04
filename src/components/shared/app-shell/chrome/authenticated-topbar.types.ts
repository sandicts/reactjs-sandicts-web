import type { AppContextOption } from "../context/app-context.types";

type AuthenticatedTopbarProps = Readonly<{
  contexts: readonly AppContextOption[];
  eyebrow: string;
  menuTrigger?: React.ReactNode;
  title: string;
}>;

export type { AuthenticatedTopbarProps };
