import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import type { AuthSessionSnapshot } from "@/lib/auth/auth-session.types";
import { createQueryClient } from "@/lib/query/query-client";

const authSession = {
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: {
    id: "session-id",
  },
  accessToken: "access-token",
  accessTokenExpiresAt: "2026-06-28T01:00:00.000Z",
} satisfies AuthSessionSnapshot;

function createAuthQueryClient() {
  return createQueryClient();
}

function createJsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function createQueryClientTestWrapper(queryClient: QueryClient) {
  return function QueryClientTestWrapper({
    children,
  }: Readonly<{ children: ReactNode }>) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

export {
  authSession,
  createAuthQueryClient,
  createJsonResponse,
  createQueryClientTestWrapper,
};
