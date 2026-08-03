import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  prototypeIconConsumers,
  prototypeIconDefinitions,
} from "./prototype-icon-manifest.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const checkOnly = process.argv.includes("--check");
const startMarker = "<!-- visual-system:icons:start -->";
const endMarker = "<!-- visual-system:icons:end -->";
const generatedBlockPattern =
  /[ \t]*<!-- visual-system:icons:start -->[\s\S]*?<!-- visual-system:icons:end -->/;
const legacySpritePattern =
  /[ \t]*<svg class="icon-sprite" aria-hidden="true">[\s\S]*?<\/svg>/;

function renderSymbol(iconId) {
  const Icon = prototypeIconDefinitions[iconId];

  if (!Icon) {
    throw new Error(`Unknown prototype icon: ${iconId}.`);
  }

  const markup = renderToStaticMarkup(
    createElement(Icon, {
      "aria-hidden": true,
      weight: "regular",
    }),
  );
  const match = markup.match(
    /^<svg\b[^>]*\bviewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>$/,
  );

  if (!match) {
    throw new Error(`Could not extract SVG markup for ${iconId}.`);
  }

  const [, viewBox, contents] = match;
  const formattedContents = contents
    .replaceAll("><", ">\n<")
    .split("\n")
    .map((line) => `        ${line}`)
    .join("\n");

  return [
    `      <symbol id="${iconId}" viewBox="${viewBox}">`,
    formattedContents,
    "      </symbol>",
  ].join("\n");
}

function buildSprite(iconIds) {
  const symbols = iconIds.map(renderSymbol).join("\n");

  return [
    `    ${startMarker}`,
    '    <svg class="icon-sprite" aria-hidden="true">',
    symbols,
    "    </svg>",
    `    ${endMarker}`,
  ].join("\n");
}

function updateDocument(document, consumer) {
  const sprite = buildSprite(consumer.iconIds);

  if (generatedBlockPattern.test(document)) {
    return document.replace(generatedBlockPattern, sprite);
  }

  if (legacySpritePattern.test(document)) {
    return document.replace(legacySpritePattern, `\n${sprite}`);
  }

  if (!document.includes(consumer.insertionMarker)) {
    throw new Error(
      `Could not find the icon insertion marker in ${consumer.path}.`,
    );
  }

  return document.replace(
    consumer.insertionMarker,
    `${consumer.insertionMarker}\n\n${sprite}`,
  );
}

function validateReferences(document, consumer) {
  const generatedIds = new Set(consumer.iconIds);
  const references = Array.from(
    document.matchAll(/\bhref="#(icon-[^"]+)"/g),
    (match) => match[1],
  );
  const missing = references.filter((iconId) => !generatedIds.has(iconId));

  if (missing.length > 0) {
    throw new Error(
      `${consumer.path} references icons missing from its manifest: ${[
        ...new Set(missing),
      ].join(", ")}.`,
    );
  }
}

const outOfSync = [];

for (const consumer of prototypeIconConsumers) {
  const filePath = resolve(projectRoot, consumer.path);
  const current = await readFile(filePath, "utf8");
  const expected = updateDocument(current, consumer);

  validateReferences(expected, consumer);

  if (current === expected) {
    continue;
  }

  if (checkOnly) {
    outOfSync.push(consumer.path);
  } else {
    await writeFile(filePath, expected, "utf8");
    console.log(`Updated ${consumer.path}.`);
  }
}

if (checkOnly && outOfSync.length > 0) {
  console.error(
    `Prototype Phosphor sprites are out of sync: ${outOfSync.join(", ")}. Run npm run visual-system:sync.`,
  );
  process.exitCode = 1;
} else if (checkOnly) {
  console.log("Prototype Phosphor sprites are in sync.");
}
