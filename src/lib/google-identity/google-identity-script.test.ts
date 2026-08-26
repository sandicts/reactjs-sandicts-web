/**
 * @vitest-environment jsdom
 */

/* eslint-disable testing-library/no-node-access -- This unit verifies dynamic script element lifecycle. */

import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GoogleIdentityServices } from "./google-identity.types";
import {
  googleIdentityScriptId,
  loadGoogleIdentityScript,
} from "./google-identity-script";

const googleIdentityServices = {
  accounts: {
    id: {
      cancel: vi.fn(),
      initialize: vi.fn(),
      prompt: vi.fn(),
      renderButton: vi.fn(),
    },
  },
} satisfies GoogleIdentityServices;

describe("loadGoogleIdentityScript", () => {
  afterEach(() => {
    delete window.google;
    document.getElementById(googleIdentityScriptId)?.remove();
    vi.clearAllMocks();
  });

  it("reuses an already available Google browser API", async () => {
    window.google = googleIdentityServices;

    await expect(loadGoogleIdentityScript()).resolves.toBe(
      googleIdentityServices,
    );
    expect(document.getElementById(googleIdentityScriptId)).toBeNull();
  });

  it("creates one script and resolves every pending consumer", async () => {
    const firstLoad = loadGoogleIdentityScript();
    const secondLoad = loadGoogleIdentityScript();
    const script = document.getElementById(googleIdentityScriptId);

    expect(script).toBeInstanceOf(HTMLScriptElement);
    expect(
      document.querySelectorAll(`#${googleIdentityScriptId}`),
    ).toHaveLength(1);

    window.google = googleIdentityServices;
    fireEvent.load(script!);

    await expect(Promise.all([firstLoad, secondLoad])).resolves.toEqual([
      googleIdentityServices,
      googleIdentityServices,
    ]);
  });

  it("removes a failed script so a later retry can create a fresh one", async () => {
    const failedLoad = loadGoogleIdentityScript();
    const failedScript = document.getElementById(googleIdentityScriptId);

    fireEvent.error(failedScript!);

    await expect(failedLoad).rejects.toThrow(
      "Google Identity Services failed to load.",
    );
    expect(document.getElementById(googleIdentityScriptId)).toBeNull();

    const retryLoad = loadGoogleIdentityScript();
    const retryScript = document.getElementById(googleIdentityScriptId);

    expect(retryScript).toBeInstanceOf(HTMLScriptElement);
    expect(retryScript).not.toBe(failedScript);

    window.google = googleIdentityServices;
    fireEvent.load(retryScript!);

    await expect(retryLoad).resolves.toBe(googleIdentityServices);
  });
});
