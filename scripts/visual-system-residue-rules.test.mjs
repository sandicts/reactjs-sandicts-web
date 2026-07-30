import { describe, expect, it } from "vitest";
import {
  deferredBrandFiles,
  inspectVisualSystemResidues,
} from "./visual-system-residue-rules.mjs";

describe("visual-system residue rules", () => {
  it("allows explicitly superseded migration history", () => {
    expect(
      inspectVisualSystemResidues(
        "docs/frontend/history.md",
        "KAN-144 replaces the old New York, Geist, Lucide, and old radius.",
      ),
    ).toEqual([]);
  });

  it("rejects active Lucide guidance", () => {
    expect(
      inspectVisualSystemResidues(
        "docs/frontend/guide.md",
        "Use local SVGs following Lucide direction in the prototype.",
      ),
    ).toEqual([expect.objectContaining({ rule: "active-lucide-guidance" })]);
  });

  it("rejects legacy focus terminology", () => {
    expect(
      inspectVisualSystemResidues(
        "docs/frontend/guide.md",
        "Preserve the Sand Orange focus indicator.",
      ),
    ).toEqual([expect.objectContaining({ rule: "sand-orange-terminology" })]);
  });

  it("rejects Unicode interface icon placeholders", () => {
    expect(
      inspectVisualSystemResidues(
        "docs/frontend/prototypes/app-shells/index.html",
        '<span aria-hidden="true">⌂</span>',
      ),
    ).toEqual([expect.objectContaining({ rule: "unicode-interface-icon" })]);
  });

  it("rejects Lucide runtime dependencies", () => {
    expect(
      inspectVisualSystemResidues(
        "package.json",
        '{"dependencies":{"lucide-react":"latest"}}',
      ),
    ).toEqual([expect.objectContaining({ rule: "runtime-lucide" })]);
  });

  it("allows only the documented KAN-145 brand deferrals", () => {
    for (const filePath of deferredBrandFiles) {
      expect(inspectVisualSystemResidues(filePath, "#F59E0B")).toEqual([]);
    }

    expect(
      inspectVisualSystemResidues(
        "src/features/example.tsx",
        'const color = "#F59E0B";',
      ),
    ).toEqual([expect.objectContaining({ rule: "legacy-foundation-color" })]);
  });
});
