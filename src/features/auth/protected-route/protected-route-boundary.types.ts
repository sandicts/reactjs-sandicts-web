import type { ReactNode } from "react";

type ProtectedRouteResourceAccess = "allowed" | "checking" | "forbidden";

type ProtectedRouteBoundaryProps = Readonly<{
  children: ReactNode;
  renderAuthenticatedShell: (content: ReactNode) => ReactNode;
  resourceAccess?: ProtectedRouteResourceAccess;
}>;

type PlayerProtectedLayoutProps = Readonly<{
  children: ReactNode;
  resourceAccess?: ProtectedRouteResourceAccess;
}>;

type OrganizationProtectedLayoutProps = Readonly<{
  children: ReactNode;
  organizationLabel: string;
  organizationSlug: string;
  resourceAccess?: ProtectedRouteResourceAccess;
}>;

export type {
  OrganizationProtectedLayoutProps,
  PlayerProtectedLayoutProps,
  ProtectedRouteBoundaryProps,
  ProtectedRouteResourceAccess,
};
