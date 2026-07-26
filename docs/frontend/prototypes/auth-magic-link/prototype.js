(function initializeMagicLinkPrototype(globalScope) {
  "use strict";

  const namespace = globalScope.sandictsMagicLinkPrototype;

  if (!namespace?.catalog || !namespace.renderers) {
    throw new Error("Magic-link prototype dependencies were not loaded.");
  }

  const { defaultState, groups, states } = namespace.catalog;
  let pendingTransition;

  const elements = {
    alert: document.querySelector("#auth-alert"),
    alertDescription: document.querySelector("#alert-description"),
    alertIconUse: document.querySelector("#alert-icon-use"),
    alertTitle: document.querySelector("#alert-title"),
    announcement: document.querySelector("#prototype-announcement"),
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
    boundaryStatus: document.querySelector("#boundary-status"),
    boundaryTitle: document.querySelector("#boundary-title"),
    cardDescription: document.querySelector("#auth-card-description"),
    cardEyebrow: document.querySelector("#auth-card-eyebrow"),
    cardTitle: document.querySelector("#auth-card-title"),
    changeEmailAction: document.querySelector("#change-email-action"),
    emailError: document.querySelector("#email-error"),
    emailForm: document.querySelector("#email-form"),
    emailInput: document.querySelector("#email-input"),
    emailSubmit: document.querySelector("#email-submit"),
    emailSubmitLabel: document.querySelector("#email-submit-label"),
    emailSubmitLoader: document.querySelector("#email-submit-loader"),
    googleButton: document.querySelector("#google-button"),
    headerSignInLink: document.querySelector("#header-sign-in-link"),
    heroDescription: document.querySelector("#hero-description"),
    heroEyebrow: document.querySelector("#hero-eyebrow"),
    heroTitle: document.querySelector("#hero-title"),
    longCopyToggle: document.querySelector("#long-copy-toggle"),
    methodStack: document.querySelector("#method-stack"),
    resendAction: document.querySelector("#resend-action"),
    resendActionLabel: document.querySelector("#resend-action-label"),
    resendActionLoader: document.querySelector("#resend-action-loader"),
    sentPanel: document.querySelector("#sent-panel"),
    sentStatus: document.querySelector("#sent-status"),
    shell: document.querySelector("#demo-shell"),
    stateSelector: document.querySelector("#state-selector"),
    status: document.querySelector("#prototype-status"),
  };

  function populateStateSelector() {
    const fragment = document.createDocumentFragment();

    groups.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;

      group.states.forEach((stateId) => {
        const state = states[stateId];

        if (!state) {
          return;
        }

        const option = document.createElement("option");
        option.value = stateId;
        option.textContent = state.label;
        optgroup.append(option);
      });

      fragment.append(optgroup);
    });

    elements.stateSelector.append(fragment);
  }

  function readUrlState() {
    const searchParams = new URLSearchParams(globalScope.location.search);
    const requestedState = searchParams.get("state");

    return {
      stateId: states[requestedState] ? requestedState : defaultState,
      longCopy: searchParams.get("long") === "1",
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

    globalScope.history.replaceState({}, "", url);
  }

  function cancelPendingTransition() {
    if (pendingTransition) {
      globalScope.clearTimeout(pendingTransition);
      pendingTransition = undefined;
    }
  }

  function render({ announce = false, focus = false } = {}) {
    const stateId = elements.stateSelector.value;
    const state = states[stateId] ?? states[defaultState];
    const longCopyEnabled = elements.longCopyToggle.checked;

    namespace.renderers.renderState(elements, state, longCopyEnabled);
    writeUrlState(stateId, longCopyEnabled);

    if (announce) {
      elements.announcement.textContent = `Estado exibido: ${state.label}.`;
    }

    if (focus) {
      const focusTarget =
        state.presentation === "boundary"
          ? elements.boundary
          : state.presentation === "entry"
            ? elements.emailInput
            : elements.authCard;
      focusTarget.focus();
    }
  }

  function selectState(
    stateId,
    { announce = true, focus = false, preserveTransition = false } = {},
  ) {
    if (!states[stateId]) {
      return;
    }

    if (!preserveTransition) {
      cancelPendingTransition();
    }

    elements.stateSelector.value = stateId;
    render({ announce, focus });
  }

  function scheduleState(stateId, delayMilliseconds, focus = true) {
    cancelPendingTransition();
    pendingTransition = globalScope.setTimeout(() => {
      pendingTransition = undefined;
      selectState(stateId, {
        announce: true,
        focus,
        preserveTransition: true,
      });
    }, delayMilliseconds);
  }

  function simulateRequest() {
    selectState("requesting", { announce: true });
    scheduleState("sent-cooldown", 700);
  }

  function simulateResend() {
    selectState("resending", { announce: true });
    scheduleState("sent-cooldown", 700);
  }

  function simulateConsumeRetry() {
    selectState("verifying", { announce: true });
    scheduleState("routing", 850);
  }

  function handlePrototypeAction(action) {
    switch (action) {
      case "resend":
        simulateResend();
        break;
      case "retry-request":
        simulateRequest();
        break;
      case "retry-consume":
        simulateConsumeRetry();
        break;
      default:
        break;
    }
  }

  populateStateSelector();

  const initialState = readUrlState();
  elements.stateSelector.value = initialState.stateId;
  elements.longCopyToggle.checked = initialState.longCopy;
  render();

  elements.stateSelector.addEventListener("change", () => {
    cancelPendingTransition();
    render({ announce: true });
  });

  elements.longCopyToggle.addEventListener("change", () => {
    render({ announce: true });
  });

  elements.emailForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!elements.emailInput.checkValidity()) {
      selectState("email-invalid", { announce: true });
      elements.emailInput.focus();
      return;
    }

    simulateRequest();
  });

  elements.emailInput.addEventListener("input", () => {
    if (
      elements.stateSelector.value === "email-invalid" &&
      elements.emailInput.checkValidity()
    ) {
      selectState("email-entry", { announce: false });
      elements.emailInput.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const stateTarget = event.target.closest("[data-demo-state]");

    if (stateTarget?.dataset.demoState) {
      selectState(stateTarget.dataset.demoState, {
        announce: true,
        focus: true,
      });
      return;
    }

    const actionTarget = event.target.closest("[data-demo-action]");

    if (actionTarget?.dataset.demoAction) {
      handlePrototypeAction(actionTarget.dataset.demoAction);
    }
  });

  globalScope.addEventListener("popstate", () => {
    cancelPendingTransition();
    const nextState = readUrlState();
    elements.stateSelector.value = nextState.stateId;
    elements.longCopyToggle.checked = nextState.longCopy;
    render({ announce: true });
  });
})(window);
