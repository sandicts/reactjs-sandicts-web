(function registerMagicLinkPrototypeCatalog(globalScope) {
  "use strict";

  const namespace =
    globalScope.sandictsMagicLinkPrototype ??
    (globalScope.sandictsMagicLinkPrototype = {});

  const entryHero = Object.freeze({
    eyebrow: "Acesso Sandicts",
    title: "Entre para continuar",
    description: "Use Google ou receba um link seguro no seu e-mail.",
  });

  const callbackHero = Object.freeze({
    eyebrow: "Acesso por e-mail",
    title: "Confirme seu acesso",
    description:
      "O Sandicts verifica o link sem expor o endereço, a conta ou detalhes internos.",
  });

  const entryCard = Object.freeze({
    eyebrow: "Acesso seguro",
    title: "Entre na sua conta",
    description: "Escolha como deseja continuar.",
  });

  const states = Object.freeze({
    "email-entry": {
      group: "Solicitação",
      label: "Entrada por e-mail",
      presentation: "entry",
      hero: entryHero,
      card: entryCard,
      form: {
        invalid: false,
        busy: false,
        submitLabel: "Enviar link",
        googleDisabled: false,
      },
      longCopy:
        "O endereço permanece apenas no formulário atual e nunca aparece na URL, na confirmação ou no catálogo de estados.",
    },
    "session-expired-entry": {
      group: "Solicitação",
      label: "Entrada após sessão expirada",
      presentation: "entry",
      hero: {
        eyebrow: "Acesso Sandicts",
        title: "Entre novamente",
        description:
          "Use Google ou receba um link seguro para continuar em um destino autorizado.",
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
        title: "Entre novamente",
        description: "Escolha como deseja confirmar seu acesso.",
      },
      form: {
        invalid: false,
        busy: false,
        submitLabel: "Enviar link",
        googleDisabled: false,
      },
      longCopy:
        "A mensagem de sessão permanece acima dos métodos até a autenticação concluir ou a pessoa deixar a página.",
    },
    "email-invalid": {
      group: "Solicitação",
      label: "E-mail inválido",
      presentation: "entry",
      hero: entryHero,
      alert: {
        tone: "destructive",
        icon: "info",
        title: "Revise o endereço",
        description:
          "Não foi possível enviar o formulário. Corrija o campo indicado.",
      },
      card: entryCard,
      form: {
        invalid: true,
        busy: false,
        submitLabel: "Enviar link",
        googleDisabled: false,
      },
      longCopy:
        "O frontend usa uma mensagem localizada e não mostra os detalhes ou caminhos retornados pela validação da API.",
    },
    requesting: {
      group: "Solicitação",
      label: "Envio em andamento",
      presentation: "entry",
      hero: entryHero,
      card: {
        eyebrow: "Acesso seguro",
        title: "Enviando seu link",
        description:
          "Aguarde enquanto confirmamos a solicitação de acesso por e-mail.",
      },
      form: {
        invalid: false,
        busy: true,
        submitLabel: "Enviando…",
        googleDisabled: true,
      },
      longCopy:
        "Controles permanecem com a mesma largura, não aceitam envio duplicado e não repetem a solicitação automaticamente.",
    },
    "sent-cooldown": {
      group: "Confirmação",
      label: "Link solicitado · cooldown",
      presentation: "sent",
      hero: {
        eyebrow: "Próximo passo",
        title: "Confira seu e-mail",
        description:
          "Abra o link no mesmo navegador ou dispositivo em que deseja entrar.",
      },
      card: {
        eyebrow: "Solicitação aceita",
        title: "Confira seu e-mail",
        description:
          "Se o endereço informado estiver correto, você receberá um link para entrar. Ele pode levar alguns instantes.",
      },
      sent: {
        status: "Você poderá solicitar outro link em 60 segundos.",
        resendDisabled: true,
        busy: false,
        resendLabel: "Reenviar link",
      },
      longCopy:
        "O endereço não é repetido na confirmação. Se não encontrar a mensagem, verifique spam e lixo eletrônico antes de solicitar outra.",
    },
    "resend-ready": {
      group: "Confirmação",
      label: "Reenvio disponível",
      presentation: "sent",
      hero: {
        eyebrow: "Próximo passo",
        title: "Confira seu e-mail",
        description:
          "Use o link mais recente que receber para confirmar seu acesso.",
      },
      card: {
        eyebrow: "Solicitação aceita",
        title: "Confira seu e-mail",
        description:
          "Se precisar, solicite outro link. Uma nova solicitação substitui o link anterior.",
      },
      sent: {
        status: "O reenvio está disponível.",
        resendDisabled: false,
        busy: false,
        resendLabel: "Reenviar link",
      },
      longCopy:
        "A ação chama o mesmo endpoint de solicitação e reinicia apenas o cooldown local de prevenção a cliques acidentais.",
    },
    resending: {
      group: "Confirmação",
      label: "Reenvio em andamento",
      presentation: "sent",
      hero: {
        eyebrow: "Próximo passo",
        title: "Confira seu e-mail",
        description:
          "Aguarde enquanto solicitamos um novo link para o endereço informado.",
      },
      card: {
        eyebrow: "Nova solicitação",
        title: "Reenviando o link",
        description:
          "Quando a solicitação terminar, use somente o e-mail mais recente.",
      },
      sent: {
        status: "Reenviando…",
        resendDisabled: true,
        busy: true,
        resendLabel: "Reenviando…",
      },
      longCopy:
        "O resultado desconhecido nunca é repetido automaticamente e o endereço continua fora da copy visível.",
    },
    "request-rate-limited": {
      group: "Recuperação da solicitação",
      label: "Limite de solicitações",
      presentation: "boundary",
      hero: entryHero,
      boundary: {
        tone: "warning",
        icon: "clock",
        eyebrow: "Acesso por e-mail",
        title: "Muitas tentativas",
        description:
          "Aguarde um pouco antes de solicitar outro link. Você ainda pode continuar com Google.",
        status: "Nenhum tempo exato é prometido.",
        busy: false,
        primary: {
          label: "Continuar com Google",
          target: "routing",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "O contrato atual não oferece um cooldown confiável, por isso a interface não inventa uma contagem regressiva nem libera retry imediato.",
    },
    "delivery-unavailable": {
      group: "Recuperação da solicitação",
      label: "Envio por e-mail indisponível",
      presentation: "boundary",
      hero: entryHero,
      boundary: {
        tone: "destructive",
        icon: "wifi-off",
        eyebrow: "Acesso por e-mail",
        title: "Não foi possível enviar o link agora",
        description:
          "O envio por e-mail está temporariamente indisponível. Tente novamente em alguns instantes.",
        status: "",
        busy: false,
        primary: {
          label: "Tentar novamente",
          action: "retry-request",
        },
        secondary: {
          label: "Continuar com Google",
          target: "routing",
        },
      },
      longCopy:
        "Nenhum nome de provider, transporte, chave, payload ou mensagem técnica aparece para a pessoa.",
    },
    "request-failed": {
      group: "Recuperação da solicitação",
      label: "Falha sem confirmação de envio",
      presentation: "boundary",
      hero: entryHero,
      boundary: {
        tone: "destructive",
        icon: "wifi-off",
        eyebrow: "Acesso por e-mail",
        title: "Não foi possível confirmar o envio",
        description:
          "Confira sua conexão e tente novamente. A solicitação não será repetida sem sua ação.",
        status: "",
        busy: false,
        primary: {
          label: "Tentar novamente",
          action: "retry-request",
        },
        secondary: {
          label: "Usar outro e-mail",
          target: "email-entry",
        },
      },
      longCopy:
        "Falha de rede, timeout e erro interno não provam se a entrega aconteceu; o protótipo evita falsa certeza e replay silencioso.",
    },
    verifying: {
      group: "Consumo",
      label: "Verificação em andamento",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "info",
        icon: "loader",
        eyebrow: "Acesso por e-mail",
        title: "Verificando seu link",
        description:
          "Aguarde enquanto confirmamos seu acesso de forma segura.",
        status: "Verificando seu link…",
        busy: true,
      },
      longCopy:
        "O token já foi removido da URL visível, permanece apenas em memória e o One Tap não é montado nesta rota.",
    },
    "invalid-link": {
      group: "Falhas do link",
      label: "Link inválido",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "destructive",
        icon: "shield-x",
        eyebrow: "Link indisponível",
        title: "Este link não é válido",
        description:
          "Solicite um novo link para entrar com segurança.",
        status: "",
        busy: false,
        primary: {
          label: "Solicitar novo link",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "Token ausente, malformado, desconhecido e validation_error convergem nesta copy sem revelar qual verificação falhou.",
    },
    "expired-link": {
      group: "Falhas do link",
      label: "Link expirado",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "warning",
        icon: "clock",
        eyebrow: "Link indisponível",
        title: "Este link expirou",
        description: "Solicite um novo link para continuar.",
        status: "",
        busy: false,
        primary: {
          label: "Solicitar novo link",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "A copy é exclusiva do link e nunca usa a mensagem de sessão autenticada expirada definida por KAN-81.",
    },
    "used-link": {
      group: "Falhas do link",
      label: "Link já utilizado",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "warning",
        icon: "check",
        eyebrow: "Link indisponível",
        title: "Este link já foi utilizado",
        description:
          "Para entrar neste dispositivo, solicite um novo link.",
        status: "",
        busy: false,
        primary: {
          label: "Solicitar novo link",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "O estado não afirma onde ou por quem o link foi usado e não expõe dados da sessão criada anteriormente.",
    },
    "superseded-link": {
      group: "Falhas do link",
      label: "Link substituído",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "info",
        icon: "refresh",
        eyebrow: "Link indisponível",
        title: "Há um link mais recente",
        description:
          "Use o e-mail mais recente que recebeu ou solicite outro link.",
        status: "",
        busy: false,
        primary: {
          label: "Solicitar outro link",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "A recuperação explica latest-link-wins sem mencionar revogação, challenge, banco de dados ou hash.",
    },
    "consume-rate-limited": {
      group: "Falhas do link",
      label: "Limite de verificações",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "warning",
        icon: "clock",
        eyebrow: "Verificação indisponível",
        title: "Não foi possível verificar agora",
        description:
          "Aguarde um pouco antes de tentar entrar novamente.",
        status: "O link não será repetido automaticamente.",
        busy: false,
        primary: {
          label: "Voltar para entrar",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "A interface não exibe retry imediato ou tempo exato sem um sinal contratual confiável.",
    },
    "auth-forbidden": {
      group: "Falhas do link",
      label: "Autenticação proibida",
      presentation: "boundary",
      hero: {
        eyebrow: "Acesso Sandicts",
        title: "Escolha como continuar",
        description:
          "O acesso atual não pode ser usado para entrar nesta área.",
      },
      boundary: {
        tone: "destructive",
        icon: "shield-x",
        eyebrow: "Estado da conta",
        title: "Você não tem acesso a esta área",
        description:
          "Use outra conta ou volte para uma área pública do Sandicts.",
        status: "",
        busy: false,
        primary: {
          label: "Usar outro e-mail",
          target: "email-entry",
        },
        secondary: {
          label: "Voltar ao início",
          target: "email-entry",
        },
      },
      longCopy:
        "A boundary preserva KAN-84, remove qualquer contexto privado inutilizável e não chama o resultado de sessão expirada.",
    },
    "verification-failed": {
      group: "Falhas do link",
      label: "Falha temporária de verificação",
      presentation: "boundary",
      hero: callbackHero,
      boundary: {
        tone: "destructive",
        icon: "wifi-off",
        eyebrow: "Verificação interrompida",
        title: "Não foi possível confirmar seu acesso",
        description: "Confira sua conexão e tente novamente.",
        status: "A tentativa não será repetida automaticamente.",
        busy: false,
        primary: {
          label: "Tentar novamente",
          action: "retry-consume",
        },
        secondary: {
          label: "Solicitar novo link",
          target: "email-entry",
        },
      },
      longCopy:
        "Falha de rede, timeout ou erro interno não é apresentada como link inválido, expirado ou usado.",
    },
    routing: {
      group: "Sucesso e handoff",
      label: "Preparando destino pós-login",
      presentation: "boundary",
      hero: {
        eyebrow: "Acesso confirmado",
        title: "Seu próximo passo está sendo preparado",
        description:
          "O mesmo resolvedor usado pelos outros métodos escolhe somente um destino autorizado.",
      },
      boundary: {
        tone: "success",
        icon: "route",
        eyebrow: "Acesso confirmado",
        title: "Preparando sua área",
        description:
          "Seu acesso foi confirmado. Estamos verificando o destino disponível.",
        status: "Preparando sua área…",
        busy: true,
      },
      longCopy:
        "returnTo, onboarding Player, contexto anterior, contexto único, seletor e no-context permanecem resultados do resolvedor KAN-82.",
    },
  });

  const groups = Object.freeze([
    {
      label: "Solicitação",
      states: [
        "email-entry",
        "session-expired-entry",
        "email-invalid",
        "requesting",
      ],
    },
    {
      label: "Confirmação e reenvio",
      states: ["sent-cooldown", "resend-ready", "resending"],
    },
    {
      label: "Recuperação da solicitação",
      states: [
        "request-rate-limited",
        "delivery-unavailable",
        "request-failed",
      ],
    },
    {
      label: "Consumo",
      states: ["verifying"],
    },
    {
      label: "Falhas do link",
      states: [
        "invalid-link",
        "expired-link",
        "used-link",
        "superseded-link",
        "consume-rate-limited",
        "auth-forbidden",
        "verification-failed",
      ],
    },
    {
      label: "Sucesso e handoff",
      states: ["routing"],
    },
  ]);

  namespace.catalog = Object.freeze({
    defaultState: "email-entry",
    groups,
    states,
  });
})(window);
