type AuthenticatedAccountSummary = Readonly<{
  displayName: string | null;
  email: string;
  id: string;
}>;

type AuthSessionSummary = Readonly<{
  id: string;
}>;

type AuthSessionSnapshot = Readonly<{
  accessToken: string;
  accessTokenExpiresAt: string;
  account: AuthenticatedAccountSummary;
  session: AuthSessionSummary;
}>;

type AuthSessionProjection = Readonly<{
  account: AuthenticatedAccountSummary;
  session: AuthSessionSummary;
}>;

type AuthSessionLifecycle =
  | Readonly<{ status: "checking" }>
  | (Readonly<{ status: "authenticated" }> & AuthSessionProjection)
  | Readonly<{ status: "unauthenticated" }>
  | Readonly<{ status: "expired" }>
  | Readonly<{
      status: "recoverable-error";
      reason: "network" | "rate-limited" | "timeout" | "unexpected";
    }>
  | Readonly<{
      status: "api-unavailable";
      reason: "disabled" | "invalid-response" | "server";
    }>
  | Readonly<{ status: "forbidden" }>;

type AuthSessionRefreshRejectionReason =
  "inactive" | "invalid" | "expired" | "reused" | "revoked";

type AuthSessionRefreshResult =
  | Readonly<{ kind: "refreshed"; snapshot: AuthSessionSnapshot }>
  | Readonly<{
      kind: "rejected";
      reason: AuthSessionRefreshRejectionReason;
    }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "rate-limited" }>
  | Readonly<{
      kind: "temporarily-unavailable";
      cause: "network" | "timeout" | "unexpected";
    }>
  | Readonly<{
      kind: "unavailable";
      cause: "disabled" | "invalid-response" | "server";
    }>;

export type {
  AuthenticatedAccountSummary,
  AuthSessionLifecycle,
  AuthSessionProjection,
  AuthSessionRefreshRejectionReason,
  AuthSessionRefreshResult,
  AuthSessionSnapshot,
  AuthSessionSummary,
};
