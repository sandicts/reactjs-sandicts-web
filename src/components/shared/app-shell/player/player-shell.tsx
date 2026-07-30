"use client";

import { BrandLink } from "@/components/shared/brand";
import { AppShellNavigation } from "../navigation/app-shell-navigation";
import { AuthenticatedTopbar } from "../chrome/authenticated-topbar";
import { SkipLink } from "../chrome/skip-link";
import { usePlayerShell } from "./hooks/use-player-shell";
import { playerShellStyles } from "./player-shell.styles";
import type { PlayerShellProps } from "./player-shell.types";

function PlayerShell({ children, contexts }: PlayerShellProps) {
  const {
    activeTitle,
    availableContexts,
    groups,
    navigationAriaLabel,
    pathname,
    topbarEyebrow,
  } = usePlayerShell({ contexts });

  return (
    <div className={playerShellStyles.root}>
      <SkipLink />
      <aside className={playerShellStyles.sidebar}>
        <div className={playerShellStyles.sidebarBrand}>
          <BrandLink />
        </div>
        <AppShellNavigation
          ariaLabel={navigationAriaLabel}
          groups={groups}
          pathname={pathname}
          presentation="adaptive"
        />
      </aside>

      <div className={playerShellStyles.content}>
        <AuthenticatedTopbar
          contexts={availableContexts}
          eyebrow={topbarEyebrow}
          title={activeTitle}
        />
        <main id="shell-main" className={playerShellStyles.main}>
          {children}
        </main>
      </div>

      <AppShellNavigation
        ariaLabel={navigationAriaLabel}
        groups={groups}
        pathname={pathname}
        presentation="bottom"
      />
    </div>
  );
}

export { PlayerShell };
