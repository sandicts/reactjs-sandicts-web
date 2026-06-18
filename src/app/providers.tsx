"use client";

import { SandictsQueryProvider } from "@/lib/query/query-provider";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return <SandictsQueryProvider>{children}</SandictsQueryProvider>;
}
