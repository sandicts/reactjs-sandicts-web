import { ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppShellNavigation } from "../../navigation/app-shell-navigation";
import { organizationShellStyles } from "../organization-shell.styles";
import type { OrganizationNavigationDrawerProps } from "../organization-shell.types";

function OrganizationNavigationDrawer({
  ariaLabel,
  closeLabel,
  description,
  groups,
  menuLabel,
  onNavigate,
  onOpenChange,
  open,
  organizationLabel,
  pathname,
}: OrganizationNavigationDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className={organizationShellStyles.mobileMenuTrigger}
          aria-label={menuLabel}
        >
          <ListIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeLabel={closeLabel}
        side="left"
        className={organizationShellStyles.drawerContent}
      >
        <SheetHeader>
          <SheetTitle>{organizationLabel}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <AppShellNavigation
          ariaLabel={ariaLabel}
          groups={groups}
          pathname={pathname}
          presentation="drawer"
          onNavigate={onNavigate}
        />
      </SheetContent>
    </Sheet>
  );
}

export { OrganizationNavigationDrawer };
