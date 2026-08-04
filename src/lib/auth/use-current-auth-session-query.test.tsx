/**
 * @vitest-environment jsdom
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { useCurrentAuthSessionQuery } from "./use-current-auth-session-query";

const fetchMock = vi.fn<typeof fetch>();
const projection = {
  account: {
    displayName: "Player",
    email: "player@example.com",
    id: "account-id",
  },
  session: { id: "session-id" },
};

let queryClient = createQueryClient();

describe("useCurrentAuthSessionQuery", () => {
  beforeEach(() => {
    queryClient = createQueryClient();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    queryClient.clear();
    vi.unstubAllGlobals();
  });

  it("uses the semantic session key instead of the generated URL key", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, projection));

    const { result } = renderHook(
      () => useCurrentAuthSessionQuery({ enabled: true }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(queryKeys.auth.session())).toEqual(
      projection,
    );
    expect(queryClient.getQueryData(["/auth/me"])).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not make a redundant request when hydration supplies fresh data", () => {
    const { result } = renderHook(
      () =>
        useCurrentAuthSessionQuery({ enabled: true, initialData: projection }),
      { wrapper: createWrapper() },
    );

    expect(result.current.data).toEqual(projection);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function createWrapper() {
  return function QueryWrapper({ children }: Readonly<{ children: ReactNode }>) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
