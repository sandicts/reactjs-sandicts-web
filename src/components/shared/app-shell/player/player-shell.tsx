"use client";

import { usePathname } from "next/navigation";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { AppShellNavigation } from "../navigation/app-shell-navigation";
import { PLAYER_NAVIGATION_GROUPS } from "../navigation/navigation.constants";
import { getActiveNavigationItem } from "../navigation/navigation.utils";
import { AuthenticatedTopbar } from "../chrome/authenticated-topbar";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import type { AppContextOption } from "../context/app-context.types";
import type { PlayerShellProps } from "./player-shell.types";

const defaultPlayerContexts: readonly AppContextOption[] = [
  {
    id: "player",
    kind: "player",
    label: "Player",
    detail: "Sua experiência de jogo",
    homeHref: APP_ROUTES.player.home,
    current: true,
  },
];

function PlayerShell({
  children,
  contexts = defaultPlayerContexts,
}: PlayerShellProps) {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(
    pathname,
    PLAYER_NAVIGATION_GROUPS,
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[5rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]">
      <SkipLink />
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card/40 md:flex md:flex-col">
        <div className="flex min-h-20 items-center justify-center border-b border-border px-3 lg:justify-start lg:px-6 [&_span]:sr-only lg:[&_span]:not-sr-only">
          <BrandLink />
        </div>
        <AppShellNavigation
          ariaLabel="Navegação Player"
          groups={PLAYER_NAVIGATION_GROUPS}
          pathname={pathname}
          presentation="adaptive"
        />
      </aside>

      <div className="min-w-0">
        <AuthenticatedTopbar
          contexts={contexts}
          eyebrow="Player"
          title={activeItem?.label ?? "Área Player"}
        />
        <main id="shell-main" className="pb-24 md:pb-0">
          {children}
        </main>
      </div>

      <AppShellNavigation
        ariaLabel="Navegação Player"
        groups={PLAYER_NAVIGATION_GROUPS}
        pathname={pathname}
        presentation="bottom"
      />
    </div>
  );
}

export { PlayerShell };
