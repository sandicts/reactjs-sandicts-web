"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { createPlayerNavigationGroups } from "../../navigation/navigation.constants";
import { getActiveNavigationItem } from "../../navigation/navigation.utils";
import type {
  UsePlayerShellParams,
  UsePlayerShellResult,
} from "../player-shell.types";

function usePlayerShell({
  contexts,
}: UsePlayerShellParams): UsePlayerShellResult {
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
  const availableContexts = contexts ?? [
    {
      id: "player",
      kind: "player" as const,
      label: shellT("eyebrow"),
      detail: shellT("contextDetail"),
      homeHref: APP_ROUTES.player.home,
      current: true,
    },
  ];
  const activeItem = getActiveNavigationItem(pathname, groups);

  return {
    activeTitle: activeItem?.label ?? shellT("defaultTitle"),
    availableContexts,
    groups,
    navigationAriaLabel: shellT("ariaLabel"),
    pathname,
    topbarEyebrow: shellT("eyebrow"),
  };
}

export { usePlayerShell };
