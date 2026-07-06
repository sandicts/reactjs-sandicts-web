(function registerGlobalStatesRenderer(globalScope) {
  const namespace = globalScope.SandictsGlobalStates;
  const {
    actionLoadingCatalog,
    contexts,
    organizationNavigation,
    playerNavigation,
    stateCatalog,
    stateLabels,
  } = namespace.catalog;

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  }

  function createIcon(iconName, className = "icon") {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    icon.setAttribute("class", className);
    icon.setAttribute("aria-hidden", "true");
    use.setAttribute("href", `#icon-${iconName}`);
    icon.append(use);

    return icon;
  }

  function createRenderer(elements) {
    const {
      adaptiveNavigation,
      bottomNavigation,
      contextChip,
      contextEyebrow,
      contextTitle,
      demoShell,
      drawerNavigation,
      organizationDrawer,
      organizationMenuTrigger,
      pageDescription,
      pageEyebrow,
      pagePrimaryAction,
      pageTitle,
      stateRegion,
    } = elements;

    function renderNavigation(container, groups, compact = false) {
      container.replaceChildren();

      groups.forEach((group) => {
        if (compact) {
          group.items.forEach((item) => {
            const link = createElement("a", "navigation-link");

            link.href = "#shell-main";
            link.append(
              createIcon(item.icon),
              createElement("span", "", item.label),
            );

            if (item.current) {
              link.setAttribute("aria-current", "page");
            }

            container.append(link);
          });
          return;
        }

        const groupElement = createElement("section", "navigation-group");
        const groupLabel = createElement(
          "p",
          "navigation-group__label",
          group.label,
        );

        groupElement.append(groupLabel);

        group.items.forEach((item) => {
          const link = createElement("a", "navigation-link");
          const label = createElement("span", "adaptive-label", item.label);

          link.href = "#shell-main";
          link.append(createIcon(item.icon), label);

          if (item.current) {
            link.setAttribute("aria-current", "page");
          }

          groupElement.append(link);
        });

        container.append(groupElement);
      });
    }

    function updateShell(contextName) {
      const context = contexts[contextName];
      const isPublic = contextName === "public";
      const isPlayer = contextName === "player";
      const isOrganization = contextName === "organization";
      const navigation = isOrganization
        ? organizationNavigation
        : playerNavigation;

      demoShell.dataset.context = contextName;
      document.querySelectorAll("[data-public-region]").forEach((region) => {
        region.hidden = !isPublic;
      });
      document
        .querySelectorAll("[data-authenticated-region]")
        .forEach((region) => {
          region.hidden = isPublic;
        });
      document.querySelectorAll("[data-player-region]").forEach((region) => {
        region.hidden = !isPlayer;
      });

      organizationMenuTrigger.hidden = !isOrganization;
      contextEyebrow.textContent = isOrganization ? "Organização" : "Player";
      contextTitle.textContent = context.title;
      contextChip.textContent = isOrganization ? "Arena Sul" : "Player";
      pageEyebrow.textContent = context.eyebrow;
      pageTitle.textContent = context.title;
      pageDescription.textContent = context.description;
      pagePrimaryAction.textContent = context.pageAction;

      if (!isPublic) {
        renderNavigation(adaptiveNavigation, navigation);
      }

      if (isPlayer) {
        renderNavigation(bottomNavigation, playerNavigation, true);
      }

      if (isOrganization) {
        renderNavigation(drawerNavigation, organizationNavigation);
      } else if (organizationDrawer.open) {
        organizationDrawer.close();
      }
    }

    function createSkeleton(className) {
      return createElement("div", `skeleton ${className}`);
    }

    function createSkeletonHeading() {
      const heading = createElement("div", "skeleton-heading");

      heading.append(
        createSkeleton("skeleton--eyebrow"),
        createSkeleton("skeleton--title"),
        createSkeleton("skeleton--line"),
        createSkeleton("skeleton--line skeleton--line-short"),
      );
      return heading;
    }

    function createCardsSkeleton() {
      const grid = createElement("div", "skeleton-card-grid");

      for (let index = 0; index < 3; index += 1) {
        const card = createElement("div", "skeleton-card");

        card.append(
          createSkeleton("skeleton-card__media"),
          createSkeleton("skeleton--line"),
          createSkeleton("skeleton--line skeleton--line-short"),
          createSkeleton("skeleton-card__action"),
        );
        grid.append(card);
      }

      return grid;
    }

    function createTableSkeleton() {
      const scrollRegion = createElement("div", "skeleton-scroll-region");
      const table = createElement("div", "skeleton-table");

      scrollRegion.setAttribute("role", "region");
      scrollRegion.setAttribute("aria-label", "Prévia da tabela em carregamento");

      for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
        const row = createElement(
          "div",
          `skeleton-table__row${
            rowIndex === 0 ? " skeleton-table__row--header" : ""
          }`,
        );

        for (let cellIndex = 0; cellIndex < 3; cellIndex += 1) {
          row.append(createSkeleton("skeleton-table__cell"));
        }

        table.append(row);
      }

      scrollRegion.append(table);
      return scrollRegion;
    }

    function createCalendarSkeleton() {
      const scrollRegion = createElement("div", "skeleton-scroll-region");
      const calendar = createElement("div", "skeleton-calendar");

      scrollRegion.setAttribute("role", "region");
      scrollRegion.setAttribute(
        "aria-label",
        "Prévia do calendário em carregamento",
      );

      for (let cellIndex = 0; cellIndex < 16; cellIndex += 1) {
        const isHeader = cellIndex < 4;
        const cell = createElement(
          "div",
          `skeleton-calendar__cell${
            isHeader ? " skeleton-calendar__cell--header" : ""
          }`,
        );

        if (isHeader || cellIndex % 3 !== 1) {
          cell.append(createSkeleton("skeleton-calendar__block"));
        }

        calendar.append(cell);
      }

      scrollRegion.append(calendar);
      return scrollRegion;
    }

    function createDashboardSkeleton() {
      const dashboard = createElement("div", "skeleton-dashboard");
      const metrics = createElement("div", "skeleton-dashboard__metrics");
      const panels = createElement("div", "skeleton-dashboard__panels");

      for (let metricIndex = 0; metricIndex < 3; metricIndex += 1) {
        const metric = createElement("div", "skeleton-metric");

        metric.append(
          createSkeleton("skeleton--eyebrow"),
          createSkeleton("skeleton--title"),
        );
        metrics.append(metric);
      }

      for (let panelIndex = 0; panelIndex < 2; panelIndex += 1) {
        const panel = createElement("div", "skeleton-dashboard__panel");

        panel.append(
          createSkeleton("skeleton--title"),
          createSkeleton("skeleton--line"),
          createSkeleton("skeleton--line"),
          createSkeleton("skeleton--line skeleton--line-short"),
        );
        panels.append(panel);
      }

      dashboard.append(metrics, panels);
      return dashboard;
    }

    function renderPageLoading(shapeName, contextName) {
      const panel = createElement("article", "skeleton-panel");
      const accessibleStatus = createElement(
        "p",
        "sr-only",
        `Carregando ${contexts[contextName].title.toLowerCase()}.`,
      );
      const visual = createElement("div");
      const shapeFactories = {
        cards: createCardsSkeleton,
        table: createTableSkeleton,
        calendar: createCalendarSkeleton,
        dashboard: createDashboardSkeleton,
      };

      accessibleStatus.setAttribute("role", "status");
      visual.setAttribute("aria-hidden", "true");
      visual.append(createSkeletonHeading(), shapeFactories[shapeName]());
      panel.append(accessibleStatus, visual);

      stateRegion.removeAttribute("aria-labelledby");
      stateRegion.setAttribute("aria-label", "Conteúdo em carregamento");
      stateRegion.setAttribute("aria-busy", "true");
      stateRegion.replaceChildren(panel);
    }

    function renderActionLoading(contextName) {
      const definition = actionLoadingCatalog[contextName];
      const panel = createElement("article", "action-loading-panel");
      const card = createElement("div", "action-loading-card");
      const heading = createElement("h3", "", definition.title);
      const description = createElement("p", "", definition.description);
      const summary = createElement("div", "action-loading-card__summary");
      const actions = createElement("div", "action-loading-card__actions");
      const loadingButton = createElement("button", "button button--primary");
      const cancelButton = createElement(
        "button",
        "button button--secondary",
        "Cancelar",
      );
      const status = createElement("p", "sr-only", definition.buttonLabel);

      heading.id = "state-heading";
      definition.rows.forEach(([label, value]) => {
        const row = createElement("span");

        row.append(
          createElement("span", "", label),
          createElement("strong", "", value),
        );
        summary.append(row);
      });

      loadingButton.type = "button";
      loadingButton.disabled = true;
      loadingButton.setAttribute("aria-busy", "true");
      loadingButton.append(
        createIcon("loader", "icon loading-icon"),
        createElement("span", "", definition.buttonLabel),
      );
      cancelButton.type = "button";
      cancelButton.dataset.demoAction = "cancel";
      status.setAttribute("role", "status");
      actions.append(loadingButton, cancelButton);
      card.append(heading, description, summary, actions, status);
      panel.append(card);

      stateRegion.setAttribute("aria-labelledby", "state-heading");
      stateRegion.removeAttribute("aria-label");
      stateRegion.removeAttribute("aria-busy");
      stateRegion.replaceChildren(panel);
    }

    function applyLongCopy(definition, isLongCopy) {
      if (!isLongCopy) {
        return definition;
      }

      return {
        ...definition,
        description: `${definition.description} As informações e ações continuam disponíveis abaixo para que você escolha o próximo passo sem perder o contexto atual.`,
        primary: definition.primary
          ? {
              ...definition.primary,
              label: `${definition.primary.label} e continuar com segurança`,
            }
          : undefined,
      };
    }

    function createStatePanel(contextName, stateName, isLongCopy) {
      const definition = applyLongCopy(
        stateCatalog[contextName][stateName],
        isLongCopy,
      );
      const panel = createElement("article", "state-panel");
      const content = createElement("div", "state-panel__content");
      const iconContainer = createElement("div", "state-panel__icon");
      const kicker = createElement(
        "p",
        "state-panel__kicker",
        definition.kicker,
      );
      const heading = createElement("h3", "", definition.title);
      const description = createElement(
        "p",
        "state-panel__description",
        definition.description,
      );

      panel.dataset.tone = definition.tone;
      heading.id = "state-heading";
      iconContainer.append(createIcon(definition.icon));
      content.append(iconContainer, kicker, heading, description);

      if (definition.primary || definition.secondary) {
        const actions = createElement("div", "state-panel__actions");

        [definition.primary, definition.secondary]
          .filter(Boolean)
          .forEach((action, index) => {
            const button = createElement(
              "button",
              `button ${
                index === 0 ? "button--primary" : "button--secondary"
              }${isLongCopy ? " long-copy-label" : ""}`,
              action.label,
            );

            button.type = "button";
            button.dataset.demoAction = action.action;
            actions.append(button);
          });

        content.append(actions);
      }

      if (definition.note) {
        const note = createElement(
          "p",
          "state-panel__note",
          definition.note,
        );

        note.prepend(createIcon("clock"));
        content.append(note);
      }

      panel.append(content);
      return panel;
    }

    function createStructureHeader(title, detail) {
      const header = createElement("header", "content-frame__header");

      header.append(
        createElement("strong", "", title),
        createElement("span", "", detail),
      );
      return header;
    }

    function createCardsEmptyFrame(panel) {
      const frame = createElement(
        "section",
        "content-frame content-frame--cards",
      );
      const grid = createElement("div", "empty-card-grid");

      panel.classList.add("state-panel--embedded");
      grid.append(panel);
      frame.append(createStructureHeader("Resultados", "0 itens"), grid);
      return frame;
    }

    function createTableEmptyFrame(panel) {
      const frame = createElement(
        "section",
        "content-frame content-frame--table",
      );
      const scrollRegion = createElement("div", "empty-table-scroll");
      const table = createElement("table", "empty-table");
      const caption = createElement(
        "caption",
        "sr-only",
        "Reservas do período",
      );
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      const body = document.createElement("tbody");
      const bodyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");

      ["Reserva", "Data e horário", "Status"].forEach((label) => {
        const heading = document.createElement("th");

        heading.scope = "col";
        heading.textContent = label;
        headRow.append(heading);
      });

      panel.classList.add("state-panel--embedded");
      emptyCell.colSpan = 3;
      emptyCell.append(panel);
      bodyRow.append(emptyCell);
      head.append(headRow);
      body.append(bodyRow);
      table.append(caption, head, body);
      scrollRegion.setAttribute("role", "region");
      scrollRegion.setAttribute("aria-label", "Tabela de reservas");
      scrollRegion.tabIndex = 0;
      scrollRegion.append(table);
      frame.append(
        createStructureHeader("Reservas", "0 registros"),
        scrollRegion,
      );
      return frame;
    }

    function createCalendarEmptyFrame(panel) {
      const frame = createElement(
        "section",
        "content-frame content-frame--calendar",
      );
      const scrollRegion = createElement("div", "empty-calendar-scroll");
      const calendar = createElement("div", "empty-calendar");
      const headers = ["Horário", "Areia 1", "Areia 2", "Coberta"];

      headers.forEach((label) => {
        calendar.append(
          createElement("div", "empty-calendar__header", label),
        );
      });

      panel.classList.add("state-panel--embedded");
      const body = createElement("div", "empty-calendar__body");

      body.append(panel);
      calendar.append(body);
      scrollRegion.setAttribute("role", "region");
      scrollRegion.setAttribute("aria-label", "Agenda das quadras");
      scrollRegion.tabIndex = 0;
      scrollRegion.append(calendar);
      frame.append(
        createStructureHeader("Agenda", "Hoje · 3 quadras"),
        scrollRegion,
      );
      return frame;
    }

    function createDashboardEmptyFrame(panel) {
      const frame = createElement(
        "section",
        "content-frame content-frame--dashboard",
      );
      const dashboard = createElement("div", "empty-dashboard");
      const metrics = createElement("dl", "empty-dashboard__metrics");
      const panels = createElement("div", "empty-dashboard__panels");
      const metricDefinitions = [
        ["Reservas hoje", "0"],
        ["Ocupação", "—"],
        ["Receita prevista", "R$ 0"],
      ];

      metricDefinitions.forEach(([label, value]) => {
        const metric = createElement("div", "empty-dashboard__metric");

        metric.append(
          createElement("dt", "", label),
          createElement("dd", "", value),
        );
        metrics.append(metric);
      });

      panel.classList.add("state-panel--embedded");
      panels.append(panel);
      dashboard.append(metrics, panels);
      frame.append(
        createStructureHeader("Visão geral", "Período atual"),
        dashboard,
      );
      return frame;
    }

    function renderStatePanel(contextName, stateName, isLongCopy, shapeName) {
      const panel = createStatePanel(contextName, stateName, isLongCopy);
      const emptyFrameFactories = {
        cards: createCardsEmptyFrame,
        table: createTableEmptyFrame,
        calendar: createCalendarEmptyFrame,
        dashboard: createDashboardEmptyFrame,
      };
      const content = stateName.startsWith("empty-")
        ? emptyFrameFactories[shapeName](panel)
        : panel;

      stateRegion.setAttribute("aria-labelledby", "state-heading");
      stateRegion.removeAttribute("aria-label");
      stateRegion.removeAttribute("aria-busy");
      stateRegion.replaceChildren(content);
    }

    function renderSelectedState({
      contextName,
      isLongCopy,
      shapeName,
      stateName,
    }) {
      const hidesPrivateShell =
        stateName === "unauthenticated" && contextName !== "public";

      updateShell(hidesPrivateShell ? "public" : contextName);
      demoShell.dataset.selectedContext = contextName;
      pagePrimaryAction.hidden = ![
        "loading-page",
        "loading-action",
        "empty-legitimate",
      ].includes(stateName);

      if (hidesPrivateShell) {
        pageEyebrow.textContent = "Acesso protegido";
        pageTitle.textContent = contexts[contextName].title;
        pageDescription.textContent =
          "O destino solicitado será retomado somente depois de uma autenticação válida.";
        pagePrimaryAction.hidden = true;
      }

      if (stateName === "loading-page") {
        renderPageLoading(shapeName, contextName);
      } else if (stateName === "loading-action") {
        renderActionLoading(contextName);
      } else {
        renderStatePanel(contextName, stateName, isLongCopy, shapeName);
      }

      document.title = `Sandicts — ${contexts[contextName].label} · ${stateLabels[stateName]}`;
    }

    return Object.freeze({ renderSelectedState });
  }

  namespace.createRenderer = createRenderer;
})(window);
