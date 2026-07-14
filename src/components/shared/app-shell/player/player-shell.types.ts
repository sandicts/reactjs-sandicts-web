import type { AppContextOption } from "../context/app-context.types";
import type { ShellNavigationGroup } from "../navigation/navigation.types";

type PlayerShellProps = Readonly<{
  children: React.ReactNode;
  contexts?: readonly AppContextOption[];
}>;

type UsePlayerShellParams = Pick<PlayerShellProps, "contexts">;

type UsePlayerShellResult = Readonly<{
  activeTitle: string;
  availableContexts: readonly AppContextOption[];
  groups: readonly ShellNavigationGroup[];
  navigationAriaLabel: string;
  pathname: string;
  topbarEyebrow: string;
}>;

export type { PlayerShellProps, UsePlayerShellParams, UsePlayerShellResult };
