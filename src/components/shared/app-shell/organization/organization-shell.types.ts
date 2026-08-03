import type {
  OrganizationNavigationCapabilities,
  ShellNavigationGroup,
} from "../navigation/navigation.types";
import type { AppContextOption } from "../context/app-context.types";

type OrganizationShellProps = Readonly<{
  children: React.ReactNode;
  organizationSlug: string;
  organizationLabel?: string;
  capabilities?: OrganizationNavigationCapabilities;
  contexts?: readonly AppContextOption[];
}>;

type UseOrganizationShellParams = Pick<
  OrganizationShellProps,
  "capabilities" | "contexts" | "organizationLabel" | "organizationSlug"
>;

type UseOrganizationShellResult = Readonly<{
  activeTitle: string;
  availableContexts: readonly AppContextOption[];
  closeLabel: string;
  closeNavigation: () => void;
  drawerDescription: string;
  groups: readonly ShellNavigationGroup[];
  isNavigationOpen: boolean;
  menuLabel: string;
  navigationAriaLabel: string;
  onNavigationOpenChange: (open: boolean) => void;
  organizationLabel: string;
  pathname: string;
  topbarEyebrow: string;
}>;

type OrganizationNavigationDrawerProps = Readonly<{
  ariaLabel: string;
  closeLabel: string;
  description: string;
  groups: readonly ShellNavigationGroup[];
  menuLabel: string;
  onNavigate: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  organizationLabel: string;
  pathname: string;
}>;

export type {
  OrganizationNavigationDrawerProps,
  OrganizationShellProps,
  UseOrganizationShellParams,
  UseOrganizationShellResult,
};
