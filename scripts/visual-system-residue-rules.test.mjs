import { describe, expect, it } from "vitest";
import {
  canonicalBrandFiles,
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

  it("allows raw values only in canonical generated brand files", () => {
    for (const filePath of canonicalBrandFiles) {
      expect(inspectVisualSystemResidues(filePath, "#F59E0B")).toEqual([]);
    }

    expect(
      inspectVisualSystemResidues(
        "src/features/example.tsx",
        'const color = "#F59E0B";',
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: "legacy-foundation-color" }),
        expect.objectContaining({ rule: "raw-feature-visual-value" }),
      ]),
    );
  });

  it("rejects direct runtime imports of the generated prototype asset", () => {
    expect(
      inspectVisualSystemResidues(
        "src/features/example.tsx",
        'const mark = "/sandicts-mark.svg";',
      ),
    ).toEqual([expect.objectContaining({ rule: "direct-public-brand-asset" })]);
  });

  it("rejects obsolete brand geometry and scorpion guidance", () => {
    expect(
      inspectVisualSystemResidues(
        "docs/frontend/brand.md",
        "Use a minimal scorpion with M25 58c8 10 31 11 43 0.",
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: "obsolete-scorpion-brand" }),
        expect.objectContaining({ rule: "obsolete-brand-geometry" }),
      ]),
    );
  });
});
