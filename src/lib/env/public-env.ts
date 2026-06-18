const defaultApiBaseUrl = "http://localhost:3000";

const publicEnv = {
  apiBaseUrl: normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl,
  ),
} as const;

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "") || defaultApiBaseUrl;
}

export { publicEnv };
