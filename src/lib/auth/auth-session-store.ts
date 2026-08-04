import { toAuthSessionProjection } from "./auth-session.adapters";
import type {
  AuthSessionLifecycle,
  AuthSessionSnapshot,
} from "./auth-session.types";

let currentAuthSession: AuthSessionSnapshot | null = null;
let establishedAuthSessionInRuntime = false;
let currentAuthSessionLifecycle: AuthSessionLifecycle = { status: "checking" };
const authSessionListeners = new Set<() => void>();

function clearAuthSession() {
  currentAuthSession = null;
  establishedAuthSessionInRuntime = false;
  publishAuthSessionLifecycle({ status: "unauthenticated" });
}

function getAuthAccessToken() {
  return currentAuthSession?.accessToken ?? null;
}

function getAuthSession() {
  return currentAuthSession;
}

function getAuthSessionLifecycle() {
  return currentAuthSessionLifecycle;
}

function hasEstablishedAuthSession() {
  return establishedAuthSessionInRuntime;
}

function markAuthSessionApiUnavailable(
  reason: Extract<
    AuthSessionLifecycle,
    { status: "api-unavailable" }
  >["reason"],
) {
  currentAuthSession = null;
  publishAuthSessionLifecycle({ status: "api-unavailable", reason });
}

function markAuthSessionChecking() {
  publishAuthSessionLifecycle({ status: "checking" });
}

function markAuthSessionExpired() {
  currentAuthSession = null;
  publishAuthSessionLifecycle({ status: "expired" });
}

function markAuthSessionForbidden() {
  currentAuthSession = null;
  publishAuthSessionLifecycle({ status: "forbidden" });
}

function markAuthSessionRecoverableError(
  reason: Extract<
    AuthSessionLifecycle,
    { status: "recoverable-error" }
  >["reason"],
) {
  currentAuthSession = null;
  publishAuthSessionLifecycle({ status: "recoverable-error", reason });
}

function markAuthSessionUnauthenticated() {
  currentAuthSession = null;
  publishAuthSessionLifecycle({ status: "unauthenticated" });
}

function resetAuthSessionRuntime() {
  currentAuthSession = null;
  establishedAuthSessionInRuntime = false;
  publishAuthSessionLifecycle({ status: "checking" });
}

function setAuthSession(authSession: AuthSessionSnapshot) {
  currentAuthSession = authSession;
  establishedAuthSessionInRuntime = true;
  publishAuthSessionLifecycle({
    status: "authenticated",
    ...toAuthSessionProjection(authSession),
  });
}

function subscribeToAuthSession(listener: () => void) {
  authSessionListeners.add(listener);

  return () => {
    authSessionListeners.delete(listener);
  };
}

function publishAuthSessionLifecycle(lifecycle: AuthSessionLifecycle) {
  currentAuthSessionLifecycle = lifecycle;

  authSessionListeners.forEach((listener) => listener());
}

export {
  clearAuthSession,
  getAuthAccessToken,
  getAuthSession,
  getAuthSessionLifecycle,
  hasEstablishedAuthSession,
  markAuthSessionApiUnavailable,
  markAuthSessionChecking,
  markAuthSessionExpired,
  markAuthSessionForbidden,
  markAuthSessionRecoverableError,
  markAuthSessionUnauthenticated,
  resetAuthSessionRuntime,
  setAuthSession,
  subscribeToAuthSession,
};
