import type { GoogleIdentityServices } from "./google-identity.types";

const googleIdentityScriptId = "google-identity-services-script";
const googleIdentityScriptUrl = "https://accounts.google.com/gsi/client";

function loadGoogleIdentityScript(): Promise<GoogleIdentityServices> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new Error("Google Identity Services requires a browser environment."),
    );
  }

  const loadedServices = readGoogleIdentityServices();

  if (loadedServices) {
    return Promise.resolve(loadedServices);
  }

  const existingScript = document.getElementById(googleIdentityScriptId);

  if (existingScript && !(existingScript instanceof HTMLScriptElement)) {
    return Promise.reject(
      new Error("The Google Identity Services script host is invalid."),
    );
  }

  const script = existingScript ?? createGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    const handleLoad = () => {
      cleanup();
      script.dataset.loadStatus = "loaded";

      const services = readGoogleIdentityServices();

      if (services) {
        resolve(services);
        return;
      }

      script.remove();
      reject(
        new Error("Google Identity Services did not expose its browser API."),
      );
    };
    const handleError = () => {
      cleanup();
      script.remove();
      reject(new Error("Google Identity Services failed to load."));
    };
    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      document.head.append(script);
    } else if (script.dataset.loadStatus === "loaded") {
      handleLoad();
    }
  });
}

function createGoogleIdentityScript() {
  const script = document.createElement("script");

  script.async = true;
  script.id = googleIdentityScriptId;
  script.src = googleIdentityScriptUrl;
  script.dataset.loadStatus = "loading";

  return script;
}

function readGoogleIdentityServices() {
  const services = window.google;

  if (
    typeof services?.accounts?.id?.initialize !== "function" ||
    typeof services.accounts.id.renderButton !== "function"
  ) {
    return null;
  }

  return services;
}

export {
  googleIdentityScriptId,
  googleIdentityScriptUrl,
  loadGoogleIdentityScript,
};
