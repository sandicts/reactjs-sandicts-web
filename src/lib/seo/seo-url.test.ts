import { describe, expect, it } from "vitest";
import { createSeoEnvironment } from "@/lib/env/seo-env";
import { createAbsoluteUrl } from "./seo-url";

const environment = createSeoEnvironment({
  webOrigin: "https://sandicts.com.br",
});

describe("createAbsoluteUrl", () => {
  it.each([
    ["/", "https://sandicts.com.br/"],
    ["/discovery", "https://sandicts.com.br/discovery"],
  ])("composes %s against the configured origin", (pathname, expectedUrl) => {
    expect(createAbsoluteUrl(pathname, environment)).toBe(expectedUrl);
  });

  it.each(["discovery", "//external.example/discovery"])(
    "rejects unsafe path %s",
    (pathname) => {
      expect(() => createAbsoluteUrl(pathname, environment)).toThrow(
        "SEO paths must start with one slash.",
      );
    },
  );
});
