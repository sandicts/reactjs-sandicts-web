import { Search } from "lucide-react";
import { AreaPlaceholder } from "@/components/shared/area-placeholder/area-placeholder";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { createPublicPageMetadata } from "@/lib/seo/seo-metadata";

export const metadata = createPublicPageMetadata({
  canonicalPath: APP_ROUTES.public.discovery,
  description:
    "Descubra quadras e espaços para praticar esportes de areia perto de você.",
  title: "Descobrir quadras",
});

export default function DiscoveryPage() {
  return (
    <AreaPlaceholder
      eyebrow="Descoberta pública"
      title="Encontre sua próxima quadra."
      description="Busca, filtros, resultados e detalhes serão implementados nas tarefas de descoberta. Este shell preserva acesso direto e navegação do navegador."
      Icon={Search}
    />
  );
}
