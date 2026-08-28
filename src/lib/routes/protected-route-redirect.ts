import { APP_ROUTES } from "./app-routes";
import { resolveRouteAccessPolicy } from "./route-access-policy";
import { readSafeReturnTo } from "./safe-return-to";

type CreateProtectedRouteSignInHrefOptions = Readonly<{
  currentLocation: string;
  sessionExpired: boolean;
  webOrigin: URL;
}>;

function createProtectedRouteSignInHref({
  currentLocation,
  sessionExpired,
  webOrigin,
}: CreateProtectedRouteSignInHrefOptions) {
  const searchParams = new URLSearchParams();
  const returnTo = readSafeProtectedRouteReturnTo(currentLocation, webOrigin);

  if (sessionExpired) {
    searchParams.set("reason", "session-expired");
  }

  if (returnTo) {
    searchParams.set("returnTo", returnTo);
  }

  const serializedSearchParams = searchParams.toString();

  return serializedSearchParams
    ? `${APP_ROUTES.public.signIn}?${serializedSearchParams}`
    : APP_ROUTES.public.signIn;
}

function readSafeProtectedRouteReturnTo(
  value: string | null | undefined,
  webOrigin: URL,
) {
  const returnTo = readSafeReturnTo(value, webOrigin);

  if (!returnTo || resolveRouteAccessPolicy(returnTo).access !== "protected") {
    return null;
  }

  return returnTo;
}

export { createProtectedRouteSignInHref, readSafeProtectedRouteReturnTo };
export type { CreateProtectedRouteSignInHrefOptions };
