(function registerMagicLinkPrototypeRenderers(globalScope) {
  "use strict";

  const namespace =
    globalScope.sandictsMagicLinkPrototype ??
    (globalScope.sandictsMagicLinkPrototype = {});

  function setText(element, value) {
    element.textContent = value ?? "";
  }

  function withLongCopy(value, state, longCopyEnabled) {
    if (!longCopyEnabled || !state.longCopy) {
      return value;
    }

    return `${value} ${state.longCopy}`;
  }

  function renderHero(elements, state, longCopyEnabled) {
    setText(elements.heroEyebrow, state.hero.eyebrow);
    setText(elements.heroTitle, state.hero.title);
    setText(
      elements.heroDescription,
      withLongCopy(state.hero.description, state, longCopyEnabled),
    );
  }

  function renderAlert(elements, alert) {
    elements.alert.hidden = !alert;

    if (!alert) {
      return;
    }

    elements.alert.dataset.tone = alert.tone;
    elements.alertIconUse.setAttribute("href", `#icon-${alert.icon}`);
    setText(elements.alertTitle, alert.title);
    setText(elements.alertDescription, alert.description);
  }

  function renderCardHeader(elements, state, longCopyEnabled) {
    setText(elements.cardEyebrow, state.card.eyebrow);
    setText(elements.cardTitle, state.card.title);
    setText(
      elements.cardDescription,
      withLongCopy(state.card.description, state, longCopyEnabled),
    );
  }

  function renderEntry(elements, state, longCopyEnabled) {
    const form = state.form;

    elements.authCard.hidden = false;
    elements.boundary.hidden = true;
    elements.methodStack.hidden = false;
    elements.sentPanel.hidden = true;
    elements.authCard.setAttribute("aria-busy", String(form.busy));

    renderCardHeader(elements, state, longCopyEnabled);

    elements.emailInput.disabled = form.busy;
    elements.emailInput.setAttribute("aria-invalid", String(form.invalid));
    elements.emailError.hidden = !form.invalid;
    elements.emailSubmit.disabled = form.busy;
    elements.emailSubmitLoader.hidden = !form.busy;
    elements.googleButton.disabled = form.googleDisabled;
    setText(elements.emailSubmitLabel, form.submitLabel);
  }

  function renderSent(elements, state, longCopyEnabled) {
    const sent = state.sent;

    elements.authCard.hidden = false;
    elements.boundary.hidden = true;
    elements.methodStack.hidden = true;
    elements.sentPanel.hidden = false;
    elements.authCard.setAttribute("aria-busy", String(sent.busy));

    renderCardHeader(elements, state, longCopyEnabled);

    setText(elements.sentStatus, sent.status);
    setText(elements.resendActionLabel, sent.resendLabel);
    elements.resendAction.disabled = sent.resendDisabled;
    elements.resendActionLoader.hidden = !sent.busy;
    elements.changeEmailAction.disabled = sent.busy;
  }

  function configureAction(button, label, action) {
    delete button.dataset.demoState;
    delete button.dataset.demoAction;

    button.hidden = !action;

    if (!action) {
      return;
    }

    setText(label, action.label);

    if (action.target) {
      button.dataset.demoState = action.target;
    }

    if (action.action) {
      button.dataset.demoAction = action.action;
    }
  }

  function renderBoundary(elements, state, longCopyEnabled) {
    const boundary = state.boundary;

    elements.authCard.hidden = true;
    elements.boundary.hidden = false;
    elements.boundary.dataset.tone = boundary.tone;
    elements.boundary.classList.toggle("is-busy", boundary.busy);
    elements.boundary.setAttribute("aria-busy", String(boundary.busy));
    elements.boundaryIconUse.setAttribute("href", `#icon-${boundary.icon}`);

    setText(elements.boundaryEyebrow, boundary.eyebrow);
    setText(elements.boundaryTitle, boundary.title);
    setText(
      elements.boundaryDescription,
      withLongCopy(boundary.description, state, longCopyEnabled),
    );
    setText(elements.boundaryStatus, boundary.status);

    configureAction(
      elements.boundaryPrimary,
      elements.boundaryPrimaryLabel,
      boundary.primary,
    );
    configureAction(
      elements.boundarySecondary,
      elements.boundarySecondaryLabel,
      boundary.secondary,
    );
    elements.boundaryActions.hidden =
      !boundary.primary && !boundary.secondary;
  }

  function renderState(elements, state, longCopyEnabled) {
    renderHero(elements, state, longCopyEnabled);
    renderAlert(elements, state.alert);

    const isBoundary = state.presentation === "boundary";
    elements.shell.dataset.mode = isBoundary ? "boundary" : "auth";
    elements.authBenefits.hidden = isBoundary;
    elements.headerSignInLink.hidden = isBoundary;

    if (state.presentation === "entry") {
      renderEntry(elements, state, longCopyEnabled);
    } else if (state.presentation === "sent") {
      renderSent(elements, state, longCopyEnabled);
    } else {
      renderBoundary(elements, state, longCopyEnabled);
    }

    setText(elements.status, `${state.group} · ${state.label}`);
  }

  namespace.renderers = Object.freeze({
    renderState,
  });
})(window);
