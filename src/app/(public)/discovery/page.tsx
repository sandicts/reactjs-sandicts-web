import { Search } from "lucide-react";
import { AreaPlaceholder } from "@/components/shared/area-placeholder/area-placeholder";

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
