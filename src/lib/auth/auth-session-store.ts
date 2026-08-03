import type { AuthSessionSnapshot } from "./auth-session.types";

let currentAuthSession: AuthSessionSnapshot | null = null;

function clearAuthSession() {
  currentAuthSession = null;
}

function getAuthAccessToken() {
  return currentAuthSession?.accessToken ?? null;
}

function getAuthSession() {
  return currentAuthSession;
}

function setAuthSession(authSession: AuthSessionSnapshot) {
  currentAuthSession = authSession;
}

export { clearAuthSession, getAuthAccessToken, getAuthSession, setAuthSession };
