/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  clearGoogleOneTapState,
  googleOneTapAttemptStorageKey,
  googleOneTapSuppressionDurationMs,
  googleOneTapSuppressionStorageKey,
  hasGoogleOneTapAttempted,
  hasGoogleOneTapSuppression,
  markGoogleOneTapAttempted,
  resetGoogleOneTapStorageForTests,
  suppressGoogleOneTap,
} from "./google-one-tap-storage";

describe("Google One Tap storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    resetGoogleOneTapStorageForTests();
  });

  it("records one attempt for the current tab without sensitive context", () => {
    markGoogleOneTapAttempted(1_000);

    expect(hasGoogleOneTapAttempted()).toBe(true);
    expect(
      JSON.parse(sessionStorage.getItem(googleOneTapAttemptStorageKey)!),
    ).toEqual({
      attemptedAt: 1_000,
      version: 1,
    });
  });

  it("suppresses automatic prompting for 24 hours", () => {
    suppressGoogleOneTap("automatic-prompt-attempted", 1_000);

    expect(hasGoogleOneTapSuppression(1_001)).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(googleOneTapSuppressionStorageKey)!),
    ).toEqual({
      reasonCategory: "automatic-prompt-attempted",
      suppressedUntil: 1_000 + googleOneTapSuppressionDurationMs,
      version: 1,
    });
    expect(
      hasGoogleOneTapSuppression(1_000 + googleOneTapSuppressionDurationMs),
    ).toBe(false);
  });

  it("discards malformed records and clears both records after success", () => {
    sessionStorage.setItem(googleOneTapAttemptStorageKey, "not-json");
    localStorage.setItem(
      googleOneTapSuppressionStorageKey,
      JSON.stringify({ reasonCategory: "unknown", version: 1 }),
    );

    expect(hasGoogleOneTapAttempted()).toBe(false);
    expect(hasGoogleOneTapSuppression()).toBe(false);
    expect(sessionStorage.getItem(googleOneTapAttemptStorageKey)).toBeNull();
    expect(localStorage.getItem(googleOneTapSuppressionStorageKey)).toBeNull();

    markGoogleOneTapAttempted();
    suppressGoogleOneTap("credential-exchange-failed");
    clearGoogleOneTapState();

    expect(hasGoogleOneTapAttempted()).toBe(false);
    expect(hasGoogleOneTapSuppression()).toBe(false);
  });
});
