"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createOrganizationRoutes } from "@/lib/routes/app-routes";
import { createOrganizationNavigationGroups } from "../../navigation/navigation.constants";
import { getActiveNavigationItem } from "../../navigation/navigation.utils";
import type {
  UseOrganizationShellParams,
  UseOrganizationShellResult,
} from "../organization-shell.types";

function useOrganizationShell({
  capabilities,
  contexts,
  organizationLabel,
  organizationSlug,
}: UseOrganizationShellParams): UseOrganizationShellResult {
  const commonT = useTranslations("Common");
  const navigationT = useTranslations("Navigation.organization");
  const shellT = useTranslations("OrganizationShell");
  const pathname = usePathname();
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  const resolvedOrganizationLabel =
    organizationLabel ?? shellT("defaultContextLabel");
  const groups = createOrganizationNavigationGroups(
    organizationSlug,
    {
      availability: navigationT("availability"),
      calendar: navigationT("calendar"),
      courts: navigationT("courts"),
      dashboard: navigationT("dashboard"),
      managementGroup: navigationT("managementGroup"),
      members: navigationT("members"),
      operationGroup: navigationT("operationGroup"),
      overviewGroup: navigationT("overviewGroup"),
      payments: navigationT("payments"),
      profile: navigationT("profile"),
      reservations: navigationT("reservations"),
      units: navigationT("units"),
    },
    capabilities,
  );
  const activeItem = getActiveNavigationItem(pathname, groups);
  const routes = createOrganizationRoutes(organizationSlug);
  const availableContexts = contexts ?? [
    {
      id: organizationSlug,
      kind: "organization" as const,
      label: resolvedOrganizationLabel,
      detail: shellT("contextDetail"),
      homeHref: routes.root,
      current: true,
    },
  ];

  return {
    activeTitle: activeItem?.label ?? shellT("defaultTitle"),
    availableContexts,
    closeLabel: commonT("close"),
    closeNavigation: () => setNavigationOpen(false),
    drawerDescription: shellT("description"),
    groups,
    isNavigationOpen,
    menuLabel: shellT("menuLabel"),
    navigationAriaLabel: shellT("ariaLabel"),
    onNavigationOpenChange: setNavigationOpen,
    organizationLabel: resolvedOrganizationLabel,
    pathname,
    topbarEyebrow: shellT("eyebrow"),
  };
}

export { useOrganizationShell };
