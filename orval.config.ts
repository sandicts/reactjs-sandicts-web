import { defineConfig } from "orval";

const defaultOpenApiSchemaUrl = "http://localhost:3000/docs-json";

export default defineConfig({
  sandictsApi: {
    input: {
      target: process.env.OPENAPI_SCHEMA_URL ?? defaultOpenApiSchemaUrl,
    },
    output: {
      client: "react-query",
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
