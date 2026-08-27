const APP_ROUTES = {
  public: {
    home: "/",
    discovery: "/discovery",
    signIn: "/sign-in",
    magicLinkCallback: "/sign-in/magic-link",
  },
  player: {
    legacyHome: "/player",
    home: "/app",
    courts: "/app/courts",
    reservations: "/app/reservations",
    openMatches: "/app/open-matches",
    profile: "/app/profile",
  },
} as const;

function createOrganizationRoutes(organizationSlug: string) {
  const root = `/organizations/${organizationSlug}`;

  return {
    root,
    calendar: `${root}/calendar`,
    availability: `${root}/calendar/configuration`,
    reservations: `${root}/reservations`,
    units: `${root}/units`,
    courts: `${root}/courts`,
    payments: `${root}/payments`,
    profile: `${root}/profile`,
    members: `${root}/settings/members`,
  } as const;
}

export { APP_ROUTES, createOrganizationRoutes };
