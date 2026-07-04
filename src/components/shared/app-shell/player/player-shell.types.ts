import type { AppContextOption } from "../context/app-context.types";

type PlayerShellProps = Readonly<{
  children: React.ReactNode;
  contexts?: readonly AppContextOption[];
}>;

export type { PlayerShellProps };
