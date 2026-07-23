import { APP_ROUTES } from "./app-routes";

type RouteAccess = "protected" | "public" | "unknown";
type GoogleOneTapEligibility = "eligible" | "ineligible";
type KnownRouteAccess = Exclude<RouteAccess, "unknown">;

type RouteMatcher = Readonly<{
  includeDescendants: boolean;
  pattern: string;
}>;

type RouteAccessPolicy = Readonly<{
  access: KnownRouteAccess;
  googleOneTap: GoogleOneTapEligibility;
  id: string;
  matcher: RouteMatcher;
}>;

type ResolvedRouteAccessPolicy = Readonly<{
  access: RouteAccess;
  googleOneTap: GoogleOneTapEligibility;
  id: string;
}>;

const ROUTE_ACCESS_POLICIES = [
  {
    access: "public",
    googleOneTap: "eligible",
    id: "public-home",
    matcher: {
      includeDescendants: false,
      pattern: APP_ROUTES.public.home,
    },
  },
  {
    access: "public",
    googleOneTap: "eligible",
    id: "public-discovery-home",
    matcher: {
      includeDescendants: false,
      pattern: APP_ROUTES.public.discovery,
    },
  },
  {
    access: "public",
    googleOneTap: "eligible",
    id: "public-sign-in",
    matcher: {
      includeDescendants: false,
      pattern: APP_ROUTES.public.signIn,
    },
  },
  {
    access: "protected",
    googleOneTap: "ineligible",
    id: "player-legacy-redirect",
    matcher: {
      includeDescendants: false,
      pattern: APP_ROUTES.player.legacyHome,
    },
  },
  {
    access: "protected",
    googleOneTap: "ineligible",
    id: "player-app",
    matcher: {
      includeDescendants: true,
      pattern: APP_ROUTES.player.home,
    },
  },
  {
    access: "protected",
    googleOneTap: "ineligible",
    id: "organization-app",
    matcher: {
      includeDescendants: true,
      pattern: "/organizations/:organizationSlug",
    },
  },
] as const satisfies readonly RouteAccessPolicy[];

const UNKNOWN_ROUTE_ACCESS_POLICY = {
  access: "unknown",
  googleOneTap: "ineligible",
  id: "unknown",
} as const satisfies ResolvedRouteAccessPolicy;

function resolveRouteAccessPolicy(pathname: string): ResolvedRouteAccessPolicy {
  const normalizedPathname = normalizePathname(pathname);

  if (!normalizedPathname) {
    return UNKNOWN_ROUTE_ACCESS_POLICY;
  }

  const policy = ROUTE_ACCESS_POLICIES.find(({ matcher }) =>
    matchesRoute(matcher, normalizedPathname),
  );

  if (!policy) {
    return UNKNOWN_ROUTE_ACCESS_POLICY;
  }

  return {
    access: policy.access,
    googleOneTap: policy.googleOneTap,
    id: policy.id,
  };
}

function isGoogleOneTapEligibleRoute(pathname: string) {
  return resolveRouteAccessPolicy(pathname).googleOneTap === "eligible";
}

function matchesRoute(matcher: RouteMatcher, pathname: string) {
  const patternSegments = splitPathSegments(matcher.pattern);
  const pathnameSegments = splitPathSegments(pathname);

  if (
    matcher.includeDescendants
      ? pathnameSegments.length < patternSegments.length
      : pathnameSegments.length !== patternSegments.length
  ) {
    return false;
  }

  return patternSegments.every((patternSegment, index) => {
    const pathnameSegment = pathnameSegments[index];

    return patternSegment.startsWith(":")
      ? Boolean(pathnameSegment)
      : patternSegment === pathnameSegment;
  });
}

function normalizePathname(pathname: string) {
  const [pathWithoutQueryOrHash] = pathname.trim().split(/[?#]/, 1);

  if (!pathWithoutQueryOrHash?.startsWith("/")) {
    return null;
  }

  return pathWithoutQueryOrHash === "/"
    ? pathWithoutQueryOrHash
    : pathWithoutQueryOrHash.replace(/\/+$/, "");
}

function splitPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

export {
  isGoogleOneTapEligibleRoute,
  resolveRouteAccessPolicy,
  ROUTE_ACCESS_POLICIES,
};
export type {
  GoogleOneTapEligibility,
  ResolvedRouteAccessPolicy,
  RouteAccess,
  RouteAccessPolicy,
};
