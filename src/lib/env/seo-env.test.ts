import { describe, expect, it } from "vitest";
import {
  DEFAULT_WEB_ORIGIN,
  createSeoEnvironment,
  isLocalHostname,
} from "./seo-env";

describe("createSeoEnvironment", () => {
  it("uses a local origin and disables indexing by default", () => {
    const environment = createSeoEnvironment({});

    expect(environment).toEqual({
      indexingEnabled: false,
      webOrigin: new URL(DEFAULT_WEB_ORIGIN),
    });
  });

  it("normalizes a valid configured origin", () => {
    const environment = createSeoEnvironment({
      indexingEnabled: " TRUE ",
      webOrigin: " https://sandicts.com.br/ ",
    });

    expect(environment.indexingEnabled).toBe(true);
    expect(environment.webOrigin.toString()).toBe("https://sandicts.com.br/");
  });

  it.each([
    "sandicts.com.br",
    "ftp://sandicts.com.br",
    "https://user:password@sandicts.com.br",
    "https://sandicts.com.br/app",
    "https://sandicts.com.br/?preview=true",
    "https://sandicts.com.br/#home",
  ])("rejects an invalid web origin: %s", (webOrigin) => {
    expect(() => createSeoEnvironment({ webOrigin })).toThrow(/WEB_ORIGIN/);
  });

  it("rejects an ambiguous indexing flag", () => {
    expect(() => createSeoEnvironment({ indexingEnabled: "yes" })).toThrow(
      'SEO_INDEXING_ENABLED must be either "true" or "false".',
    );
  });

  it.each([
    "http://sandicts.com.br",
    "https://localhost:3001",
    "https://preview.localhost",
    "https://127.0.0.1",
    "https://[::1]",
  ])(
    "rejects an unsafe production origin when indexing is enabled: %s",
    (webOrigin) => {
      expect(() =>
        createSeoEnvironment({
          indexingEnabled: "true",
          nodeEnvironment: "production",
          webOrigin,
        }),
      ).toThrow(/HTTPS and a non-local hostname/);
    },
  );

  it("accepts a public HTTPS origin for production indexing", () => {
    expect(
      createSeoEnvironment({
        indexingEnabled: "true",
        nodeEnvironment: "production",
        webOrigin: "https://sandicts.com.br",
      }),
    ).toEqual({
      indexingEnabled: true,
      webOrigin: new URL("https://sandicts.com.br"),
    });
  });
});

describe("isLocalHostname", () => {
  it.each(["localhost", "app.localhost", "127.0.0.1", "::1", "0.0.0.0"])(
    "recognizes local hostname %s",
    (hostname) => {
      expect(isLocalHostname(hostname)).toBe(true);
    },
  );

  it("does not treat a public hostname as local", () => {
    expect(isLocalHostname("sandicts.com.br")).toBe(false);
  });
});
