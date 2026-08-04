"use client";

import type {
  GoogleSignInResponseOutput,
  RefreshAuthSessionResponseOutput,
} from "@/lib/api/generated/sandicts-api/model";
import {
  clearAuthSession,
  setAuthSession,
} from "@/lib/auth/auth-session-store";

function clearPersistedAuthSession() {
  clearAuthSession();
}

function persistGoogleSignInSession(authSession: GoogleSignInResponseOutput) {
  setAuthSession(authSession);
}

function persistRefreshAuthSession(
  authSession: RefreshAuthSessionResponseOutput,
) {
  setAuthSession(authSession);
}

export {
  clearPersistedAuthSession,
  persistGoogleSignInSession,
  persistRefreshAuthSession,
};
