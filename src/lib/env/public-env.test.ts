import { describe, expect, it } from "vitest";
import { createPublicEnvironment } from "./public-env";

describe("createPublicEnvironment", () => {
  it("uses the local development contract by default", () => {
    expect(createPublicEnvironment({})).toEqual({
      apiBaseUrl: "http://localhost:3000",
      appEnvironment: "local",
      authEnabled: true,
      googleClientId: null,
      googleOneTapEnabled: false,
    });
  });

  it("normalizes a configured API base URL", () => {
    expect(
      createPublicEnvironment({
        apiBaseUrl: " https://api.sandicts.com.br/v1/ ",
        appEnvironment: "production",
      }).apiBaseUrl,
    ).toBe("https://api.sandicts.com.br/v1");
  });

  it.each(["pr-preview", "preview", "production"])(
    "requires an HTTPS API outside local development: %s",
    (appEnvironment) => {
      expect(() =>
        createPublicEnvironment({
          apiBaseUrl: "http://api.sandicts.com.br",
          appEnvironment,
        }),
      ).toThrow(/HTTPS/);
    },
  );

  it("disables browser authentication by default in pull request previews", () => {
    expect(
      createPublicEnvironment({
        apiBaseUrl: "https://api.preview.sandicts.com.br",
        appEnvironment: "pr-preview",
      }),
    ).toMatchObject({
      authEnabled: false,
      googleOneTapEnabled: false,
    });
  });

  it("rejects browser authentication in pull request previews", () => {
    expect(() =>
      createPublicEnvironment({
        apiBaseUrl: "https://api.preview.sandicts.com.br",
        appEnvironment: "pr-preview",
        authEnabled: "true",
      }),
    ).toThrow(/must be false in pr-preview/);
  });

  it("requires authentication and a Google client ID for One Tap", () => {
    expect(() =>
      createPublicEnvironment({
        googleOneTapEnabled: "true",
      }),
    ).toThrow(/NEXT_PUBLIC_GOOGLE_CLIENT_ID/);

    expect(
      createPublicEnvironment({
        googleClientId: "web-client.apps.googleusercontent.com",
        googleOneTapEnabled: "true",
      }),
    ).toMatchObject({
      googleClientId: "web-client.apps.googleusercontent.com",
      googleOneTapEnabled: true,
    });
  });

  it("rejects invalid booleans and environment names", () => {
    expect(() => createPublicEnvironment({ authEnabled: "yes" })).toThrow(
      /NEXT_PUBLIC_AUTH_ENABLED/,
    );
    expect(() =>
      createPublicEnvironment({ appEnvironment: "staging" }),
    ).toThrow(/NEXT_PUBLIC_APP_ENV/);
  });
});
