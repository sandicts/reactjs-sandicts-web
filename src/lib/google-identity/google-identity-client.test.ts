import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  GoogleIdentityConfiguration,
  GoogleIdentityServices,
} from "./google-identity.types";
import {
  activateGoogleCredentialFlow,
  ensureGoogleIdentityInitialized,
  registerGoogleCredentialHandler,
  resetGoogleIdentityClientForTests,
} from "./google-identity-client";

const initialize = vi.fn();
const services = {
  accounts: {
    id: {
      cancel: vi.fn(),
      initialize,
      prompt: vi.fn(),
      renderButton: vi.fn(),
    },
  },
} satisfies GoogleIdentityServices;

describe("google identity client", () => {
  beforeEach(() => {
    resetGoogleIdentityClientForTests();
    vi.clearAllMocks();
  });

  it("initializes the shared GIS client only once", () => {
    ensureGoogleIdentityInitialized(services, "client-id");
    ensureGoogleIdentityInitialized(services, "client-id");

    expect(initialize).toHaveBeenCalledOnce();
  });

  it("routes button and One Tap credentials to their active consumers", () => {
    const buttonHandler = vi.fn();
    const oneTapHandler = vi.fn();

    registerGoogleCredentialHandler("button", buttonHandler);
    registerGoogleCredentialHandler("one-tap", oneTapHandler);
    ensureGoogleIdentityInitialized(services, "client-id");

    const callback = readConfiguration().callback;

    activateGoogleCredentialFlow("one-tap");
    callback({ credential: "one-tap-token", select_by: "fedcm" });
    callback({ credential: "button-token", select_by: "btn" });

    expect(oneTapHandler).toHaveBeenCalledWith({
      credential: "one-tap-token",
      select_by: "fedcm",
    });
    expect(buttonHandler).toHaveBeenCalledWith({
      credential: "button-token",
      select_by: "btn",
    });
  });
});

function readConfiguration() {
  const configuration = initialize.mock.calls[0]?.[0];

  if (!configuration) {
    throw new Error("GIS was not initialized.");
  }

  return configuration as GoogleIdentityConfiguration;
}
