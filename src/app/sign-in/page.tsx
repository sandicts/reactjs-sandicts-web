import { LogIn } from "lucide-react";
import { AreaPlaceholder } from "@/components/area-placeholder";

export default function SignInPage() {
  return (
    <AreaPlaceholder
      eyebrow="Public area"
      title="Sign in starts here."
      description="Google sign-in and One Tap will connect here once the backend auth contract is wired into the web app."
      Icon={LogIn}
    />
  );
}
