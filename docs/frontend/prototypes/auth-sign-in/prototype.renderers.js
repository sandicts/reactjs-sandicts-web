(function registerAuthSignInRenderers(globalScope) {
  const iconHref = Object.freeze({
    "alert-triangle": "#icon-alert-triangle",
    clock: "#icon-clock",
    "external-link": "#icon-external-link",
    info: "#icon-info",
    loader: "#icon-loader",
    route: "#icon-route",
    "shield-x": "#icon-shield-x",
    "user-round": "#icon-user-round",
    users: "#icon-users",
    "wifi-off": "#icon-wifi-off",
  });

  function appendLongCopy(description, state, longCopyEnabled) {
    if (!longCopyEnabled || !state.longCopy) {
      return description;
    }

    return `${description} ${state.longCopy}`;
  }

  function setText(element, value) {
    element.textContent = value ?? "";
  }

  function setAction(button, action) {
    button.dataset.demoAction = action ?? "none";
  }

  function renderHero(elements, state, longCopyEnabled) {
    setText(elements.heroEyebrow, state.hero.eyebrow);
    setText(elements.heroTitle, state.hero.title);
    setText(
      elements.heroDescription,
      appendLongCopy(state.hero.description, state, longCopyEnabled),
    );
  }

  function renderAlert(elements, state) {
    const alert = state.alert;
    elements.alert.hidden = !alert;

    if (!alert) {
      elements.alert.removeAttribute("role");
      return;
    }

    elements.alert.dataset.tone = alert.tone;
    elements.alertIconUse.setAttribute(
      "href",
      iconHref[alert.icon] ?? iconHref.info,
    );
    setText(elements.alertTitle, alert.title);
    setText(elements.alertDescription, alert.description);
  }

  function renderProvider(elements, provider) {
    const isSkeleton = provider?.kind === "skeleton";
    const hasButton = Boolean(provider && !isSkeleton);

    elements.providerSkeleton.hidden = !isSkeleton;
    elements.googleButton.hidden = !hasButton;
    elements.providerRegion.toggleAttribute(
      "aria-busy",
      Boolean(isSkeleton || provider?.pending),
    );

    if (isSkeleton) {
      setText(elements.providerLoadingLabel, provider.label);
      return;
    }

    if (!hasButton) {
      return;
    }

    const isGoogle = provider.kind === "google";
    elements.googleButton.className = isGoogle
      ? "google-button"
      : "button button--primary auth-primary-action";
    elements.googleMark.hidden = !isGoogle;
    elements.googleLoader.hidden = !provider.pending;
    elements.googleButton.disabled = Boolean(provider.pending);
    elements.googleButton.toggleAttribute("aria-busy", Boolean(provider.pending));
    setText(elements.googleButtonLabel, provider.label);
    setAction(elements.googleButton, provider.action);
  }

  function renderSecondaryAction(elements, secondary) {
    elements.authActions.hidden = !secondary;
    elements.secondaryAction.hidden = !secondary;

    if (!secondary) {
      return;
    }

    setText(elements.secondaryActionLabel, secondary.label);
    setAction(elements.secondaryAction, secondary.action);
  }

  function renderAuth(elements, state, longCopyEnabled) {
    elements.authCard.hidden = false;
    elements.boundary.hidden = true;

    setText(elements.cardEyebrow, state.card.eyebrow);
    setText(elements.cardTitle, state.card.title);
    setText(
      elements.cardDescription,
      appendLongCopy(state.card.description, state, longCopyEnabled),
    );
    setText(elements.providerNote, state.helper ?? "");
    elements.providerNote.hidden = !state.helper;

    renderProvider(elements, state.provider);
    renderSecondaryAction(elements, state.secondary);
  }

  function renderBoundaryAction(button, labelElement, action) {
    button.hidden = !action;

    if (!action) {
      return;
    }

    setText(labelElement, action.label);
    setAction(button, action.action);
  }

  function renderBoundary(elements, state, longCopyEnabled) {
    const boundary = state.boundary;
    elements.authCard.hidden = true;
    elements.boundary.hidden = false;
    elements.boundary.dataset.tone = boundary.tone;
    elements.boundaryIconUse.setAttribute(
      "href",
      iconHref[boundary.icon] ?? iconHref.info,
    );
    setText(elements.boundaryEyebrow, boundary.eyebrow);
    setText(elements.boundaryTitle, boundary.title);
    setText(
      elements.boundaryDescription,
      appendLongCopy(boundary.description, state, longCopyEnabled),
    );

    renderBoundaryAction(
      elements.boundaryPrimary,
      elements.boundaryPrimaryLabel,
      boundary.primary,
    );
    renderBoundaryAction(
      elements.boundarySecondary,
      elements.boundarySecondaryLabel,
      boundary.secondary,
    );

    const hasActions = Boolean(boundary.primary || boundary.secondary);
    elements.boundaryActions.hidden = !hasActions;
    elements.boundary.toggleAttribute("aria-busy", Boolean(boundary.pending));
  }

  function renderState(elements, state, longCopyEnabled) {
    elements.shell.dataset.mode = state.mode;
    elements.authBenefits.hidden = state.mode !== "auth";
    elements.headerSignInLink.hidden = state.mode !== "auth";
    renderHero(elements, state, longCopyEnabled);
    renderAlert(elements, state);

    if (state.mode === "auth") {
      renderAuth(elements, state, longCopyEnabled);
    } else {
      renderBoundary(elements, state, longCopyEnabled);
    }

    setText(elements.status, `${state.group} · ${state.label}`);
  }

  const namespace = globalScope.SandictsAuthSignIn ?? {};
  namespace.renderers = Object.freeze({
    renderState,
  });
  globalScope.SandictsAuthSignIn = namespace;
})(window);
