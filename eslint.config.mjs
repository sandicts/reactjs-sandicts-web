import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";
import jestDom from "eslint-plugin-jest-dom";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindcss from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";

const testingLibraryConfig = testingLibrary.configs["flat/react"];
const jestDomConfig = jestDom.configs["flat/recommended"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: "sandicts/testing-library",
    files: ["src/**/*.test.{ts,tsx}", "test/**/*.{ts,tsx}"],
    plugins: {
      ...testingLibraryConfig.plugins,
      ...jestDomConfig.plugins,
    },
    rules: {
      ...testingLibraryConfig.rules,
      ...jestDomConfig.rules,
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated API client:
    "src/lib/api/generated/**",
    // Test artifacts:
    "blob-report/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  prettierConfig,
  {
    name: "sandicts/tailwindcss",
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      "tailwindcss/classnames-order": "error",
      "tailwindcss/no-contradicting-classname": "error",
    },
  },
  {
    name: "sandicts/readable-component-style-files",
    files: ["src/components/**/*.styles.{ts,tsx}"],
    rules: {
      "max-len": [
        "error",
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
    },
  },
]);

export default eslintConfig;
