import type { LucideIcon } from "lucide-react";

type NavigationMatch = "exact" | "prefix";

type ShellNavigationItem = Readonly<{
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  match?: NavigationMatch;
}>;

type ShellNavigationGroup = Readonly<{
  id: string;
  label: string;
  items: readonly ShellNavigationItem[];
}>;

type OrganizationNavigationCapabilities = Readonly<{
  units?: boolean;
  members?: boolean;
}>;

type ShellNavigationProps = Readonly<{
  ariaLabel: string;
  groups: readonly ShellNavigationGroup[];
  pathname: string;
  presentation: "bottom" | "adaptive" | "drawer";
  onNavigate?: () => void;
}>;

export type {
  NavigationMatch,
  OrganizationNavigationCapabilities,
  ShellNavigationGroup,
  ShellNavigationItem,
  ShellNavigationProps,
};
