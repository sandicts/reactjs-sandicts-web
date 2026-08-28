"use client";

import { OrganizationShell } from "@/components/shared/app-shell/organization/organization-shell";
import { ProtectedRouteBoundary } from "./protected-route-boundary";
import type { OrganizationProtectedLayoutProps } from "./protected-route-boundary.types";

function OrganizationProtectedLayout({
  children,
  organizationLabel,
  organizationSlug,
  resourceAccess,
}: OrganizationProtectedLayoutProps) {
  return (
    <ProtectedRouteBoundary
      resourceAccess={resourceAccess}
      renderAuthenticatedShell={(content) => (
        <OrganizationShell
          organizationLabel={organizationLabel}
          organizationSlug={organizationSlug}
        >
          {content}
        </OrganizationShell>
      )}
    >
      {children}
    </ProtectedRouteBoundary>
  );
}

export { OrganizationProtectedLayout };
