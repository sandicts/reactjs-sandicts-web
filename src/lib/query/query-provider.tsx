"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./query-client";

type SandictsQueryProviderProps = Readonly<{
  children: React.ReactNode;
}>;

function SandictsQueryProvider({ children }: SandictsQueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { SandictsQueryProvider };
