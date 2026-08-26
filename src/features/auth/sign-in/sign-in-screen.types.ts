type SignInReason = "session-expired";

type SignInScreenProps = Readonly<{
  reason?: SignInReason;
  returnTo?: string;
}>;

type SignInSessionSurfaceProps = SignInScreenProps;

export type { SignInReason, SignInScreenProps, SignInSessionSurfaceProps };
