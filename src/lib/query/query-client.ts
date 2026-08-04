import { QueryClient } from "@tanstack/react-query";

const queryStaleTimeMilliseconds = 30_000;
const queryGarbageCollectionMilliseconds = 5 * 60_000;
const maximumQueryRetryCount = 1;
const clientErrorStatusCodeFloor = 400;
const clientErrorStatusCodeCeiling = 500;

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: queryGarbageCollectionMilliseconds,
        retry: shouldRetryQuery,
        staleTime: queryStaleTimeMilliseconds,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
}

function shouldRetryQuery(failureCount: number, error: Error) {
  const statusCode = readStatusCode(error);

  if (
    statusCode >= clientErrorStatusCodeFloor &&
    statusCode < clientErrorStatusCodeCeiling
  ) {
    return false;
  }

  return failureCount < maximumQueryRetryCount;
}

function readStatusCode(error: Error) {
  const maybeStatusCode = (error as { statusCode?: unknown }).statusCode;

  return typeof maybeStatusCode === "number" ? maybeStatusCode : 0;
}

export { createQueryClient, getQueryClient };
