import { UserRound } from "lucide-react";
import { ShellPagePlaceholder } from "@/components/shared/app-shell/content/shell-page-placeholder";

export default function PlayerProfilePage() {
  return (
    <ShellPagePlaceholder
      eyebrow="Perfil"
      title="Cuide do seu perfil Player."
      description="Onboarding e edição de perfil serão conectados aqui sem alterar a navegação principal."
      Icon={UserRound}
    />
  );
}
