import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  I18N_FALLBACK_TIME_ZONE,
  isSupportedLocale,
  resolveLocale,
  toOpenGraphLocale,
} from "./config";

describe("locale configuration", () => {
  it("keeps pt-BR as the only MVP locale and fallback", () => {
    expect(DEFAULT_LOCALE).toBe("pt-BR");
    expect(I18N_FALLBACK_TIME_ZONE).toBe("UTC");
    expect(isSupportedLocale("pt-BR")).toBe(true);
    expect(isSupportedLocale("en")).toBe(false);
    expect(resolveLocale("es")).toBe("pt-BR");
    expect(resolveLocale(undefined)).toBe("pt-BR");
  });

  it("maps the application locale to the Open Graph locale format", () => {
    expect(toOpenGraphLocale("pt-BR")).toBe("pt_BR");
  });
});
