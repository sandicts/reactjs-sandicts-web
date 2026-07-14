"use client";

import { AppShellNavigation } from "../navigation/app-shell-navigation";
import { AuthenticatedTopbar } from "../chrome/authenticated-topbar";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import { OrganizationNavigationDrawer } from "./components/organization-navigation-drawer";
import { useOrganizationShell } from "./hooks/use-organization-shell";
import { organizationShellStyles } from "./organization-shell.styles";
import type { OrganizationShellProps } from "./organization-shell.types";

function OrganizationShell({
  children,
  organizationSlug,
  organizationLabel,
  capabilities,
  contexts,
}: OrganizationShellProps) {
  const {
    activeTitle,
    availableContexts,
    closeLabel,
    closeNavigation,
    drawerDescription,
    groups,
    isNavigationOpen,
    menuLabel,
    navigationAriaLabel,
    onNavigationOpenChange,
    organizationLabel: resolvedOrganizationLabel,
    pathname,
    topbarEyebrow,
  } = useOrganizationShell({
    capabilities,
    contexts,
    organizationLabel,
    organizationSlug,
  });

  const menuTrigger = (
    <OrganizationNavigationDrawer
      ariaLabel={navigationAriaLabel}
      closeLabel={closeLabel}
      description={drawerDescription}
      groups={groups}
      menuLabel={menuLabel}
      onNavigate={closeNavigation}
      onOpenChange={onNavigationOpenChange}
      open={isNavigationOpen}
      organizationLabel={resolvedOrganizationLabel}
      pathname={pathname}
    />
  );

  return (
    <div className={organizationShellStyles.root}>
      <SkipLink />
      <aside className={organizationShellStyles.sidebar}>
        <div className={organizationShellStyles.sidebarBrand}>
          <BrandLink />
        </div>
        <AppShellNavigation
          ariaLabel={navigationAriaLabel}
          groups={groups}
          pathname={pathname}
          presentation="adaptive"
        />
      </aside>

      <div className={organizationShellStyles.content}>
        <AuthenticatedTopbar
          contexts={availableContexts}
          eyebrow={topbarEyebrow}
          menuTrigger={menuTrigger}
          title={activeTitle}
        />
        <main id="shell-main">{children}</main>
      </div>
    </div>
  );
}

export { OrganizationShell };
