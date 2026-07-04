import { LogIn } from "lucide-react";
import { AreaPlaceholder } from "@/components/shared/area-placeholder/area-placeholder";

export default function SignInPage() {
  return (
    <AreaPlaceholder
      eyebrow="Área pública"
      title="Entre na sua conta."
      description="Google Sign-In, One Tap e magic link serão conectados aqui pelas tarefas de autenticação."
      Icon={LogIn}
    />
  );
}
