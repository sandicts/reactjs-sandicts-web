type BrandArtwork = Readonly<{
  id: string;
  path: string;
  viewBox: string;
}>;

const brandArtworks = {
  "sandicts-s": {
    id: "sandicts-s",
    path: [
      "M8 90V74H57",
      "C65 74 69 72 69 68",
      "C69 63 64 60 54 58",
      "L40 55",
      "C19 50 8 41 8 26",
      "C8 13 19 6 38 6",
      "H88",
      "C83 20 72 31 58 36",
      "C64 29 68 22 69 18",
      "H41",
      "C31 18 26 21 26 27",
      "C26 33 31 36 40 38",
      "L57 42",
      "C78 47 88 56 88 69",
      "C88 83 77 90 57 90",
      "H8Z",
    ].join(" "),
    viewBox: "0 0 96 96",
  },
} as const satisfies Record<string, BrandArtwork>;

type BrandArtworkId = keyof typeof brandArtworks;

function getBrandArtwork(artworkId: BrandArtworkId) {
  return brandArtworks[artworkId];
}

export { brandArtworks, getBrandArtwork };
export type { BrandArtwork, BrandArtworkId };
