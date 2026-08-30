import { defineConfig } from "orval";

const localOpenApiSchemaPath =
  "../nodejs-sandicts-api/openapi/sandicts-api.json";
const canonicalOpenApiSchemaUrl =
  "https://raw.githubusercontent.com/fradelli/nodejs-sandicts-api/developer/openapi/sandicts-api.json";
const configuredOpenApiSchemaUrl = process.env.OPENAPI_SCHEMA_URL?.trim();
const openApiSchemaTarget = [
  localOpenApiSchemaPath,
  ...(configuredOpenApiSchemaUrl ? [configuredOpenApiSchemaUrl] : []),
  canonicalOpenApiSchemaUrl,
];

export default defineConfig({
  sandictsApi: {
    input: {
      target: openApiSchemaTarget,
    },
    output: {
      client: "react-query",
      clean: true,
      formatter: "prettier",
      httpClient: "fetch",
      mode: "tags-split",
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          name: "sandictsApiRequest",
          path: "./src/lib/api/runtime/sandicts-api-request.ts",
        },
      },
      schemas: "./src/lib/api/generated/sandicts-api/model",
      target: "./src/lib/api/generated/sandicts-api/sandicts-api.ts",
    },
  },
});
