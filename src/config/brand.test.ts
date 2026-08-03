import { describe, expect, it } from "vitest";
import {
  activeBrandVariant,
  activeBrandVariantId,
  brandVariants,
  getBrandVariant,
} from "./brand";
import { brandArtworks } from "../lib/brand/brand-artwork";

describe("brand configuration", () => {
  it("resolves the active variant from the registry", () => {
    expect(activeBrandVariant).toBe(brandVariants[activeBrandVariantId]);
    expect(activeBrandVariant.id).toBe("default");
  });

  it("keeps every artwork reference valid", () => {
    for (const variant of Object.values(brandVariants)) {
      expect(brandArtworks).toHaveProperty(variant.artworkId);
    }
  });

  it("proves that a fixture can change semantic colors centrally", () => {
    const defaultVariant = getBrandVariant("default");
    const fixtureVariant = getBrandVariant("celebration-fixture");

    expect(fixtureVariant.artworkId).toBe(defaultVariant.artworkId);
    expect(fixtureVariant.theme.dark.brand).not.toBe(
      defaultVariant.theme.dark.brand,
    );
    expect(fixtureVariant.theme.light.primary).not.toBe(
      defaultVariant.theme.light.primary,
    );
  });
});
