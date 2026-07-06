import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export const metadata = createPrivatePageMetadata({
  description: "Acesse sua área de jogador no Sandicts.",
  follow: true,
  title: "Área do jogador",
});

export default function PlayerPage() {
  redirect(APP_ROUTES.player.home);
}
