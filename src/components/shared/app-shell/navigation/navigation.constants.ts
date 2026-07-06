import {
  Building2,
  CalendarCheck2,
  CalendarRange,
  Clock3,
  CreditCard,
  House,
  LayoutDashboard,
  MapPin,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import { APP_ROUTES, createOrganizationRoutes } from "@/lib/routes/app-routes";
import type {
  OrganizationNavigationCapabilities,
  ShellNavigationGroup,
} from "./navigation.types";

type PlayerNavigationLabels = Readonly<{
  courts: string;
  group: string;
  home: string;
  openMatches: string;
  profile: string;
  reservations: string;
}>;

type OrganizationNavigationLabels = Readonly<{
  availability: string;
  calendar: string;
  courts: string;
  dashboard: string;
  managementGroup: string;
  members: string;
  operationGroup: string;
  overviewGroup: string;
  payments: string;
  profile: string;
  reservations: string;
  units: string;
}>;

function createPlayerNavigationGroups(
  labels: PlayerNavigationLabels,
): readonly ShellNavigationGroup[] {
  return [
    {
      id: "player",
      label: labels.group,
      items: [
        {
          id: "home",
          label: labels.home,
          href: APP_ROUTES.player.home,
          Icon: House,
          match: "exact",
        },
        {
          id: "courts",
          label: labels.courts,
          href: APP_ROUTES.player.courts,
          Icon: Search,
        },
        {
          id: "reservations",
          label: labels.reservations,
          href: APP_ROUTES.player.reservations,
          Icon: CalendarCheck2,
        },
        {
          id: "open-matches",
          label: labels.openMatches,
          href: APP_ROUTES.player.openMatches,
          Icon: UsersRound,
        },
        {
          id: "profile",
          label: labels.profile,
          href: APP_ROUTES.player.profile,
          Icon: UserRound,
        },
      ],
    },
  ];
}

function createOrganizationNavigationGroups(
  organizationSlug: string,
  labels: OrganizationNavigationLabels,
  capabilities: OrganizationNavigationCapabilities = {},
): readonly ShellNavigationGroup[] {
  const routes = createOrganizationRoutes(organizationSlug);

  return [
    {
      id: "overview",
      label: labels.overviewGroup,
      items: [
        {
          id: "dashboard",
          label: labels.dashboard,
          href: routes.root,
          Icon: LayoutDashboard,
          match: "exact",
        },
        {
          id: "calendar",
          label: labels.calendar,
          href: routes.calendar,
          Icon: CalendarRange,
        },
        {
          id: "reservations",
          label: labels.reservations,
          href: routes.reservations,
          Icon: CalendarCheck2,
        },
      ],
    },
    {
      id: "operation",
      label: labels.operationGroup,
      items: [
        ...(capabilities.units
          ? [
              {
                id: "units",
                label: labels.units,
                href: routes.units,
                Icon: Building2,
              },
            ]
          : []),
        {
          id: "courts",
          label: labels.courts,
          href: routes.courts,
          Icon: MapPin,
        },
        {
          id: "availability",
          label: labels.availability,
          href: routes.availability,
          Icon: Clock3,
        },
        {
          id: "payments",
          label: labels.payments,
          href: routes.payments,
          Icon: CreditCard,
        },
      ],
    },
    {
      id: "management",
      label: labels.managementGroup,
      items: [
        {
          id: "profile",
          label: labels.profile,
          href: routes.profile,
          Icon: Building2,
        },
        ...(capabilities.members
          ? [
              {
                id: "members",
                label: labels.members,
                href: routes.members,
                Icon: UsersRound,
              },
            ]
          : []),
      ],
    },
  ] satisfies readonly ShellNavigationGroup[];
}

export { createOrganizationNavigationGroups, createPlayerNavigationGroups };
export type { OrganizationNavigationLabels, PlayerNavigationLabels };
