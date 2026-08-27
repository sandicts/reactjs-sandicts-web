/**
 * @vitest-environment jsdom
 */

import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthSessionLifecycle } from "@/lib/auth/auth-session.types";
import type {
  GoogleCredentialResponse,
  GoogleIdentityServices,
} from "@/lib/google-identity/google-identity.types";
import { GoogleOneTapHost } from "./google-one-tap-host";

const pathnameMock = vi.hoisted(() => ({ value: "/" }));
const authSessionMock = vi.hoisted(() => ({
  lifecycle: { status: "unauthenticated" } as AuthSessionLifecycle,
}));
const publicEnvMock = vi.hoisted(() => ({
  authEnabled: true,
  googleClientId: "local-client-id.apps.googleusercontent.com" as string | null,
  googleOneTapEnabled: true,
}));
const googleSignInMock = vi.hoisted(() => ({ mutate: vi.fn() }));
const platformSupportedMock = vi.hoisted(() => vi.fn(() => true));
const loadGoogleIdentityScriptMock = vi.hoisted(() => vi.fn());
const identityClientMock = vi.hoisted(() => ({
  activate: vi.fn(),
  ensureInitialized: vi.fn(),
  registerHandler: vi.fn(),
  unregisterHandler: vi.fn(),
}));
const storageMock = vi.hoisted(() => ({
  clear: vi.fn(),
  hasAttempted: vi.fn(() => false),
  hasSuppression: vi.fn(() => false),
  markAttempted: vi.fn(),
  suppress: vi.fn(),
}));
const googleIdentityMock = vi.hoisted(() => ({
  cancel: vi.fn(),
  initialize: vi.fn(),
  prompt: vi.fn(),
  renderButton: vi.fn(),
}));

let credentialHandler: ((response: GoogleCredentialResponse) => void) | null =
  null;

vi.mock("next/navigation", () => ({ usePathname: () => pathnameMock.value }));
vi.mock("@/lib/auth/auth-session-provider", () => ({
  useAuthSession: () => authSessionMock,
}));
vi.mock("@/lib/env/public-env", () => ({ publicEnv: publicEnvMock }));
vi.mock("@/features/auth/hooks/use-google-sign-in", () => ({
  useGoogleSignIn: () => googleSignInMock,
}));
vi.mock("./google-one-tap-platform", () => ({
  isGoogleOneTapPlatformSupported: platformSupportedMock,
}));
vi.mock("@/lib/google-identity/google-identity-script", () => ({
  loadGoogleIdentityScript: loadGoogleIdentityScriptMock,
}));
vi.mock("@/lib/google-identity/google-identity-client", () => ({
  activateGoogleCredentialFlow: identityClientMock.activate,
  ensureGoogleIdentityInitialized: identityClientMock.ensureInitialized,
  registerGoogleCredentialHandler: identityClientMock.registerHandler,
}));
vi.mock("./google-one-tap-storage", () => ({
  clearGoogleOneTapState: storageMock.clear,
  hasGoogleOneTapAttempted: storageMock.hasAttempted,
  hasGoogleOneTapSuppression: storageMock.hasSuppression,
  markGoogleOneTapAttempted: storageMock.markAttempted,
  suppressGoogleOneTap: storageMock.suppress,
}));

const googleIdentityServices = {
  accounts: {
    id: {
      cancel: googleIdentityMock.cancel,
      initialize: googleIdentityMock.initialize,
      prompt: googleIdentityMock.prompt,
      renderButton: googleIdentityMock.renderButton,
    },
  },
} satisfies GoogleIdentityServices;

describe("GoogleOneTapHost", () => {
  beforeEach(() => {
    pathnameMock.value = "/";
    authSessionMock.lifecycle = { status: "unauthenticated" };
    publicEnvMock.authEnabled = true;
    publicEnvMock.googleClientId = "local-client-id.apps.googleusercontent.com";
    publicEnvMock.googleOneTapEnabled = true;
    credentialHandler = null;
    vi.clearAllMocks();
    platformSupportedMock.mockReturnValue(true);
    storageMock.hasAttempted.mockReturnValue(false);
    storageMock.hasSuppression.mockReturnValue(false);
    identityClientMock.registerHandler.mockImplementation((_, handler) => {
      credentialHandler = handler;
      return identityClientMock.unregisterHandler;
    });
    loadGoogleIdentityScriptMock.mockResolvedValue(googleIdentityServices);
  });

  it("prompts once after the eligible unauthenticated gate passes", async () => {
    render(<GoogleOneTapHost />);

    await waitFor(() => {
      expect(googleIdentityMock.prompt).toHaveBeenCalledOnce();
    });

    expect(storageMock.markAttempted).toHaveBeenCalledOnce();
    expect(storageMock.suppress).toHaveBeenCalledWith(
      "automatic-prompt-attempted",
    );
    expect(identityClientMock.ensureInitialized).toHaveBeenCalledWith(
      googleIdentityServices,
      "local-client-id.apps.googleusercontent.com",
    );
    expect(identityClientMock.activate).toHaveBeenCalledWith("one-tap");
  });

  it.each([
    ["checking", "/"],
    ["authenticated", "/"],
    ["unauthenticated", "/app"],
  ] as const)(
    "does not load GIS for lifecycle %s on %s",
    async (status, pathname) => {
      authSessionMock.lifecycle =
        status === "authenticated"
          ? {
              status,
              account: { displayName: null, email: "a@b.com", id: "a" },
              session: { id: "s" },
            }
          : { status };
      pathnameMock.value = pathname;

      render(<GoogleOneTapHost />);

      await act(async () => Promise.resolve());
      expect(loadGoogleIdentityScriptMock).not.toHaveBeenCalled();
    },
  );

  it("exchanges a credential and clears suppression after success", async () => {
    render(<GoogleOneTapHost />);

    await waitFor(() => expect(credentialHandler).toBeTypeOf("function"));

    act(() => {
      credentialHandler?.({
        credential: "google-id-token",
        select_by: "fedcm",
      });
    });

    const mutationOptions = googleSignInMock.mutate.mock.calls[0]?.[1];

    expect(googleSignInMock.mutate).toHaveBeenCalledWith(
      { data: { credential: "google-id-token" } },
      expect.any(Object),
    );

    act(() => {
      mutationOptions?.onSuccess?.();
    });

    expect(storageMock.clear).toHaveBeenCalledOnce();
  });

  it("suppresses automatic retry when the credential exchange fails", async () => {
    render(<GoogleOneTapHost />);

    await waitFor(() => expect(credentialHandler).toBeTypeOf("function"));

    act(() => {
      credentialHandler?.({ credential: "google-id-token" });
    });

    const mutationOptions = googleSignInMock.mutate.mock.calls[0]?.[1];

    act(() => {
      mutationOptions?.onError?.();
    });

    expect(storageMock.suppress).toHaveBeenCalledWith(
      "credential-exchange-failed",
    );
  });

  it("cancels and suppresses the prompt when navigation becomes ineligible", async () => {
    const { rerender } = render(<GoogleOneTapHost />);

    await waitFor(() => {
      expect(googleIdentityMock.prompt).toHaveBeenCalledOnce();
    });

    pathnameMock.value = "/app";
    rerender(<GoogleOneTapHost />);

    expect(googleIdentityMock.cancel).toHaveBeenCalledOnce();
    expect(storageMock.suppress).toHaveBeenCalledWith("application-cancelled");
  });

  it("cancels the prompt and clears suppression when auth succeeds elsewhere", async () => {
    const { rerender } = render(<GoogleOneTapHost />);

    await waitFor(() => {
      expect(googleIdentityMock.prompt).toHaveBeenCalledOnce();
    });

    authSessionMock.lifecycle = {
      status: "authenticated",
      account: { displayName: "Lucas", email: "a@b.com", id: "a" },
      session: { id: "s" },
    };
    rerender(<GoogleOneTapHost />);

    expect(googleIdentityMock.cancel).toHaveBeenCalledOnce();
    expect(storageMock.clear).toHaveBeenCalledOnce();
    expect(storageMock.suppress).toHaveBeenCalledOnce();
    expect(storageMock.suppress).toHaveBeenCalledWith(
      "automatic-prompt-attempted",
    );
  });

  it("records only the tab attempt when the provider script fails", async () => {
    loadGoogleIdentityScriptMock.mockRejectedValueOnce(
      new Error("provider unavailable"),
    );

    render(<GoogleOneTapHost />);

    await waitFor(() => {
      expect(storageMock.markAttempted).toHaveBeenCalledOnce();
    });
    expect(storageMock.suppress).not.toHaveBeenCalled();
  });
});
