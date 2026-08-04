"use client";

import { AuthSessionProvider } from "@/lib/auth/auth-session-provider";
import { SandictsQueryProvider } from "@/lib/query/query-provider";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SandictsQueryProvider>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </SandictsQueryProvider>
  );
}
