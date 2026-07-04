import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/lib/routes/app-routes";

export default function PlayerPage() {
  redirect(APP_ROUTES.player.home);
}
