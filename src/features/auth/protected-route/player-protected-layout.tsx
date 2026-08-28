"use client";

import { PlayerShell } from "@/components/shared/app-shell/player/player-shell";
import { ProtectedRouteBoundary } from "./protected-route-boundary";
import type { PlayerProtectedLayoutProps } from "./protected-route-boundary.types";

function PlayerProtectedLayout({
  children,
  resourceAccess,
}: PlayerProtectedLayoutProps) {
  return (
    <ProtectedRouteBoundary
      resourceAccess={resourceAccess}
      renderAuthenticatedShell={(content) => (
        <PlayerShell>{content}</PlayerShell>
      )}
    >
      {children}
    </ProtectedRouteBoundary>
  );
}

export { PlayerProtectedLayout };
