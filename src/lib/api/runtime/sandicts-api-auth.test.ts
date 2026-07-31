import { describe, expect, it } from "vitest";
import { isSandictsAuthUrl } from "./sandicts-api-auth";

describe("isSandictsAuthUrl", () => {
  it.each([
    "/auth/refresh",
    "/auth/google/sign-in",
    "https://api.sandicts.com.br/auth/magic-link/request",
  ])("recognizes an authentication endpoint: %s", (url) => {
    expect(isSandictsAuthUrl(url)).toBe(true);
  });

  it.each(["/players/me", "/sports", "/authentication"])(
    "does not classify a non-auth endpoint as browser authentication: %s",
    (url) => {
      expect(isSandictsAuthUrl(url)).toBe(false);
    },
  );
});
