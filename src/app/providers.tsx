"use client";

import { AuthSessionProvider } from "@/lib/auth/auth-session-provider";
import { SandictsQueryProvider } from "@/lib/query/query-provider";
import { GoogleOneTapHost } from "@/features/auth/google-one-tap/google-one-tap-host";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SandictsQueryProvider>
      <AuthSessionProvider>
        <GoogleOneTapHost />
        {children}
      </AuthSessionProvider>
    </SandictsQueryProvider>
  );
}
