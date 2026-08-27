import type {
  GoogleCredentialResponse,
  GoogleIdentityServices,
} from "./google-identity.types";

type GoogleCredentialFlow = "button" | "one-tap";
type GoogleCredentialHandler = (response: GoogleCredentialResponse) => void;

let activeCredentialFlow: GoogleCredentialFlow | null = null;
let initializedClientId: string | null = null;
let initializedServices: GoogleIdentityServices | null = null;
const credentialHandlers = new Map<
  GoogleCredentialFlow,
  GoogleCredentialHandler
>();

function ensureGoogleIdentityInitialized(
  services: GoogleIdentityServices,
  clientId: string,
) {
  if (initializedServices === services && initializedClientId === clientId) {
    return;
  }

  services.accounts.id.initialize({
    auto_select: false,
    callback: dispatchGoogleCredential,
    client_id: clientId,
    ux_mode: "popup",
  });

  initializedClientId = clientId;
  initializedServices = services;
}

function registerGoogleCredentialHandler(
  flow: GoogleCredentialFlow,
  handler: GoogleCredentialHandler,
) {
  credentialHandlers.set(flow, handler);

  return () => {
    if (credentialHandlers.get(flow) === handler) {
      credentialHandlers.delete(flow);
    }
  };
}

function activateGoogleCredentialFlow(flow: GoogleCredentialFlow) {
  activeCredentialFlow = flow;
}

function dispatchGoogleCredential(response: GoogleCredentialResponse) {
  const preferredFlow =
    response.select_by === "btn"
      ? "button"
      : (activeCredentialFlow ?? "one-tap");
  const handler =
    credentialHandlers.get(preferredFlow) ??
    credentialHandlers.get("button") ??
    credentialHandlers.get("one-tap");

  handler?.(response);
}

function resetGoogleIdentityClientForTests() {
  activeCredentialFlow = null;
  initializedClientId = null;
  initializedServices = null;
  credentialHandlers.clear();
}

export {
  activateGoogleCredentialFlow,
  ensureGoogleIdentityInitialized,
  registerGoogleCredentialHandler,
  resetGoogleIdentityClientForTests,
};
export type { GoogleCredentialFlow, GoogleCredentialHandler };
