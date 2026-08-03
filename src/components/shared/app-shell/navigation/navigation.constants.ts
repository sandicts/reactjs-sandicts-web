import {
  BuildingsIcon,
  CalendarCheckIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SquaresFourIcon,
  UserCircleIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
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
          Icon: HouseIcon,
          match: "exact",
        },
        {
          id: "courts",
          label: labels.courts,
          href: APP_ROUTES.player.courts,
          Icon: MagnifyingGlassIcon,
        },
        {
          id: "reservations",
          label: labels.reservations,
          href: APP_ROUTES.player.reservations,
          Icon: CalendarCheckIcon,
        },
        {
          id: "open-matches",
          label: labels.openMatches,
          href: APP_ROUTES.player.openMatches,
          Icon: UsersThreeIcon,
        },
        {
          id: "profile",
          label: labels.profile,
          href: APP_ROUTES.player.profile,
          Icon: UserCircleIcon,
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
          Icon: SquaresFourIcon,
          match: "exact",
        },
        {
          id: "calendar",
          label: labels.calendar,
          href: routes.calendar,
          Icon: CalendarIcon,
        },
        {
          id: "reservations",
          label: labels.reservations,
          href: routes.reservations,
          Icon: CalendarCheckIcon,
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
                Icon: BuildingsIcon,
              },
            ]
          : []),
        {
          id: "courts",
          label: labels.courts,
          href: routes.courts,
          Icon: MapPinIcon,
        },
        {
          id: "availability",
          label: labels.availability,
          href: routes.availability,
          Icon: ClockIcon,
        },
        {
          id: "payments",
          label: labels.payments,
          href: routes.payments,
          Icon: CreditCardIcon,
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
          Icon: BuildingsIcon,
        },
        ...(capabilities.members
          ? [
              {
                id: "members",
                label: labels.members,
                href: routes.members,
                Icon: UsersThreeIcon,
              },
            ]
          : []),
      ],
    },
  ] satisfies readonly ShellNavigationGroup[];
}

export { createOrganizationNavigationGroups, createPlayerNavigationGroups };
export type { OrganizationNavigationLabels, PlayerNavigationLabels };
