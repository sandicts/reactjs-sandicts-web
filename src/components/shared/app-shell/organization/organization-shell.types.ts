import type { OrganizationNavigationCapabilities } from "../navigation/navigation.types";
import type { AppContextOption } from "../context/app-context.types";

type OrganizationShellProps = Readonly<{
  children: React.ReactNode;
  organizationSlug: string;
  organizationLabel?: string;
  capabilities?: OrganizationNavigationCapabilities;
  contexts?: readonly AppContextOption[];
}>;

export type { OrganizationShellProps };
