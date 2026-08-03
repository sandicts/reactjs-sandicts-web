const canonicalBrandFiles = new Set([
  "public/sandicts-mark.svg",
  "src/app/brand-variants.generated.css",
  "src/app/icon.svg",
  "src/config/brand.ts",
  "docs/frontend/prototypes/shared/sandicts-brand-tokens.css",
]);

const legacyIconGlyphPattern =
  /<(?:span|div)\b[^>]*\baria-hidden=["']true["'][^>]*>\s*([⌕↗!⌄●⌂▣◎○☰▦◷$◇＋×›])\s*<\/(?:span|div)>/gu;
const legacyFoundationColorPattern =
  /#(?:071211|f59e0b|34d399|0f766e|14b8a6|2dd4bf)\b/giu;
const legacyMarkGeometryPattern = /M25 58c8 10 31 11 43 0|M69 29l7-13/giu;
const rawVisualValuePattern = /#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch)\(/giu;

function createViolation(filePath, rule, match) {
  return {
    filePath,
    match,
    rule,
  };
}

function collectMatches(filePath, contents, rule, pattern) {
  return Array.from(contents.matchAll(pattern), (match) =>
    createViolation(filePath, rule, match[0]),
  );
}

function inspectVisualSystemResidues(filePath, contents) {
  const normalizedPath = filePath.replaceAll("\\", "/");
  const violations = [];

  if (
    normalizedPath === "package.json" ||
    normalizedPath === "components.json" ||
    normalizedPath.startsWith("src/")
  ) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "runtime-lucide",
        /\blucide(?:-react)?\b/giu,
      ),
    );
  }

  if (normalizedPath.startsWith("docs/frontend/")) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "active-lucide-guidance",
        /\b(?:Lucide-direction|following Lucide direction)\b/giu,
      ),
      ...collectMatches(
        normalizedPath,
        contents,
        "sand-orange-terminology",
        /\bSand Orange\b/giu,
      ),
      ...collectMatches(
        normalizedPath,
        contents,
        "obsolete-scorpion-brand",
        /\bscorpion\b/giu,
      ),
    );
  }

  if (normalizedPath.startsWith("src/")) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "direct-public-brand-asset",
        /["']\/sandicts-mark\.svg["']/giu,
      ),
    );
  }

  if (
    (normalizedPath.startsWith("src/components/") ||
      normalizedPath.startsWith("src/features/")) &&
    !canonicalBrandFiles.has(normalizedPath)
  ) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "raw-feature-visual-value",
        rawVisualValuePattern,
      ),
    );
  }

  if (normalizedPath.endsWith(".html")) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "unicode-interface-icon",
        legacyIconGlyphPattern,
      ),
    );
  }

  if (!canonicalBrandFiles.has(normalizedPath)) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "legacy-foundation-color",
        legacyFoundationColorPattern,
      ),
    );
  }

  violations.push(
    ...collectMatches(
      normalizedPath,
      contents,
      "obsolete-brand-geometry",
      legacyMarkGeometryPattern,
    ),
  );

  return violations;
}

export { canonicalBrandFiles, inspectVisualSystemResidues };
