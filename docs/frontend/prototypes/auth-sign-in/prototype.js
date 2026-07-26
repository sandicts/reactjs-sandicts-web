(function initializeAuthSignInPrototype(globalScope) {
  const namespace = globalScope.SandictsAuthSignIn;

  if (!namespace?.catalog || !namespace.renderers) {
    throw new Error("Auth sign-in prototype dependencies were not loaded.");
  }

  const { defaultState, groups, states } = namespace.catalog;
  const { renderState } = namespace.renderers;

  const elements = {
    alert: document.querySelector("#auth-alert"),
    alertDescription: document.querySelector("#alert-description"),
    alertIconUse: document.querySelector("#alert-icon use"),
    alertTitle: document.querySelector("#alert-title"),
    authActions: document.querySelector("#auth-actions"),
    authBenefits: document.querySelector("#auth-benefits"),
    authCard: document.querySelector("#auth-card"),
    boundary: document.querySelector("#boundary-state"),
    boundaryActions: document.querySelector("#boundary-actions"),
    boundaryDescription: document.querySelector("#boundary-description"),
    boundaryEyebrow: document.querySelector("#boundary-eyebrow"),
    boundaryIconUse: document.querySelector("#boundary-icon-use"),
    boundaryPrimary: document.querySelector("#boundary-primary"),
    boundaryPrimaryLabel: document.querySelector("#boundary-primary-label"),
    boundarySecondary: document.querySelector("#boundary-secondary"),
    boundarySecondaryLabel: document.querySelector("#boundary-secondary-label"),
    boundaryTitle: document.querySelector("#boundary-title"),
    cardDescription: document.querySelector("#auth-card-description"),
    cardEyebrow: document.querySelector("#auth-card-eyebrow"),
    cardTitle: document.querySelector("#auth-card-title"),
    controls: document.querySelector("#prototype-controls"),
    googleButton: document.querySelector("#google-button"),
    googleButtonLabel: document.querySelector("#google-button-label"),
    googleLoader: document.querySelector(".google-button__loader"),
    googleMark: document.querySelector(".google-mark"),
    headerSignInLink: document.querySelector("#header-sign-in-link"),
    heroDescription: document.querySelector("#hero-description"),
    heroEyebrow: document.querySelector("#hero-eyebrow"),
    heroTitle: document.querySelector("#hero-title"),
    longCopyToggle: document.querySelector("#long-copy-toggle"),
    announcement: document.querySelector("#prototype-announcement"),
    providerLoadingLabel: document.querySelector("#provider-loading-label"),
    providerNote: document.querySelector("#provider-note"),
    providerRegion: document.querySelector("#provider-region"),
    providerSkeleton: document.querySelector("#provider-skeleton"),
    secondaryAction: document.querySelector("#secondary-action"),
    secondaryActionLabel: document.querySelector("#secondary-action-label"),
    shell: document.querySelector("#demo-shell"),
    stateSelector: document.querySelector("#state-selector"),
    status: document.querySelector("#prototype-status"),
  };

  function populateStateSelector() {
    const fragment = document.createDocumentFragment();

    groups.forEach((group) => {
      const optionGroup = document.createElement("optgroup");
      optionGroup.label = group.label;

      group.states.forEach((stateId) => {
        const state = states[stateId];

        if (!state) {
          return;
        }

        const option = document.createElement("option");
        option.value = stateId;
        option.textContent = state.label;
        optionGroup.append(option);
      });

      fragment.append(optionGroup);
    });

    elements.stateSelector.append(fragment);
  }

  function readUrlState() {
    const searchParams = new URLSearchParams(globalScope.location.search);
    const requestedState = searchParams.get("state");

    return {
      longCopy: searchParams.get("long") === "1",
      stateId: states[requestedState] ? requestedState : defaultState,
    };
  }

  function writeUrlState(stateId, longCopy) {
    const url = new URL(globalScope.location.href);
    url.searchParams.set("state", stateId);

    if (longCopy) {
      url.searchParams.set("long", "1");
    } else {
      url.searchParams.delete("long");
    }

    globalScope.history.replaceState(null, "", url);
  }

  function render({ announce = false } = {}) {
    const stateId = elements.stateSelector.value;
    const state = states[stateId] ?? states[defaultState];
    const longCopyEnabled = elements.longCopyToggle.checked;

    renderState(elements, state, longCopyEnabled);
    writeUrlState(stateId, longCopyEnabled);

    if (announce) {
      elements.announcement.textContent = `Estado exibido: ${state.label}.`;
    }
  }

  function selectState(stateId, { focusTarget } = {}) {
    if (!states[stateId]) {
      return;
    }

    elements.stateSelector.value = stateId;
    render({ announce: true });

    if (focusTarget) {
      globalScope.requestAnimationFrame(() => focusTarget.focus());
    }
  }

  function handleDemoAction(action) {
    switch (action) {
      case "sign-in":
        selectState("signing-in", { focusTarget: elements.providerRegion });
        return;
      case "retry-provider":
        selectState("provider-loading", {
          focusTarget: elements.providerRegion,
        });
        return;
      case "retry-session":
        selectState("checking-session", {
          focusTarget: elements.authCard,
        });
        return;
      case "choose-context":
        elements.announcement.textContent =
          "Ação demonstrada: abrir o seletor de contexto aprovado.";
        return;
      case "onboarding":
        elements.announcement.textContent =
          "Ação demonstrada: seguir para o onboarding Player.";
        return;
      case "open-browser":
        elements.announcement.textContent =
          "Ação demonstrada: abrir esta URL no navegador do sistema.";
        return;
      case "back":
      case "home":
        elements.announcement.textContent =
          "Ação demonstrada: navegar para uma área pública segura.";
        return;
      default:
        return;
    }
  }

  populateStateSelector();

  const initialState = readUrlState();
  elements.stateSelector.value = initialState.stateId;
  elements.longCopyToggle.checked = initialState.longCopy;
  render();

  elements.controls.addEventListener("change", () => {
    render({ announce: true });
  });

  elements.shell.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-demo-action]");

    if (!actionTarget) {
      return;
    }

    event.preventDefault();
    handleDemoAction(actionTarget.dataset.demoAction);
  });

  globalScope.addEventListener("popstate", () => {
    const nextState = readUrlState();
    elements.stateSelector.value = nextState.stateId;
    elements.longCopyToggle.checked = nextState.longCopy;
    render({ announce: true });
  });
})(window);
