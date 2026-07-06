import { PlayerShell } from "@/components/shared/app-shell/player/player-shell";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export const metadata = createPrivatePageMetadata({
  description: "Gerencie sua experiência de jogador no Sandicts.",
  title: "Área do jogador",
});

export default function PlayerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PlayerShell>{children}</PlayerShell>;
}
