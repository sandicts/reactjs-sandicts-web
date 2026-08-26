/**
 * @vitest-environment jsdom
 */

import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { SandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import type {
  GoogleButtonConfiguration,
  GoogleIdentityConfiguration,
  GoogleIdentityServices,
} from "@/lib/google-identity/google-identity.types";
import { resetGoogleIdentityClientForTests } from "@/lib/google-identity/google-identity-client";
import { GoogleSignInHost } from "./google-sign-in-host";

const publicEnvMock = vi.hoisted(() => ({
  googleClientId: "local-client-id.apps.googleusercontent.com" as string | null,
}));
const googleSignInMock = vi.hoisted(() => ({
  error: null as unknown,
  isError: false,
  isPending: false,
  mutate: vi.fn(),
  reset: vi.fn(),
}));
const googleIdentityMock = vi.hoisted(() => ({
  cancel: vi.fn(),
  initialize: vi.fn(),
  prompt: vi.fn(),
  renderButton: vi.fn(),
}));
const loadGoogleIdentityScriptMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/env/public-env", () => ({ publicEnv: publicEnvMock }));
vi.mock("@/features/auth/hooks/use-google-sign-in", () => ({
  useGoogleSignIn: () => googleSignInMock,
}));
vi.mock("@/lib/google-identity/google-identity-script", () => ({
  loadGoogleIdentityScript: loadGoogleIdentityScriptMock,
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

describe("GoogleSignInHost", () => {
  beforeEach(() => {
    resetGoogleIdentityClientForTests();
    publicEnvMock.googleClientId = "local-client-id.apps.googleusercontent.com";
    googleSignInMock.error = null;
    googleSignInMock.isError = false;
    googleSignInMock.isPending = false;
    googleSignInMock.mutate.mockReset();
    googleSignInMock.reset.mockReset();
    googleIdentityMock.initialize.mockReset();
    googleIdentityMock.cancel.mockReset();
    googleIdentityMock.prompt.mockReset();
    googleIdentityMock.renderButton.mockReset();
    loadGoogleIdentityScriptMock.mockReset();
    loadGoogleIdentityScriptMock.mockResolvedValue(googleIdentityServices);
  });

  it("initializes GIS, renders the official button, and exchanges its credential", async () => {
    renderWithI18n(<GoogleSignInHost />);

    expect(
      screen.getByRole("region", { name: "Preparando acesso com Google…" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(googleIdentityMock.renderButton).toHaveBeenCalledOnce();
    });

    const identityConfiguration = readIdentityConfiguration();
    const buttonConfiguration = readButtonConfiguration();

    expect(identityConfiguration).toMatchObject({
      auto_select: false,
      client_id: "local-client-id.apps.googleusercontent.com",
      ux_mode: "popup",
    });
    expect(buttonConfiguration).toMatchObject({
      locale: "pt_BR",
      size: "large",
      text: "continue_with",
      type: "standard",
      width: "320",
    });

    act(() => {
      identityConfiguration.callback({ credential: "google-id-token" });
    });

    expect(googleSignInMock.mutate).toHaveBeenCalledWith({
      data: { credential: "google-id-token" },
    });
  });

  it("keeps the provider action available when its popup returns no credential", async () => {
    renderWithI18n(<GoogleSignInHost />);

    await waitFor(() => {
      expect(googleIdentityMock.renderButton).toHaveBeenCalledOnce();
    });

    act(() => {
      readButtonConfiguration().click_listener?.();
    });

    expect(googleSignInMock.reset).toHaveBeenCalledOnce();
    expect(googleSignInMock.mutate).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("google-sign-in-button-host")).not.toHaveClass(
      "hidden",
    );
  });

  it("shows a recoverable provider failure and retries the script load", async () => {
    loadGoogleIdentityScriptMock.mockRejectedValueOnce(
      new Error("script unavailable"),
    );

    renderWithI18n(<GoogleSignInHost />);

    expect(
      await screen.findByText("Google Sign-In indisponível"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Tentar carregar novamente" }),
    );

    await waitFor(() => {
      expect(loadGoogleIdentityScriptMock).toHaveBeenCalledTimes(2);
      expect(googleIdentityMock.renderButton).toHaveBeenCalledOnce();
    });
  });

  it("explains when the environment has no Google client configuration", () => {
    publicEnvMock.googleClientId = null;

    renderWithI18n(<GoogleSignInHost />);

    expect(
      screen.getByText(
        "O acesso com Google não está configurado neste ambiente.",
      ),
    ).toBeInTheDocument();
    expect(loadGoogleIdentityScriptMock).not.toHaveBeenCalled();
  });

  it("rejects an empty provider credential without calling the API", async () => {
    renderWithI18n(<GoogleSignInHost />);

    await waitFor(() => {
      expect(googleIdentityMock.initialize).toHaveBeenCalledOnce();
    });

    act(() => {
      readIdentityConfiguration().callback({});
    });

    expect(
      screen.getByText(
        "O Google não retornou uma credencial válida. Tente novamente.",
      ),
    ).toBeInTheDocument();
    expect(googleSignInMock.mutate).not.toHaveBeenCalled();
  });

  it("maps API rate limiting to recoverable sign-in feedback", async () => {
    googleSignInMock.isError = true;
    googleSignInMock.error = new SandictsApiError({
      code: "rate_limited",
      message: "Too many attempts",
      path: "/auth/google/sign-in",
      requestId: "request-id",
      statusCode: 429,
      timestamp: "2026-08-26T00:00:00.000Z",
    });

    renderWithI18n(<GoogleSignInHost />);

    expect(
      screen.getByText(
        "Você fez muitas tentativas. Aguarde um pouco antes de tentar novamente.",
      ),
    ).toBeInTheDocument();
  });
});

function readIdentityConfiguration() {
  const configuration = googleIdentityMock.initialize.mock.calls[0]?.[0];

  if (!configuration) {
    throw new Error("Google Identity Services was not initialized.");
  }

  return configuration as GoogleIdentityConfiguration;
}

function readButtonConfiguration() {
  const configuration = googleIdentityMock.renderButton.mock.calls[0]?.[1];

  if (!configuration) {
    throw new Error("The Google Sign-In button was not rendered.");
  }

  return configuration as GoogleButtonConfiguration;
}
