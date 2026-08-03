(function initializeGlobalStatesPrototype(globalScope) {
  const namespace = globalScope.SandictsGlobalStates;
  const { contexts, stateLabels } = namespace.catalog;
  const elements = {
    adaptiveNavigation: document.querySelector("#adaptive-navigation"),
    announcement: document.querySelector("#prototype-announcement"),
    bottomNavigation: document.querySelector("#bottom-navigation"),
    contextChip: document.querySelector("#context-chip"),
    contextEyebrow: document.querySelector("#context-eyebrow"),
    contextSelector: document.querySelector("#context-selector"),
    contextTitle: document.querySelector("#context-title"),
    demoShell: document.querySelector("#demo-shell"),
    drawerNavigation: document.querySelector("#drawer-navigation"),
    longCopyToggle: document.querySelector("#long-copy-toggle"),
    organizationDrawer: document.querySelector("#organization-drawer"),
    organizationMenuClose: document.querySelector("#organization-menu-close"),
    organizationMenuTrigger: document.querySelector(
      "#organization-menu-trigger",
    ),
    pageDescription: document.querySelector("#page-description"),
    pageEyebrow: document.querySelector("#page-eyebrow"),
    pagePrimaryAction: document.querySelector("#page-primary-action"),
    pageTitle: document.querySelector("#page-title"),
    shapeSelector: document.querySelector("#shape-selector"),
    stateRegion: document.querySelector("#state-region"),
    stateSelector: document.querySelector("#state-selector"),
  };
  const {
    announcement,
    contextSelector,
    longCopyToggle,
    organizationDrawer,
    organizationMenuClose,
    organizationMenuTrigger,
    pagePrimaryAction,
    shapeSelector,
    stateRegion,
    stateSelector,
  } = elements;
  const renderer = namespace.createRenderer(elements);

  function renderSelectedState() {
    const contextName = contextSelector.value;
    const stateName = stateSelector.value;
    const isShapeAware =
      stateName === "loading-page" || stateName.startsWith("empty-");

    shapeSelector.disabled = !isShapeAware;
    longCopyToggle.disabled = [
      "loading-page",
      "loading-action",
    ].includes(stateName);
    renderer.renderSelectedState({
      contextName,
      isLongCopy: longCopyToggle.checked,
      shapeName: shapeSelector.value,
      stateName,
    });
  }

  function writeUrl(mode = "pushState") {
    const url = new URL(window.location.href);

    url.searchParams.set("context", contextSelector.value);
    url.searchParams.set("state", stateSelector.value);
    url.searchParams.set("shape", shapeSelector.value);

    if (longCopyToggle.checked) {
      url.searchParams.set("long", "1");
    } else {
      url.searchParams.delete("long");
    }

    window.history[mode]({}, "", url);
  }

  function readUrl() {
    const url = new URL(window.location.href);
    const context = url.searchParams.get("context");
    const state = url.searchParams.get("state");
    const shape = url.searchParams.get("shape");

    if (context && Object.hasOwn(contexts, context)) {
      contextSelector.value = context;
    }

    if (state && Object.hasOwn(stateLabels, state)) {
      stateSelector.value = state;
    }

    if (
      shape &&
      ["cards", "table", "calendar", "dashboard"].includes(shape)
    ) {
      shapeSelector.value = shape;
    } else {
      shapeSelector.value = contexts[contextSelector.value].defaultShape;
    }

    longCopyToggle.checked = url.searchParams.get("long") === "1";
  }

  function announceSelection(message) {
    announcement.textContent =
      message ??
      `${contexts[contextSelector.value].label}: ${
        stateLabels[stateSelector.value]
      }.`;
  }

  function closeOrganizationDrawer() {
    if (!organizationDrawer.open) {
      return;
    }

    organizationDrawer.close();
    organizationMenuTrigger.focus();
  }

  function updatePrototype({
    historyMode = "pushState",
    announce = true,
  } = {}) {
    renderSelectedState();
    writeUrl(historyMode);

    if (announce) {
      announceSelection();
    }
  }

  contextSelector.addEventListener("change", () => {
    shapeSelector.value = contexts[contextSelector.value].defaultShape;
    updatePrototype();
  });

  stateSelector.addEventListener("change", () => {
    updatePrototype();
  });

  shapeSelector.addEventListener("change", () => {
    updatePrototype();
  });

  longCopyToggle.addEventListener("change", () => {
    updatePrototype();
  });

  stateRegion.addEventListener("click", (event) => {
    const action = event.target.closest("[data-demo-action]");

    if (!action) {
      return;
    }

    if (action.dataset.demoAction === "retry") {
      stateSelector.value = "loading-page";
      updatePrototype();
      announceSelection("Nova leitura iniciada. O conteúdo está carregando.");
      return;
    }

    if (action.dataset.demoAction === "reset-filters") {
      stateSelector.value = "empty-legitimate";
      updatePrototype();
      announceSelection("Filtros removidos. A lista completa está vazia.");
      return;
    }

    announceSelection(
      `Ação demonstrada: ${action.textContent.trim()}. O protótipo não navega.`,
    );
  });

  pagePrimaryAction.addEventListener("click", () => {
    announceSelection(
      `Ação de página demonstrada: ${pagePrimaryAction.textContent.trim()}.`,
    );
  });

  organizationMenuTrigger.addEventListener("click", () => {
    organizationDrawer.showModal();
  });

  organizationMenuClose.addEventListener("click", () => {
    closeOrganizationDrawer();
  });

  organizationDrawer.addEventListener("click", (event) => {
    if (event.target === organizationDrawer) {
      closeOrganizationDrawer();
    }
  });

  organizationDrawer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeOrganizationDrawer();
  });

  organizationDrawer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeOrganizationDrawer();
    }
  });

  window.addEventListener("popstate", () => {
    readUrl();
    renderSelectedState();
    announceSelection("Cenário restaurado pelo histórico do navegador.");
  });

  readUrl();
  renderSelectedState();
  writeUrl("replaceState");
})(window);
