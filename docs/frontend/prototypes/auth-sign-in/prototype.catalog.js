(function registerAuthSignInCatalog(globalScope) {
  const defaultHero = Object.freeze({
    eyebrow: "Acesso Sandicts",
    title: "Entre para continuar",
    description:
      "Use sua conta Google para acessar seu perfil e os contextos disponíveis.",
  });

  const states = Object.freeze({
    "entry-default": {
      label: "Entrada de login",
      group: "Entrada",
      mode: "auth",
      hero: defaultHero,
      card: {
        eyebrow: "Acesso seguro",
        title: "Entre na sua conta",
        description: "Continue com o Google para acessar o Sandicts.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      helper: "O Google será usado apenas para confirmar sua identidade.",
      longCopy:
        "Depois do acesso, o Sandicts verifica o destino e os contextos disponíveis antes de navegar.",
    },
    "google-ready": {
      label: "Google Sign-In normal",
      group: "Entrada",
      mode: "auth",
      hero: defaultHero,
      card: {
        eyebrow: "Google Sign-In",
        title: "Escolha sua conta Google",
        description:
          "O botão explícito permanece disponível independentemente do One Tap.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note:
        "O controle representa o espaço do botão oficial renderizado pelo Google.",
      helper: "O Google será usado apenas para confirmar sua identidade.",
    },
    "checking-session": {
      label: "Verificando sessão",
      group: "Loading e retry",
      mode: "auth",
      hero: {
        eyebrow: "Acesso Sandicts",
        title: "Estamos verificando sua sessão",
        description:
          "A página mantém sua estrutura enquanto confirma o estado de acesso.",
      },
      card: {
        eyebrow: "Verificação em andamento",
        title: "Verificando sua sessão…",
        description:
          "As opções de entrada aparecem assim que a verificação terminar.",
      },
      provider: {
        kind: "skeleton",
        label: "Verificando sua sessão…",
      },
      note: "One Tap e provider não são inicializados durante o bootstrap.",
    },
    "provider-loading": {
      label: "Carregando provider",
      group: "Loading e retry",
      mode: "auth",
      hero: defaultHero,
      card: {
        eyebrow: "Preparando o acesso",
        title: "Carregando o Google…",
        description:
          "A página continua utilizável enquanto o botão oficial é preparado.",
      },
      provider: {
        kind: "skeleton",
        label: "Preparando acesso com Google…",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note: "A área do controle preserva sua altura para evitar deslocamento.",
    },
    "provider-unavailable": {
      label: "Provider indisponível",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "destructive",
        icon: "wifi-off",
        title: "Não foi possível preparar o acesso",
        description:
          "O Google não está disponível neste momento. Tente carregar novamente.",
      },
      card: {
        eyebrow: "Acesso temporariamente indisponível",
        title: "Tente novamente em instantes",
        description:
          "A descoberta pública continua disponível enquanto o acesso é restabelecido.",
      },
      provider: {
        kind: "primary",
        label: "Tentar novamente",
        action: "retry-provider",
      },
      secondary: {
        label: "Voltar ao início",
        action: "home",
      },
      note:
        "O retry recarrega o provider; ele não reapresenta uma credencial anterior.",
    },
    "one-tap-prompted": {
      label: "One Tap solicitado",
      group: "Google One Tap",
      mode: "auth",
      hero: {
        eyebrow: "Acesso rápido",
        title: "Continue sem interromper a página",
        description:
          "O prompt do Google é externo ao layout e a entrada explícita continua disponível.",
      },
      alert: {
        tone: "info",
        icon: "info",
        title: "One Tap foi solicitado",
        description:
          "O protótipo não reproduz a interface controlada pelo Google.",
      },
      card: {
        eyebrow: "Fallback permanente",
        title: "Prefere usar o botão?",
        description:
          "A opção explícita permanece disponível mesmo quando o prompt é exibido.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note: "A tentativa automática não bloqueia nem desloca a ação explícita.",
    },
    "one-tap-fallback": {
      label: "Fallback do One Tap",
      group: "Google One Tap",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "info",
        icon: "info",
        title: "Use o botão para entrar",
        description:
          "O acesso rápido não está disponível agora. Você ainda pode continuar com o Google.",
      },
      card: {
        eyebrow: "Entrada explícita",
        title: "Entre com o Google",
        description:
          "O fallback permanece disponível após skip, cancelamento ou supressão do One Tap.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note:
        "Dismiss do One Tap é silencioso; esta orientação representa o fallback, não um erro.",
    },
    "one-tap-unsupported": {
      label: "One Tap não suportado",
      group: "Google One Tap",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "info",
        icon: "info",
        title: "Entre usando o botão",
        description:
          "Este navegador usa a entrada explícita em vez do acesso rápido.",
      },
      card: {
        eyebrow: "Navegador com fallback",
        title: "Continue com o Google",
        description:
          "Safari, Firefox e navegadores no iOS seguem por este caminho.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note: "A ausência do One Tap não reduz a funcionalidade da página.",
    },
    "webview-unsupported": {
      label: "Webview não suportada",
      group: "Google One Tap",
      mode: "boundary",
      hero: {
        eyebrow: "Acesso Sandicts",
        title: "Abra no navegador para entrar",
        description:
          "Webviews incorporadas não são superfícies de autenticação suportadas no MVP.",
      },
      boundary: {
        tone: "info",
        icon: "external-link",
        eyebrow: "Navegador necessário",
        title: "Abra esta página em um navegador compatível",
        description:
          "Use o navegador do sistema para continuar com sua conta Google.",
        primary: {
          label: "Abrir no navegador",
          action: "open-browser",
        },
        secondary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
    },
    "session-expired": {
      label: "Sessão expirada",
      group: "Sessão",
      mode: "auth",
      hero: {
        eyebrow: "Retome seu acesso",
        title: "Entre novamente para continuar",
        description:
          "O destino interno pode ser retomado depois que a autorização for verificada novamente.",
      },
      alert: {
        tone: "warning",
        icon: "clock",
        title: "Sua sessão expirou",
        description:
          "Entre novamente para continuar. Alterações não salvas não foram mantidas.",
      },
      card: {
        eyebrow: "Reautenticação",
        title: "Confirme sua conta",
        description:
          "Use o botão oficial do Google para criar uma nova sessão Sandicts.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Ir para o início",
        action: "home",
      },
      note:
        "“Entrar novamente” é a intenção aprovada; o provider controla o rótulo final do botão.",
      longCopy:
        "O Sandicts revalida o destino solicitado e não restaura valores de formulários descartados.",
    },
    "verification-failed": {
      label: "Falha ao verificar sessão",
      group: "Sessão",
      mode: "boundary",
      hero: {
        eyebrow: "Verificação de acesso",
        title: "Sua sessão ainda não foi confirmada",
        description:
          "Uma falha temporária não é tratada como prova de que a sessão expirou.",
      },
      boundary: {
        tone: "warning",
        icon: "wifi-off",
        eyebrow: "Falha temporária",
        title: "Não foi possível verificar sua sessão",
        description: "Confira sua conexão e tente novamente.",
        primary: {
          label: "Tentar novamente",
          action: "retry-session",
        },
        secondary: {
          label: "Ir para o início",
          action: "home",
        },
      },
    },
    "signing-in": {
      label: "Login em andamento",
      group: "Loading e retry",
      mode: "auth",
      hero: defaultHero,
      card: {
        eyebrow: "Acesso em andamento",
        title: "Estamos confirmando sua conta",
        description:
          "Aguarde enquanto o Sandicts cria a sessão e prepara o próximo destino.",
      },
      provider: {
        kind: "google",
        label: "Entrando…",
        action: "none",
        pending: true,
      },
      note: "O controle preserva a largura e impede uma segunda troca de credencial.",
    },
    "login-cancelled": {
      label: "Login cancelado",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "info",
        icon: "info",
        title: "Entrada cancelada",
        description:
          "Nenhuma alteração foi feita. Você pode tentar novamente quando quiser.",
      },
      card: {
        eyebrow: "Entrada disponível",
        title: "Continue quando estiver pronto",
        description:
          "Abra novamente a escolha de conta para retomar o acesso.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar à descoberta",
        action: "back",
      },
      note:
        "Somente o cancelamento da interação explícita mostra feedback; dismiss do One Tap é silencioso.",
    },
    "invalid-credential": {
      label: "Credencial inválida",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "destructive",
        icon: "alert-triangle",
        title: "Não foi possível confirmar seu acesso",
        description: "Tente entrar novamente com sua conta Google.",
      },
      card: {
        eyebrow: "Nova tentativa necessária",
        title: "Escolha sua conta novamente",
        description:
          "Uma nova interação substitui a credencial que não pôde ser validada.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar ao início",
        action: "home",
      },
      note:
        "A copy não expõe token, assinatura, issuer, audience ou payload do provider.",
    },
    "service-unavailable": {
      label: "Serviço indisponível",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "destructive",
        icon: "wifi-off",
        title: "Não foi possível entrar agora",
        description:
          "O serviço de acesso está temporariamente indisponível. Tente novamente em alguns instantes.",
      },
      card: {
        eyebrow: "Falha temporária",
        title: "Tente iniciar o acesso novamente",
        description:
          "O retry abre uma nova interação e não reapresenta automaticamente o comando anterior.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar ao início",
        action: "home",
      },
      note: "Representa rede, timeout ou erro interno durante a troca com o Sandicts.",
    },
    "validation-error": {
      label: "Falha inesperada da solicitação",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "destructive",
        icon: "alert-triangle",
        title: "Não foi possível iniciar sua sessão",
        description: "Tente entrar novamente.",
      },
      card: {
        eyebrow: "Nova tentativa necessária",
        title: "Reinicie o acesso",
        description:
          "Detalhes da solicitação ficam na observabilidade e não são exibidos na interface.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar ao início",
        action: "home",
      },
      note: "Mapeia validation_error sem transformá-lo em validação de campo.",
    },
    "external-identity-conflict": {
      label: "Conflito de identidade",
      group: "Falhas",
      mode: "auth",
      hero: defaultHero,
      alert: {
        tone: "destructive",
        icon: "user-round",
        title: "Não foi possível usar esta conta",
        description: "Tente entrar com outra conta Google.",
      },
      card: {
        eyebrow: "Outra conta necessária",
        title: "Escolha uma conta diferente",
        description:
          "A mensagem não revela como identidades ou contas internas estão vinculadas.",
      },
      provider: {
        kind: "google",
        label: "Continuar com Google",
        action: "sign-in",
      },
      secondary: {
        label: "Voltar ao início",
        action: "home",
      },
      note: "Mapeia external_identity_conflict com copy não enumerável.",
    },
    "rate-limited": {
      label: "Limite de tentativas",
      group: "Falhas",
      mode: "boundary",
      hero: {
        eyebrow: "Proteção de acesso",
        title: "Faça uma pausa antes de tentar novamente",
        description:
          "O Sandicts limita tentativas repetidas para proteger o fluxo de autenticação.",
      },
      boundary: {
        tone: "warning",
        icon: "clock",
        eyebrow: "Muitas tentativas",
        title: "Aguarde um pouco antes de tentar novamente",
        description:
          "Quando o período de espera terminar, reinicie o acesso com o Google.",
        primary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
    },
    "auth-forbidden": {
      label: "Forbidden de autenticação",
      group: "Acesso",
      mode: "boundary",
      hero: {
        eyebrow: "Limite de acesso",
        title: "Sua conta não pode continuar",
        description:
          "O Sandicts mantém este estado separado de sessão expirada e de falha temporária.",
      },
      boundary: {
        tone: "destructive",
        icon: "shield-x",
        eyebrow: "Acesso indisponível",
        title: "Você não tem acesso a esta área",
        description:
          "Use outra conta ou volte para uma área pública do Sandicts.",
        primary: {
          label: "Entrar com outra conta",
          action: "sign-in",
        },
        secondary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
      longCopy:
        "Nenhuma navegação privada é mostrada porque não há um contexto autenticado utilizável.",
    },
    routing: {
      label: "Resolvendo destino",
      group: "Pós-login",
      mode: "boundary",
      hero: {
        eyebrow: "Acesso confirmado",
        title: "Estamos preparando sua área",
        description:
          "O provider já terminou; agora o Sandicts resolve um destino autorizado.",
      },
      boundary: {
        tone: "info",
        icon: "route",
        eyebrow: "Acesso confirmado",
        title: "Preparando sua área…",
        description:
          "Aguarde enquanto verificamos seu destino e os contextos disponíveis.",
        pending: true,
      },
    },
    "return-to-rejected": {
      label: "Destino não autorizado",
      group: "Pós-login",
      mode: "boundary",
      hero: {
        eyebrow: "Destino protegido",
        title: "Vamos usar uma área disponível",
        description:
          "Um destino rejeitado não aparece na copy nem concede autorização.",
      },
      boundary: {
        tone: "warning",
        icon: "route",
        eyebrow: "Destino indisponível",
        title: "Não foi possível abrir o destino solicitado",
        description:
          "Escolha um contexto autorizado ou continue para uma área disponível.",
        primary: {
          label: "Escolher contexto",
          action: "choose-context",
        },
        secondary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
    },
    "player-onboarding": {
      label: "Handoff para onboarding",
      group: "Pós-login",
      mode: "boundary",
      hero: {
        eyebrow: "Primeiro acesso Player",
        title: "Complete o básico antes de jogar",
        description:
          "O onboarding só bloqueia um destino Player e preserva uma continuação autorizada.",
      },
      boundary: {
        tone: "info",
        icon: "user-round",
        eyebrow: "Perfil Player",
        title: "Complete seu perfil para continuar",
        description:
          "Informe os dados essenciais e depois retome o destino Player autorizado.",
        primary: {
          label: "Completar perfil",
          action: "onboarding",
        },
        secondary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
    },
    "context-picker": {
      label: "Seletor de contexto",
      group: "Pós-login",
      mode: "boundary",
      hero: {
        eyebrow: "Mais de uma área",
        title: "Escolha onde deseja entrar",
        description:
          "Nenhum contexto é selecionado arbitrariamente quando existem várias opções.",
      },
      boundary: {
        tone: "info",
        icon: "users",
        eyebrow: "Contextos disponíveis",
        title: "Onde você quer continuar?",
        description:
          "Escolha Player, Organization ou outra área autorizada para sua conta.",
        primary: {
          label: "Escolher contexto",
          action: "choose-context",
        },
        secondary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
      note:
        "A composição final reutiliza o ContextSwitcher aprovado; esta tela mostra apenas o handoff.",
    },
    "no-context": {
      label: "Nenhum contexto disponível",
      group: "Pós-login",
      mode: "boundary",
      hero: {
        eyebrow: "Conta autenticada",
        title: "Nenhuma área está disponível agora",
        description:
          "O Sandicts não inventa um perfil Player nem uma organização para completar o roteamento.",
      },
      boundary: {
        tone: "warning",
        icon: "users",
        eyebrow: "Sem contexto disponível",
        title: "Sua conta ainda não tem uma área disponível",
        description:
          "Não encontramos um contexto que você possa acessar agora.",
        primary: {
          label: "Voltar ao início",
          action: "home",
        },
      },
    },
  });

  const groups = Object.freeze([
    {
      label: "Entrada",
      states: ["entry-default", "google-ready"],
    },
    {
      label: "Google One Tap",
      states: [
        "one-tap-prompted",
        "one-tap-fallback",
        "one-tap-unsupported",
        "webview-unsupported",
      ],
    },
    {
      label: "Sessão",
      states: ["session-expired", "verification-failed"],
    },
    {
      label: "Loading e retry",
      states: [
        "checking-session",
        "provider-loading",
        "signing-in",
      ],
    },
    {
      label: "Falhas",
      states: [
        "login-cancelled",
        "invalid-credential",
        "provider-unavailable",
        "service-unavailable",
        "validation-error",
        "external-identity-conflict",
        "rate-limited",
      ],
    },
    {
      label: "Acesso",
      states: ["auth-forbidden"],
    },
    {
      label: "Pós-login",
      states: [
        "routing",
        "return-to-rejected",
        "player-onboarding",
        "context-picker",
        "no-context",
      ],
    },
  ]);

  const namespace = globalScope.SandictsAuthSignIn ?? {};
  namespace.catalog = Object.freeze({
    defaultState: "entry-default",
    groups,
    states,
  });
  globalScope.SandictsAuthSignIn = namespace;
})(window);
