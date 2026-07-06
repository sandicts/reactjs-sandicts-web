import { describe, expect, it } from "vitest";
import { createAppFormatter } from "./formatters";

describe("createAppFormatter", () => {
  const formatter = createAppFormatter({
    timeZone: "America/Sao_Paulo",
  });

  it("formats representative dates and times with pt-BR conventions", () => {
    const value = new Date("2026-07-06T17:30:00.000Z");

    expect(formatter.dateTime(value, "shortDate")).toBe("06/07/2026");
    expect(formatter.dateTime(value, "time")).toBe("14:30");
  });

  it("formats representative numbers, percentages, and BRL values", () => {
    expect(formatter.number(1234.5, "decimal")).toBe("1.234,5");
    expect(formatter.number(0.125, "percent")).toBe("12,5%");
    expect(formatter.number(1234.56, "currencyBRL").replace(/\s/g, " ")).toBe(
      "R$ 1.234,56",
    );
  });
});
