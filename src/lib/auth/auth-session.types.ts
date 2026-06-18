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

export type {
  AuthenticatedAccountSummary,
  AuthSessionSnapshot,
  AuthSessionSummary,
};
