const deferredBrandFiles = new Set([
  "docs/frontend/sandicts-frontend-planning.md",
  "public/sandicts-mark.svg",
  "src/lib/seo/social-image.tsx",
  "src/lib/visual-system/static-colors.ts",
]);

const legacyIconGlyphPattern =
  /<(?:span|div)\b[^>]*\baria-hidden=["']true["'][^>]*>\s*([⌕↗!⌄●⌂▣◎○☰▦◷$◇＋×›])\s*<\/(?:span|div)>/gu;
const legacyFoundationColorPattern =
  /#(?:071211|f59e0b|34d399|0f766e|14b8a6|2dd4bf)\b/giu;

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

  if (!deferredBrandFiles.has(normalizedPath)) {
    violations.push(
      ...collectMatches(
        normalizedPath,
        contents,
        "legacy-foundation-color",
        legacyFoundationColorPattern,
      ),
    );
  }

  return violations;
}

export { deferredBrandFiles, inspectVisualSystemResidues };
