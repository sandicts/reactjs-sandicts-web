import { UsersRound } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerOpenMatchesPage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Partidas"
      title="Encontre uma partida aberta."
      description="A lista, os detalhes e a criação de partidas permanecerão dentro deste destino."
      Icon={UsersRound}
    />
  );
}
