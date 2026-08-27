import { describe, expect, it } from "vitest";
import { isGoogleOneTapPlatformSupported } from "./google-one-tap-platform";

describe("Google One Tap platform policy", () => {
  it.each([
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
    "Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36",
  ])("allows an approved top-level Chromium browser", (userAgent) => {
    expect(
      isGoogleOneTapPlatformSupported({ isTopLevel: true, userAgent }),
    ).toBe(true);
  });

  it.each([
    "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/140.0.0.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) Gecko/20100101 Firefox/140.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/605.1.15 Version/19.0 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 16; Device Build/ABC; wv) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36",
  ])("keeps an unsupported platform on explicit fallback", (userAgent) => {
    expect(
      isGoogleOneTapPlatformSupported({ isTopLevel: true, userAgent }),
    ).toBe(false);
  });

  it("rejects embedded contexts", () => {
    expect(
      isGoogleOneTapPlatformSupported({
        isTopLevel: false,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
      }),
    ).toBe(false);
  });
});
