(function registerGlobalStatesCatalog(globalScope) {
  const contexts = Object.freeze({
    public: {
      label: "Public",
      eyebrow: "Descoberta pública",
      title: "Encontre sua próxima quadra",
      description: "Compare opções disponíveis e escolha onde jogar.",
      pageAction: "Buscar quadras",
      defaultShape: "cards",
    },
    player: {
      label: "Player",
      eyebrow: "Sua experiência de jogo",
      title: "Minhas reservas",
      description: "Acompanhe seus próximos horários e partidas.",
      pageAction: "Explorar quadras",
      defaultShape: "cards",
    },
    organization: {
      label: "Organization",
      eyebrow: "Operação diária",
      title: "Agenda",
      description: "Acompanhe horários, quadras e reservas da Arena Sul.",
      pageAction: "Nova reserva",
      defaultShape: "calendar",
    },
  });

  const playerNavigation = Object.freeze([
    {
      label: "Player",
      items: [
        { label: "Início", icon: "house" },
        { label: "Explorar", icon: "search" },
        { label: "Reservas", icon: "calendar", current: true },
        { label: "Partidas", icon: "users" },
        { label: "Perfil", icon: "user" },
      ],
    },
  ]);

  const organizationNavigation = Object.freeze([
    {
      label: "Visão geral",
      items: [
        { label: "Painel", icon: "layout" },
        { label: "Agenda", icon: "calendar", current: true },
        { label: "Reservas", icon: "clock" },
      ],
    },
    {
      label: "Operação",
      items: [
        { label: "Quadras", icon: "map-pin" },
        { label: "Disponibilidade", icon: "clock" },
        { label: "Pagamentos", icon: "check" },
      ],
    },
    {
      label: "Gestão",
      items: [{ label: "Perfil da organização", icon: "user" }],
    },
  ]);

  const stateLabels = Object.freeze({
    "loading-page": "loading da página",
    "loading-action": "loading de ação",
    "empty-first-use": "empty de primeiro uso",
    "empty-no-results": "nenhum resultado",
    "empty-legitimate": "empty legítimo",
    "error-recoverable": "erro recuperável",
    unauthenticated: "não autenticado",
    forbidden: "sem permissão",
    "not-found": "não encontrado",
  });

  const stateCatalog = Object.freeze({
    public: {
      "empty-first-use": {
        kicker: "Primeiro uso",
        title: "Ainda não há quadras nesta região",
        description:
          "Novos espaços aparecerão aqui quando estiverem prontos para receber reservas.",
        icon: "inbox",
        tone: "info",
        primary: { label: "Explorar outra região", action: "explore" },
        note: "A ausência é real; nenhum filtro está escondendo resultados.",
      },
      "empty-no-results": {
        kicker: "Busca sem resultados",
        title: "Nenhuma quadra combina com estes filtros",
        description:
          "Tente remover um filtro ou ampliar a região para encontrar outras opções.",
        icon: "search",
        tone: "info",
        primary: { label: "Limpar filtros", action: "reset-filters" },
        secondary: { label: "Voltar à descoberta", action: "back" },
        note: "Os dados podem existir; somente a combinação atual não retornou itens.",
      },
      "empty-legitimate": {
        kicker: "Agenda pública",
        title: "Nenhum horário público para hoje",
        description:
          "Não há disponibilidade publicada neste período. Você pode consultar outra data quando quiser.",
        icon: "calendar",
        tone: "success",
        note: "Este estado é informativo e não força uma ação.",
      },
      "error-recoverable": {
        kicker: "Falha temporária",
        title: "Não foi possível carregar as quadras",
        description:
          "A conexão pode ter oscilado. Tente novamente sem perder os filtros selecionados.",
        icon: "triangle-alert",
        tone: "destructive",
        primary: { label: "Tentar novamente", action: "retry" },
        secondary: { label: "Voltar ao início", action: "home" },
        note: "O retry representa apenas uma leitura segura.",
      },
      unauthenticated: {
        kicker: "Autenticação necessária",
        title: "Entre para continuar",
        description:
          "A descoberta continua pública, mas esta ação precisa de uma conta Sandicts.",
        icon: "log-in",
        tone: "warning",
        primary: { label: "Entrar na conta", action: "sign-in" },
        secondary: { label: "Voltar à descoberta", action: "back" },
        note: "O destino pretendido pode ser preservado com um returnTo validado.",
      },
      forbidden: {
        kicker: "Acesso indisponível",
        title: "Este conteúdo não está disponível",
        description:
          "Sua conta não pode abrir esta área. Nenhuma informação privada foi exibida.",
        icon: "shield-x",
        tone: "destructive",
        primary: { label: "Voltar à descoberta", action: "back" },
      },
      "not-found": {
        kicker: "Página indisponível",
        title: "Não encontramos esta página",
        description:
          "O endereço pode estar incorreto ou o conteúdo pode não estar mais disponível.",
        icon: "file-question",
        tone: "info",
        primary: { label: "Ir para descoberta", action: "explore" },
        secondary: { label: "Voltar ao início", action: "home" },
        note: "A mensagem não confirma se um recurso privado existe.",
      },
    },
    player: {
      "empty-first-use": {
        kicker: "Primeiro uso",
        title: "Sua agenda começa por aqui",
        description:
          "Você ainda não tem reservas ou partidas próximas. Explore quadras para organizar o primeiro jogo.",
        icon: "calendar",
        tone: "success",
        primary: { label: "Explorar quadras", action: "explore" },
      },
      "empty-no-results": {
        kicker: "Filtros ativos",
        title: "Nenhuma reserva encontrada",
        description:
          "Suas reservas podem estar em outro período ou status. Limpe os filtros para ver a lista completa.",
        icon: "search",
        tone: "info",
        primary: { label: "Limpar filtros", action: "reset-filters" },
        secondary: { label: "Ir para o início", action: "home" },
      },
      "empty-legitimate": {
        kicker: "Agenda em dia",
        title: "Nenhum compromisso próximo",
        description:
          "Sua agenda está livre. Novas reservas e partidas aparecerão aqui quando forem confirmadas.",
        icon: "check",
        tone: "success",
        note: "Nenhuma ação é necessária neste momento.",
      },
      "error-recoverable": {
        kicker: "Falha temporária",
        title: "Não foi possível carregar suas reservas",
        description:
          "Tente novamente. Uma nova leitura não altera nem duplica suas reservas.",
        icon: "triangle-alert",
        tone: "destructive",
        primary: { label: "Tentar novamente", action: "retry" },
        secondary: { label: "Ir para o início", action: "home" },
        note: "Detalhes técnicos ficam nos logs, não na mensagem para a pessoa.",
      },
      unauthenticated: {
        kicker: "Sessão necessária",
        title: "Entre para ver suas reservas",
        description:
          "Depois do acesso, você volta para este mesmo destino antes de continuar.",
        icon: "lock",
        tone: "warning",
        primary: { label: "Entrar e continuar", action: "sign-in" },
        secondary: { label: "Voltar à descoberta", action: "back" },
        note: "Sem sessão conhecida, a navegação privada deixa de ser exibida.",
      },
      forbidden: {
        kicker: "Contexto sem acesso",
        title: "Esta área não está disponível para sua conta",
        description:
          "Use um contexto autorizado. O Sandicts não troca de perfil ou organização silenciosamente.",
        icon: "shield-x",
        tone: "destructive",
        primary: { label: "Escolher outro contexto", action: "switch-context" },
        secondary: { label: "Ir para o início", action: "home" },
      },
      "not-found": {
        kicker: "Item indisponível",
        title: "Não encontramos este item",
        description:
          "O endereço pode ter mudado ou o conteúdo pode não estar disponível para visualização.",
        icon: "file-question",
        tone: "info",
        primary: { label: "Voltar às reservas", action: "back" },
        secondary: { label: "Ir para o início", action: "home" },
        note: "A cópia é neutra para não revelar recursos de outras contas.",
      },
    },
    organization: {
      "empty-first-use": {
        kicker: "Configuração inicial",
        title: "Comece cadastrando sua primeira quadra",
        description:
          "A agenda será liberada depois que uma quadra e seus horários estiverem configurados.",
        icon: "map-pin",
        tone: "success",
        primary: { label: "Cadastrar quadra", action: "create-court" },
        secondary: {
          label: "Entender disponibilidade",
          action: "availability-help",
        },
      },
      "empty-no-results": {
        kicker: "Filtros ativos",
        title: "Nenhuma reserva neste recorte",
        description:
          "Existem outros registros fora do período, da quadra ou dos status selecionados.",
        icon: "search",
        tone: "info",
        primary: { label: "Limpar filtros", action: "reset-filters" },
        secondary: { label: "Voltar ao painel", action: "home" },
      },
      "empty-legitimate": {
        kicker: "Operação do período",
        title: "Nenhuma reserva neste período",
        description:
          "A agenda está livre para as quadras selecionadas. Nenhuma ação operacional é obrigatória.",
        icon: "calendar",
        tone: "success",
        note: "A criação de reserva permanece disponível na ação da página.",
      },
      "error-recoverable": {
        kicker: "Falha temporária",
        title: "Não foi possível carregar a agenda",
        description:
          "Tente novamente para buscar os mesmos dados. Nenhuma reserva será criada ou alterada.",
        icon: "triangle-alert",
        tone: "destructive",
        primary: { label: "Tentar novamente", action: "retry" },
        secondary: { label: "Voltar ao painel", action: "home" },
        note: "O retry é seguro porque repete somente uma leitura.",
      },
      unauthenticated: {
        kicker: "Sessão necessária",
        title: "Entre para acessar a operação",
        description:
          "Depois do acesso, você retorna ao destino solicitado se ainda tiver autorização.",
        icon: "lock",
        tone: "warning",
        primary: { label: "Entrar e continuar", action: "sign-in" },
        secondary: { label: "Voltar à página pública", action: "back" },
        note: "A URL de retorno é interna, validada e não concede permissão.",
      },
      forbidden: {
        kicker: "Sem permissão",
        title: "Você não pode acessar esta agenda",
        description:
          "Sua associação não permite visualizar esta unidade ou quadra. Escolha um contexto autorizado.",
        icon: "shield-x",
        tone: "destructive",
        primary: { label: "Escolher outro contexto", action: "switch-context" },
        secondary: { label: "Voltar ao painel", action: "home" },
        note: "A organização atual continua explícita; não há redirecionamento silencioso.",
      },
      "not-found": {
        kicker: "Registro indisponível",
        title: "Não encontramos este registro",
        description:
          "O endereço pode estar incorreto ou o registro pode não estar disponível neste contexto.",
        icon: "file-question",
        tone: "info",
        primary: { label: "Voltar à agenda", action: "back" },
        secondary: { label: "Ir para o painel", action: "home" },
        note: "A resposta não diferencia inexistência de falta de acesso.",
      },
    },
  });

  const actionLoadingCatalog = Object.freeze({
    public: {
      title: "Aplicando filtros",
      description:
        "A lista permanece visível e somente o controle originador comunica o progresso.",
      rows: [
        ["Região", "Vitória"],
        ["Esporte", "Beach tennis"],
      ],
      buttonLabel: "Aplicando filtros…",
    },
    player: {
      title: "Confirmando reserva",
      description:
        "O botão preserva sua largura e bloqueia um segundo envio enquanto a confirmação acontece.",
      rows: [
        ["Quadra", "Arena Sul · Areia 1"],
        ["Horário", "Sábado, 10h"],
      ],
      buttonLabel: "Confirmando reserva…",
    },
    organization: {
      title: "Salvando disponibilidade",
      description:
        "A agenda não é substituída por um spinner e a mesma alteração não pode ser enviada duas vezes.",
      rows: [
        ["Quadra", "Areia 1"],
        ["Horário", "10h às 11h"],
      ],
      buttonLabel: "Salvando disponibilidade…",
    },
  });

  const namespace = globalScope.SandictsGlobalStates ?? {};

  namespace.catalog = Object.freeze({
    actionLoadingCatalog,
    contexts,
    organizationNavigation,
    playerNavigation,
    stateCatalog,
    stateLabels,
  });
  globalScope.SandictsGlobalStates = namespace;
})(window);
