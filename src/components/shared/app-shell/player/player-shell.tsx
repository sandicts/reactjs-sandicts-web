"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { AppShellNavigation } from "../navigation/app-shell-navigation";
import { createPlayerNavigationGroups } from "../navigation/navigation.constants";
import { getActiveNavigationItem } from "../navigation/navigation.utils";
import { AuthenticatedTopbar } from "../chrome/authenticated-topbar";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import type { AppContextOption } from "../context/app-context.types";
import type { PlayerShellProps } from "./player-shell.types";

function PlayerShell({ children, contexts }: PlayerShellProps) {
  const navigationT = useTranslations("Navigation.player");
  const shellT = useTranslations("PlayerShell");
  const pathname = usePathname();
  const groups = createPlayerNavigationGroups({
    courts: navigationT("courts"),
    group: navigationT("group"),
    home: navigationT("home"),
    openMatches: navigationT("openMatches"),
    profile: navigationT("profile"),
    reservations: navigationT("reservations"),
  });
  const availableContexts: readonly AppContextOption[] = contexts ?? [
    {
      id: "player",
      kind: "player",
      label: shellT("eyebrow"),
      detail: shellT("contextDetail"),
      homeHref: APP_ROUTES.player.home,
      current: true,
    },
  ];
  const activeItem = getActiveNavigationItem(pathname, groups);

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[5rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]">
      <SkipLink />
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card/40 md:flex md:flex-col">
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
          title={activeItem?.label ?? shellT("defaultTitle")}
        />
        <main id="shell-main" className="pb-24 md:pb-0">
          {children}
        </main>
      </div>

      <AppShellNavigation
        ariaLabel={shellT("ariaLabel")}
        groups={groups}
        pathname={pathname}
        presentation="bottom"
      />
    </div>
  );
}

export { PlayerShell };
