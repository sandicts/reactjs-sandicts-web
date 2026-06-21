---
title: Especificacao De Telas Do MVP Sandicts
doc-type: frontend-screens-spec
role: working-draft
priority: high
canonical: docs/frontend/sandicts-mvp-screens-spec.md
related:
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-functional-spec.md
  - sandicts/sandicts-docs:docs/product/sandicts-mvp-scope.md
  - docs/frontend/sandicts-frontend-context.md
  - docs/frontend/sandicts-frontend-planning.md
scope: frontend, figma, ux, mvp, screens, flows
read-when:
  - desenhar telas do MVP no Figma
  - definir UX dos fluxos do MVP
  - criar tarefas frontend no Jira
  - validar se uma tela cobre as regras do MVP
do-not-read-when:
  - implementar regra de backend sem impacto visual
  - alterar infraestrutura, CI ou logger
---

# Especificacao De Telas Do MVP Sandicts

## Proposito

Este documento descreve as telas do MVP Sandicts em portugues para orientar:

- criacao de telas no Figma
- definicao de fluxos frontend
- criacao de tarefas no Jira
- validacao das dependencias com backend
- conversa de produto antes da implementacao

Ele se baseia em `sandicts/sandicts-docs:docs/product/sandicts-mvp-functional-spec.md`.

## Como Usar Este Documento

Para cada tela, validar:

- quem usa
- qual problema a tela resolve
- quais dados aparecem
- quais acoes existem
- quais estados precisam ser desenhados
- quais regras de negocio aparecem na experiencia
- quais APIs ou modulos de backend a tela depende

Este documento ainda e um rascunho. Ele deve ser incrementado conforme as telas
forem sendo desenhadas no Figma.

## Principios De UX Do MVP

### Produto

- Sandicts deve parecer uma comunidade e marketplace de esportes de areia.
- O MVP deve priorizar encontrar quadras, reservar horarios e jogar com outras
  pessoas.
- Progressao esportiva e identidade visual de atleta podem inspirar a UI, mas
  nao devem virar fluxo complexo no MVP.
- A Organization precisa de uma experiencia operacional clara, simples e rapida.

### Interface

- Estados de disponibilidade, reserva, pagamento e partida devem ser visiveis.
- O usuario deve entender o proximo passo sem depender de texto longo.
- Fluxos de reserva e entrada em partida devem ser curtos.
- Telas da Organization devem ser mais densas e operacionais.
- Telas de jogador podem ter mais energia de marca, mas sem atrapalhar a tarefa.

### Erros E Estados

Toda area do app deve prever:

- carregando
- vazio
- erro generico
- erro de validacao
- regra de negocio bloqueando acao
- sessao expirada
- acesso proibido
- recurso nao encontrado

## Areas Do App

### Area Publica

Objetivo:

- permitir entrada rapida no Sandicts
- explicar o minimo necessario para o usuario acessar
- nao bloquear o usuario com cadastro longo

Telas:

- Entrada / Login
- Sessao expirada
- Erro de autenticacao

### Area Do Jogador

Objetivo:

- ajudar o jogador a encontrar quadras
- solicitar reservas
- participar de partidas abertas
- manter um perfil minimo para filtros e matching

Telas:

- Home do jogador
- Onboarding de perfil
- Editar perfil
- Descoberta de quadras
- Detalhe da quadra
- Solicitar reserva
- Status/detalhe da reserva
- Historico de reservas
- Lista de partidas abertas
- Detalhe da partida aberta
- Criar partida aberta

### Area Da Organization

Objetivo:

- ajudar a Organization a cadastrar oferta
- gerenciar quadras e disponibilidade
- acompanhar reservas e pagamentos

Telas:

- Setup da Organization
- Dashboard da Organization
- Lista de quadras
- Criar/editar quadra
- Calendario de disponibilidade
- Agenda por dia
- Agenda por semana
- Detalhe da reserva
- Pagamentos pendentes
- Atualizar pagamento manual

## Mapa De Rotas Inicial

As rotas ainda podem mudar depois do Figma e da decisao de arquitetura do
frontend.

Rotas publicas:

- `/sign-in`

Rotas do jogador:

- `/app`
- `/app/profile`
- `/app/discovery`
- `/app/courts/[courtId]`
- `/app/reservations`
- `/app/reservations/[reservationId]`
- `/app/open-matches`
- `/app/open-matches/[matchId]`
- `/app/open-matches/new`

Rotas da Organization:

- `/organizations/:organizationSlug`
- `/organizations/:organizationSlug/profile`
- `/organizations/:organizationSlug/courts`
- `/organizations/:organizationSlug/courts/new`
- `/organizations/:organizationSlug/courts/[courtId]`
- `/organizations/:organizationSlug/calendar/configuration`
- `/organizations/:organizationSlug/calendar`
- `/organizations/:organizationSlug/reservations/[reservationId]`
- `/organizations/:organizationSlug/payments`

## Telas Publicas

### Tela: Entrada / Login

Rota sugerida:

- `/sign-in`

Usuarios:

- visitante
- usuario com sessao expirada
- usuario deslogado

Objetivo:

- permitir entrada com Google Sign-In ou Google One Tap
- criar ou recuperar a sessao interna do Sandicts
- evitar friccao de cadastro

Conteudo principal:

- marca Sandicts
- chamada curta de entrada
- botao "Continuar com Google"
- area onde o Google One Tap pode aparecer
- mensagem discreta de erro quando login falhar

Acoes:

- iniciar login com Google
- aceitar Google One Tap
- tentar novamente em caso de falha

Estados:

- carregando script do Google
- botao disponivel
- login em andamento
- erro generico de autenticacao
- usuario ja autenticado

Regras:

- nao mostrar formulario de senha como caminho padrao do MVP
- nao pedir escopos de Google Calendar
- nao expor detalhes tecnicos do provider

Dependencias de backend:

- `POST /auth/google/sign-in`
- endpoint de sessao atual
- politica de CORS/cookies

Notas para Figma:

- criar versao desktop e mobile
- desenhar erro generico sem mencionar detalhes do Google
- prever onde One Tap aparece sem quebrar layout

### Tela: Sessao Expirada

Rota sugerida:

- pode ser estado dentro de `/sign-in` ou modal global

Usuarios:

- usuario autenticado anteriormente
- usuario cujo refresh falhou

Objetivo:

- explicar que a sessao acabou
- levar usuario de volta ao login

Conteudo principal:

- mensagem curta de sessao expirada
- acao para entrar novamente com Google

Acoes:

- voltar para login
- iniciar login com Google

Estados:

- sessao expirada detectada em rota protegida
- tentativa de refresh falhou

Dependencias de backend:

- endpoint de refresh/sessao
- sign-out/invalida sessao local quando necessario

Notas para Figma:

- deve funcionar como tela e como estado modal/toast global

### Tela: Erro De Autenticacao

Rota sugerida:

- estado dentro de `/sign-in`

Usuarios:

- visitante
- usuario tentando entrar

Objetivo:

- mostrar falha de login de forma segura
- permitir nova tentativa

Conteudo principal:

- mensagem generica
- botao tentar novamente

Acoes:

- tentar login novamente

Estados:

- token invalido
- email nao verificado
- falha temporaria

Regras:

- nao expor se a falha veio de assinatura, issuer, audience ou provider

Notas para Figma:

- mensagem deve ser clara e curta

## Telas Do Jogador

### Tela: Home Do Jogador

Rota sugerida:

- `/app`

Usuarios:

- jogador autenticado com perfil completo

Objetivo:

- ser a primeira tela util depois do login
- direcionar para descoberta, reservas e partidas abertas

Conteudo principal:

- saudacao
- CTA para encontrar quadra
- resumo das proximas reservas
- CTA para criar ou ver partidas abertas
- aviso de perfil incompleto, se aplicavel
- esporte principal e nivel simples

Acoes:

- ir para descoberta
- ver reservas
- ver partidas abertas
- criar partida aberta
- editar perfil

Estados:

- carregando home
- sem reservas futuras
- sem partidas sugeridas
- perfil incompleto
- erro ao carregar dados

Dependencias de backend:

- sessao atual
- perfil do jogador
- reservas do jogador
- partidas abertas/resumo, se disponivel

Notas para Figma:

- pode aproveitar inspiracao do dashboard antigo, mas sem focar em overall/card
- priorizar acoes de marketplace e comunidade

### Tela: Onboarding De Perfil

Rota sugerida:

- `/app/profile`

Usuarios:

- jogador autenticado com perfil incompleto

Objetivo:

- coletar apenas o minimo para usar o MVP

Conteudo principal:

- nome de exibicao
- esporte principal
- nivel simples por esporte
- indicacao de progresso do onboarding se for multi-step

Acoes:

- escolher esporte
- escolher nivel
- salvar perfil

Estados:

- carregando dados iniciais
- salvando
- erro de validacao
- erro ao salvar
- sucesso

Regras:

- esporte deve ser um dos esportes do MVP
- nivel e autodeclarado
- nao exigir localizacao, foto, bio ou atributos avancados

Dependencias de backend:

- `GET /sports`
- `GET /players/me`
- `PATCH /players/me`

Notas para Figma:

- desenhar como fluxo rapido
- evitar parecer cadastro burocratico
- deixar claro que nivel pode ser ajustado depois

### Tela: Editar Perfil

Rota sugerida:

- `/app/profile`

Usuarios:

- jogador autenticado

Objetivo:

- permitir ajuste dos dados basicos do MVP

Conteudo principal:

- nome de exibicao
- esporte principal
- nivel por esporte

Acoes:

- salvar alteracoes
- cancelar/voltar

Estados:

- carregando perfil
- alteracoes pendentes
- salvando
- salvo
- erro de validacao
- erro ao carregar

Regras:

- nao incluir campos V2 como bio, foto, nacionalidade, lado de jogo, overall ou
  fundamentos

Dependencias de backend:

- `GET /players/me`
- `PATCH /players/me`
- `GET /sports`

Notas para Figma:

- pode compartilhar componentes com onboarding

### Tela: Descoberta De Quadras

Rota sugerida:

- `/app/discovery`

Usuarios:

- jogador autenticado
- visitante, somente se descoberta publica for aprovada

Objetivo:

- permitir encontrar quadras disponiveis por filtros simples

Conteudo principal:

- filtro de esporte
- filtro de data/horario
- filtro de preco
- lista de resultados
- cards de quadra/Organization

Acoes:

- alterar filtros
- abrir detalhe da quadra
- limpar filtros

Estados:

- estado inicial
- carregando resultados
- sem resultados
- erro ao buscar
- filtros aplicados

Regras:

- nao usar geolocalizacao no MVP
- mostrar apenas quadras ativas e reservaveis
- disponibilidade deve refletir reservas confirmadas

Dependencias de backend:

- `GET /discovery/courts`

Notas para Figma:

- mobile deve ser prioridade
- filtros precisam ser rapidos e visiveis
- card deve mostrar esporte, preco, disponibilidade e Organization

### Tela: Detalhe Da Quadra

Rota sugerida:

- `/app/courts/[courtId]`

Usuarios:

- jogador autenticado
- visitante se detalhe publico for aprovado

Objetivo:

- mostrar informacoes suficientes para decidir reservar

Conteudo principal:

- nome da quadra
- Organization
- esportes suportados
- preco
- regras simples
- horarios disponiveis
- CTA para solicitar reserva

Acoes:

- escolher horario
- solicitar reserva
- voltar para resultados

Estados:

- carregando detalhe
- quadra nao encontrada
- quadra indisponivel
- sem horarios disponiveis
- slot selecionado

Regras:

- quadra inativa nao deve aparecer como reservavel
- preco e regras devem aparecer antes da reserva

Dependencias de backend:

- `GET /discovery/courts/:courtId`
- `GET /discovery/courts/:courtId/availability`

Notas para Figma:

- detalhe deve reduzir duvida antes da reserva
- horarios precisam ser faceis de tocar no mobile

### Tela: Solicitar Reserva

Rota sugerida:

- pode ser `/app/courts/[courtId]` com step/modal ou rota propria

Usuarios:

- jogador autenticado

Objetivo:

- revisar dados e confirmar solicitacao de reserva

Conteudo principal:

- Organization
- quadra
- esporte
- data
- horario inicial/final
- preco
- regras da quadra
- status esperado apos solicitacao

Acoes:

- confirmar solicitacao
- voltar/alterar horario

Estados:

- revisando
- enviando solicitacao
- sucesso
- slot indisponivel
- erro de regra de negocio
- erro generico

Regras:

- nao criar reserva para slot indisponivel
- nao criar reserva para quadra inativa
- mostrar erro amigavel se alguem reservou antes

Dependencias de backend:

- `POST /reservations`

Notas para Figma:

- desenhar confirmacao clara antes do submit
- o jogador precisa entender que Organization ainda pode confirmar

### Tela: Status / Detalhe Da Reserva Do Jogador

Rota sugerida:

- `/app/reservations/[reservationId]`

Usuarios:

- jogador dono da reserva

Objetivo:

- mostrar status e proximas acoes da reserva

Conteudo principal:

- status da reserva
- status do pagamento
- dados da quadra
- data/hora
- preco
- regras ou instrucoes
- acoes permitidas

Acoes:

- cancelar reserva, se permitido
- voltar para historico
- ver quadra

Estados:

- pending_payment
- confirmed
- canceled
- expired
- completed
- cancelamento indisponivel
- carregando
- nao encontrada

Regras:

- jogador ve apenas suas reservas
- cancelamento depende da janela de cancelamento ainda a decidir

Dependencias de backend:

- endpoint de detalhe/historico de reservas do jogador
- endpoint de cancelamento

Notas para Figma:

- status precisa ser o elemento mais claro da tela

### Tela: Historico De Reservas

Rota sugerida:

- `/app/reservations`

Usuarios:

- jogador autenticado

Objetivo:

- listar reservas passadas e futuras do jogador

Conteudo principal:

- lista de reservas
- filtros simples por status ou periodo, se necessario
- status de reserva e pagamento

Acoes:

- abrir detalhe da reserva
- ir para descoberta para nova reserva

Estados:

- carregando
- sem reservas
- erro ao carregar
- lista com futuras/passadas

Dependencias de backend:

- `GET /players/me/reservations`

Notas para Figma:

- MVP pode comecar sem filtros complexos

### Tela: Lista De Partidas Abertas

Rota sugerida:

- `/app/open-matches`

Usuarios:

- jogador autenticado

Objetivo:

- permitir encontrar partidas abertas para entrar

Conteudo principal:

- lista de partidas
- filtro de esporte
- filtro de nivel, se disponivel
- status de vagas
- data/hora/local

Acoes:

- abrir detalhe
- criar partida
- filtrar

Estados:

- carregando
- sem partidas abertas
- erro ao carregar
- filtros sem resultado

Dependencias de backend:

- `GET /open-matches`

Notas para Figma:

- card deve mostrar vagas restantes com clareza

### Tela: Detalhe Da Partida Aberta

Rota sugerida:

- `/app/open-matches/[matchId]`

Usuarios:

- jogador autenticado

Objetivo:

- mostrar dados da partida e permitir entrar/sair/cancelar

Conteudo principal:

- esporte
- local
- data/hora
- nivel esperado
- participantes
- vagas restantes
- status da partida

Acoes:

- entrar
- sair
- cancelar, se for criador
- voltar para lista

Estados:

- open
- full
- canceled
- completed
- ja participa
- entrada bloqueada
- partida nao encontrada

Regras:

- jogador nao entra duas vezes
- jogador nao entra se cheia, cancelada ou concluida
- criador pode cancelar

Dependencias de backend:

- `GET /open-matches/:matchId`
- `POST /open-matches/:matchId/participants`
- `DELETE /open-matches/:matchId/participants/me`
- `PATCH /open-matches/:matchId/cancel`

Notas para Figma:

- o botao principal muda conforme estado: entrar, sair, cheia, cancelada

### Tela: Criar Partida Aberta

Rota sugerida:

- `/app/open-matches/new`

Usuarios:

- jogador autenticado

Objetivo:

- permitir que jogador organize uma partida simples

Conteudo principal:

- esporte
- local
- data
- horario
- limite de participantes
- nivel esperado

Acoes:

- criar partida
- cancelar/voltar

Estados:

- formulario vazio
- validacao
- criando
- sucesso
- erro ao criar

Regras:

- esporte deve ser do MVP
- limite de participantes deve ser valido
- nivel esperado e apenas expectativa

Dependencias de backend:

- `POST /open-matches`
- `GET /sports`

Notas para Figma:

- local da partida esta em decisao aberta: quadra/Organization, texto livre ou ambos

## Telas da Organization

### Tela: Setup da Organization

Rota sugerida:

- `/organizations/:organizationSlug/profile`

Usuarios:

- usuario autenticado sem perfil de Organization

Objetivo:

- criar perfil minimo de Organization para comecar a cadastrar quadras

Conteudo principal:

- nome da Organization
- tipo/categoria, se aprovado
- informacoes de listagem
- contato operacional
- localizacao textual/endereco, se aprovado

Acoes:

- salvar perfil
- voltar para area do jogador

Estados:

- formulario inicial
- salvando
- erro de validacao
- salvo
- acesso proibido

Regras:

- perfil de Organization deve existir antes de criar quadras
- dados da Organization pertencem ao usuario/Organization autenticado

Dependencias de backend:

- `GET /Organizations/me`
- `POST /Organizations`
- `PATCH /Organizations/me`

Notas para Figma:

- precisa ser simples o bastante para Organization nao abandonar o setup

### Tela: Dashboard da Organization

Rota sugerida:

- `/organizations/:organizationSlug`

Usuarios:

- Organization autenticado com perfil criado

Objetivo:

- dar visao operacional inicial da Organization

Conteudo principal:

- resumo da agenda do dia
- quantidade de quadras
- reservas pendentes/confirmadas
- pagamentos pendentes
- atalhos para quadras, disponibilidade, agenda e pagamentos

Acoes:

- criar quadra
- abrir agenda
- abrir pagamentos
- editar perfil

Estados:

- sem quadras
- sem disponibilidade
- sem reservas hoje
- carregando
- erro ao carregar

Dependencias de backend:

- perfil da Organization
- resumo de quadras
- resumo de agenda
- resumo de pagamentos

Notas para Figma:

- tela operacional, mais densa e escaneavel
- evitar visual muito promocional

### Tela: Lista De Quadras

Rota sugerida:

- `/organizations/:organizationSlug/courts`

Usuarios:

- Organization autenticado

Objetivo:

- gerenciar quadras da Organization

Conteudo principal:

- lista de quadras
- status ativo/inativo
- esportes suportados
- preco resumido

Acoes:

- criar nova quadra
- abrir/editar quadra
- ativar/desativar

Estados:

- sem quadras
- carregando
- erro ao carregar
- lista com quadras ativas/inativas

Dependencias de backend:

- `GET /organizations/:organizationSlug/courts`
- endpoint de status da quadra

Notas para Figma:

- estado vazio deve orientar criar primeira quadra

### Tela: Criar / Editar Quadra

Rota sugerida:

- `/organizations/:organizationSlug/courts/new`
- `/organizations/:organizationSlug/courts/[courtId]`

Usuarios:

- Organization autenticado

Objetivo:

- criar ou alterar dados de uma quadra

Conteudo principal:

- nome da quadra
- esportes suportados
- preco
- regras simples
- status ativo/inativo

Acoes:

- salvar
- cancelar
- ativar/desativar

Estados:

- criando
- editando
- salvando
- salvo
- erro de validacao
- acesso proibido

Regras:

- quadra deve ter ao menos um esporte do MVP
- Organization nao edita quadra de outra Organization
- quadra inativa nao pode ser reservada

Dependencias de backend:

- `POST /organizations/:organizationSlug/courts`
- `PATCH /organizations/:organizationSlug/courts/:courtId`
- `PATCH /organizations/:organizationSlug/courts/:courtId/status`
- `GET /sports`

Notas para Figma:

- diferenciar claramente salvar conteudo e mudar status ativo/inativo

### Tela: Calendario De Disponibilidade

Rota sugerida:

- `/organizations/:organizationSlug/calendar/configuration`

Usuarios:

- Organization autenticado

Objetivo:

- publicar horarios disponiveis das quadras

Conteudo principal:

- seletor de quadra
- calendario
- slots existentes
- botao criar horario
- editor de horario

Acoes:

- escolher quadra
- escolher data
- criar horario
- editar horario
- excluir/desativar horario

Estados:

- sem quadras
- sem horarios
- horario selecionado
- criando/editando
- erro de sobreposicao
- horario invalido

Regras:

- disponibilidade referencia quadra da Organization
- horarios invalidos sao bloqueados
- disponibilidade deve refletir reservas confirmadas

Dependencias de backend:

- `GET /organizations/:organizationSlug/calendar/configuration`
- `POST /organizations/:organizationSlug/calendar/configuration`
- `PATCH /organizations/:organizationSlug/calendar/configuration/:slotId`
- `DELETE /organizations/:organizationSlug/calendar/configuration/:slotId`

Notas para Figma:

- mobile pode precisar de uma versao menos densa que calendario desktop

### Tela: Agenda Por Dia

Rota sugerida:

- `/organizations/:organizationSlug/calendar`

Usuarios:

- Organization autenticado

Objetivo:

- acompanhar operacao do dia

Conteudo principal:

- data selecionada
- lista/timeline de horarios por quadra
- reservas pendentes/confirmadas
- status de pagamento

Acoes:

- mudar data
- abrir detalhe da reserva
- ir para disponibilidade

Estados:

- sem agenda no dia
- carregando
- erro ao carregar
- slots com e sem reserva

Dependencias de backend:

- `GET /organizations/:organizationSlug/calendar`

Notas para Figma:

- esta tela e de trabalho diario, deve ser rapida de escanear

### Tela: Agenda Por Semana

Rota sugerida:

- pode compartilhar `/organizations/:organizationSlug/calendar` com tab/segmento semana

Usuarios:

- Organization autenticado

Objetivo:

- dar visao de planejamento semanal

Conteudo principal:

- semana selecionada
- dias da semana
- resumo por dia/quadra
- reservas e disponibilidades

Acoes:

- mudar semana
- abrir dia
- abrir reserva
- criar disponibilidade

Estados:

- semana vazia
- carregando
- erro ao carregar

Dependencias de backend:

- `GET /organizations/:organizationSlug/calendar`

Notas para Figma:

- desenhar responsividade com cuidado; semana pode ficar densa no mobile

### Tela: Detalhe da reserva da Organization

Rota sugerida:

- `/organizations/:organizationSlug/reservations/[reservationId]`

Usuarios:

- Organization dono da reserva

Objetivo:

- permitir revisar e decidir sobre uma reserva

Conteudo principal:

- jogador
- quadra
- esporte
- data/hora
- status da reserva
- status do pagamento
- preco
- acoes permitidas

Acoes:

- confirmar reserva
- cancelar reserva
- abrir pagamento
- voltar para agenda

Estados:

- pending_payment
- confirmed
- canceled
- expired
- completed
- acao bloqueada
- acesso proibido
- reserva nao encontrada

Regras:

- Organization so acessa reservas do propria Organization
- confirmacao deve respeitar estado de pagamento se a regra exigir
- reserva confirmada bloqueia horario

Dependencias de backend:

- `GET /organizations/:organizationSlug/reservations/:reservationId`
- `PATCH /organizations/:organizationSlug/reservations/:reservationId/confirm`
- `PATCH /organizations/:organizationSlug/reservations/:reservationId/cancel`

Notas para Figma:

- acoes de confirmar/cancelar devem ser muito claras

### Tela: Pagamentos Pendentes

Rota sugerida:

- `/organizations/:organizationSlug/payments`

Usuarios:

- Organization autenticado

Objetivo:

- acompanhar reservas com pagamento pendente, vencido ou falho

Conteudo principal:

- lista de pagamentos
- status
- valor
- reserva relacionada
- jogador/quadra/data

Acoes:

- abrir detalhe
- atualizar status manualmente
- filtrar por status, se necessario

Estados:

- sem pagamentos pendentes
- carregando
- erro ao carregar
- lista filtrada vazia

Dependencias de backend:

- `GET /organizations/:organizationSlug/payments`

Notas para Figma:

- status de pagamento precisa ser facil de comparar

### Tela: Atualizar Pagamento Manual

Rota sugerida:

- pode ser modal dentro de `/organizations/:organizationSlug/payments` ou detalhe de reserva

Usuarios:

- Organization autenticado

Objetivo:

- permitir mudanca manual do status de pagamento

Conteudo principal:

- status atual
- novo status
- valor
- reserva relacionada
- confirmacao da acao

Acoes:

- marcar como pago
- marcar como falhou
- marcar como vencido
- cancelar atualizacao

Estados:

- aguardando confirmacao
- atualizando
- atualizado
- transicao bloqueada
- erro ao atualizar

Regras:

- Organization nao atualiza pagamento de outra Organization
- gateway nao e necessario no MVP
- `refunded` nao deve aparecer sem fluxo de reembolso

Dependencias de backend:

- `PATCH /organizations/:organizationSlug/payments/:paymentId/status`

Notas para Figma:

- pedir confirmacao quando a mudanca tiver impacto operacional

## Telas E Estados Globais

### Estado: Carregando

Objetivo:

- indicar que dados estao sendo buscados ou acao esta em andamento

Uso:

- listas
- detalhes
- formularios salvando
- auth

Notas para Figma:

- definir skeleton ou loading compacto
- evitar layout pulando quando dados carregam

### Estado: Vazio

Objetivo:

- orientar o usuario quando ainda nao ha dados

Exemplos:

- jogador sem reservas
- Organization sem quadras
- Organization sem disponibilidade
- descoberta sem resultados
- lista de partidas aberta vazia

Notas para Figma:

- cada empty state deve ter proxima acao clara

### Estado: Acesso Proibido

Objetivo:

- explicar que usuario nao tem permissao para aquela area ou recurso

Uso:

- jogador tentando acessar dado da Organization sem permissao
- Organization tentando acessar dado de outra Organization

Notas para Figma:

- mensagem simples
- acao segura para voltar ao dashboard correto

### Estado: Nao Encontrado

Objetivo:

- lidar com recurso removido ou inexistente

Uso:

- quadra nao encontrada
- reserva nao encontrada
- partida aberta nao encontrada

Notas para Figma:

- nao expor informacao privada sobre existencia de dados de outra Organization

### Estado: Erro De Regra De Negocio

Objetivo:

- mostrar que a acao fazia sentido, mas foi bloqueada por regra do produto

Exemplos:

- slot ja reservado
- partida cheia
- jogador ja entrou na partida
- cancelamento fora da janela permitida
- quadra inativa

Notas para Figma:

- mensagem deve aparecer perto da acao
- permitir proximo passo quando existir

## Ordem Recomendada Para Figma

1. Fundacao visual: tokens, botoes, inputs, badges, cards e estados base
2. Auth: entrada, erro, sessao expirada
3. Jogador: onboarding de perfil e home
4. Jogador: descoberta, detalhe da quadra e solicitar reserva
5. Organization: setup, dashboard e quadras
6. Organization: disponibilidade e agenda
7. Reservas: detalhe do jogador e detalhe da Organization
8. Pagamentos manuais
9. Partidas abertas
10. Revisao mobile de todos os fluxos principais

## Decisoes De Produto Que Afetam Telas

Estas decisoes devem ser preenchidas conforme o Figma evoluir:

- descoberta publica existe antes do login?
- jogador e Organization ficam no mesmo app shell ou em areas bem separadas?
- qual e a navegacao mobile principal?
- quais campos exatos do perfil de Organization entram no MVP?
- quais campos exatos de localizacao aparecem sem geolocalizacao?
- slot de disponibilidade e por quadra ou por esporte?
- preco e por quadra, por horario ou por regra simples?
- qual e a duracao padrao de uma reserva?
- qual e a janela de cancelamento?
- partida aberta usa quadra/Organization, texto livre ou ambos como local?
- quais empty states precisam de ilustracao ou podem ser apenas texto/icone?

## Proximo Passo

Usar este documento para desenhar primeiro:

1. tela de entrada
2. onboarding de perfil do jogador
3. home do jogador
4. descoberta de quadras
5. detalhe da quadra
6. solicitacao de reserva
7. Setup da Organization
8. Dashboard da Organization
9. lista/criacao de quadras

Depois disso, revisar as decisoes abertas e transformar os fluxos aprovados em
issues detalhadas de frontend, backend e integracao no Jira.
