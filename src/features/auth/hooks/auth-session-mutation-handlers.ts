import type { QueryClient } from "@tanstack/react-query";
import { adaptAuthSessionSnapshot } from "@/lib/auth/auth-session.adapters";
import { synchronizeAuthSessionCache } from "@/lib/auth/auth-session-cache";
import { setAuthSession } from "@/lib/auth/auth-session-store";

function persistAuthSession(queryClient: QueryClient, value: unknown) {
  const authSession = adaptAuthSessionSnapshot(value);

  synchronizeAuthSessionCache(queryClient, {
    account: authSession.account,
    session: authSession.session,
  });
  setAuthSession(authSession);
}

export { persistAuthSession };
