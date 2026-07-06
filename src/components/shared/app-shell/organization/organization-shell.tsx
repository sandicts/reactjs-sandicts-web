"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createOrganizationRoutes } from "@/lib/routes/app-routes";
import { AppShellNavigation } from "../navigation/app-shell-navigation";
import { createOrganizationNavigationGroups } from "../navigation/navigation.constants";
import { getActiveNavigationItem } from "../navigation/navigation.utils";
import { AuthenticatedTopbar } from "../chrome/authenticated-topbar";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import type { AppContextOption } from "../context/app-context.types";
import type { OrganizationShellProps } from "./organization-shell.types";

function OrganizationShell({
  children,
  organizationSlug,
  organizationLabel,
  capabilities,
  contexts,
}: OrganizationShellProps) {
  const commonT = useTranslations("Common");
  const navigationT = useTranslations("Navigation.organization");
  const shellT = useTranslations("OrganizationShell");
  const resolvedOrganizationLabel =
    organizationLabel ?? shellT("defaultContextLabel");
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
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
  const availableContexts: readonly AppContextOption[] = contexts ?? [
    {
      id: organizationSlug,
      kind: "organization",
      label: resolvedOrganizationLabel,
      detail: shellT("contextDetail"),
      homeHref: routes.root,
      current: true,
    },
  ];

  const menuTrigger = (
    <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="md:hidden"
          aria-label={shellT("menuLabel")}
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeLabel={commonT("close")}
        side="left"
        className="overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{resolvedOrganizationLabel}</SheetTitle>
          <SheetDescription>{shellT("description")}</SheetDescription>
        </SheetHeader>
        <AppShellNavigation
          ariaLabel={shellT("ariaLabel")}
          groups={groups}
          pathname={pathname}
          presentation="drawer"
          onNavigate={() => setNavigationOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[5rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
      <SkipLink />
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card/50 md:flex md:flex-col">
        <div className="flex min-h-20 items-center justify-center border-b border-border px-3 lg:justify-start lg:px-6 [&_span]:sr-only lg:[&_span]:not-sr-only">
          <BrandLink />
        </div>
        <AppShellNavigation
          ariaLabel={shellT("ariaLabel")}
          groups={groups}
          pathname={pathname}
          presentation="adaptive"
        />
      </aside>

      <div className="min-w-0">
        <AuthenticatedTopbar
          contexts={availableContexts}
          eyebrow={shellT("eyebrow")}
          menuTrigger={menuTrigger}
          title={activeItem?.label ?? shellT("defaultTitle")}
        />
        <main id="shell-main">{children}</main>
      </div>
    </div>
  );
}

export { OrganizationShell };
