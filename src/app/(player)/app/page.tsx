import { House } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerHomePage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Início"
      title="Seu próximo jogo começa aqui."
      description="A home Player reunirá reservas, partidas abertas e atalhos para descoberta sem transformar métricas de jogo em escopo do MVP."
      Icon={House}
    />
  );
}
