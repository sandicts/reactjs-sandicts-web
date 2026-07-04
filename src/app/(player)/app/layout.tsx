import { PlayerShell } from "@/components/shared/app-shell/player/player-shell";

export default function PlayerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PlayerShell>{children}</PlayerShell>;
}
