import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inspectVisualSystemResidues } from "./visual-system-residue-rules.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const scanRoots = ["src", "docs/frontend", "public"];
const rootFiles = ["package.json", "components.json"];
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
]);

async function collectTextFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(entryPath)));
    } else if (textExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const scannedFiles = [
  ...rootFiles.map((filePath) => resolve(projectRoot, filePath)),
];

for (const scanRoot of scanRoots) {
  scannedFiles.push(
    ...(await collectTextFiles(resolve(projectRoot, scanRoot))),
  );
}

const violations = [];

for (const filePath of scannedFiles) {
  const repositoryPath = relative(projectRoot, filePath).replaceAll("\\", "/");
  const contents = await readFile(filePath, "utf8");
  violations.push(...inspectVisualSystemResidues(repositoryPath, contents));
}

if (violations.length > 0) {
  for (const { filePath, match, rule } of violations) {
    console.error(`${filePath}: ${rule}: ${JSON.stringify(match)}`);
  }

  process.exitCode = 1;
} else {
  console.log("No prohibited visual-system residues found.");
}
