import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAuthAccessToken,
  getAuthSessionLifecycle,
  hasEstablishedAuthSession,
  markAuthSessionExpired,
  markAuthSessionRecoverableError,
  resetAuthSessionRuntime,
  setAuthSession,
  subscribeToAuthSession,
} from "./auth-session-store";

const authSession = {
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: { id: "session-id" },
  accessToken: "access-token",
  accessTokenExpiresAt: "2026-08-04T18:00:00.000Z",
};

describe("auth session store", () => {
  afterEach(resetAuthSessionRuntime);

  it("keeps credentials private while publishing the authenticated projection", () => {
    setAuthSession(authSession);

    expect(getAuthAccessToken()).toBe("access-token");
    expect(getAuthSessionLifecycle()).toEqual({
      status: "authenticated",
      account: authSession.account,
      session: authSession.session,
    });
    expect(getAuthSessionLifecycle()).not.toHaveProperty("accessToken");
    expect(hasEstablishedAuthSession()).toBe(true);
  });

  it("preserves runtime history after an expiry or recoverable failure", () => {
    setAuthSession(authSession);
    markAuthSessionExpired();

    expect(getAuthSessionLifecycle()).toEqual({ status: "expired" });
    expect(hasEstablishedAuthSession()).toBe(true);

    markAuthSessionRecoverableError("network");

    expect(getAuthSessionLifecycle()).toEqual({
      status: "recoverable-error",
      reason: "network",
    });
    expect(hasEstablishedAuthSession()).toBe(true);
  });

  it("notifies subscribers for lifecycle transitions", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToAuthSession(listener);

    setAuthSession(authSession);
    markAuthSessionExpired();
    unsubscribe();
    resetAuthSessionRuntime();

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
