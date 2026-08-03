const shellSelector = document.querySelector("#shell-selector");
const stateSelector = document.querySelector("#state-selector");
const contextSelector = document.querySelector("#context-selector");
const focusExample = document.querySelector("#focus-example");
const contextDialog = document.querySelector("#context-dialog");
const organizationDrawer = document.querySelector("#organization-drawer");
const organizationMenuTrigger = document.querySelector(
  "#organization-menu-trigger",
);
const organizationMenuClose = document.querySelector(
  "#organization-menu-close",
);

function setShell(shellName) {
  document.querySelectorAll("[data-shell]").forEach((shell) => {
    shell.hidden = shell.dataset.shell !== shellName;
  });

  document.title = `Sandicts — Shell ${shellName}`;
}

function setState(stateName) {
  document.documentElement.dataset.demoState = stateName;

  document.querySelectorAll("[data-when-state]").forEach((state) => {
    state.hidden = state.dataset.whenState !== stateName;
  });
}

function setContextMode(contextMode) {
  document.documentElement.dataset.contextMode = contextMode;

  if (contextMode === "single" && contextDialog.open) {
    contextDialog.close();
  }
}

function selectDestination(target) {
  const destination = target.dataset.destination;
  const shell = target.closest("[data-shell]") ?? organizationDrawer;

  shell
    .querySelectorAll("[data-destination]")
    .forEach((link) => link.removeAttribute("aria-current"));

  shell
    .querySelectorAll(`[data-destination="${destination}"]`)
    .forEach((link) => link.setAttribute("aria-current", "page"));
}

shellSelector.addEventListener("change", (event) => {
  setShell(event.target.value);
});

stateSelector.addEventListener("change", (event) => {
  setState(event.target.value);
});

contextSelector.addEventListener("change", (event) => {
  setContextMode(event.target.value);
});

focusExample.addEventListener("click", () => {
  shellSelector.value = "organization";
  stateSelector.value = "ready";
  setShell("organization");
  setState("ready");

  requestAnimationFrame(() => {
    const target = document.querySelector("#primary-focus-target");
    const previousTarget = document.querySelector(".is-focus-demo");

    previousTarget?.classList.remove("is-focus-demo");
    target?.classList.add("is-focus-demo");
    target?.focus();
    target?.addEventListener(
      "blur",
      () => target.classList.remove("is-focus-demo"),
      { once: true },
    );
  });
});

document.querySelectorAll("[data-context-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    contextDialog.showModal();
  });
});

document.querySelectorAll("[data-destination]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectDestination(event.currentTarget);

    if (organizationDrawer.open) {
      organizationDrawer.close();
    }
  });
});

organizationMenuTrigger.addEventListener("click", () => {
  organizationDrawer.showModal();
});

organizationMenuClose.addEventListener("click", () => {
  organizationDrawer.close();
});

contextDialog.addEventListener("click", (event) => {
  if (event.target === contextDialog) {
    contextDialog.close();
  }
});

organizationDrawer.addEventListener("click", (event) => {
  if (event.target === organizationDrawer) {
    organizationDrawer.close();
  }
});

setShell(shellSelector.value);
setState(stateSelector.value);
setContextMode(contextSelector.value);
