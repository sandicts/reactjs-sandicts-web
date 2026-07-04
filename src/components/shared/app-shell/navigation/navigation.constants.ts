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

const PLAYER_NAVIGATION_GROUPS = [
  {
    id: "player",
    label: "Player",
    items: [
      {
        id: "home",
        label: "Início",
        href: APP_ROUTES.player.home,
        Icon: House,
        match: "exact",
      },
      {
        id: "courts",
        label: "Explorar",
        href: APP_ROUTES.player.courts,
        Icon: Search,
      },
      {
        id: "reservations",
        label: "Reservas",
        href: APP_ROUTES.player.reservations,
        Icon: CalendarCheck2,
      },
      {
        id: "open-matches",
        label: "Partidas",
        href: APP_ROUTES.player.openMatches,
        Icon: UsersRound,
      },
      {
        id: "profile",
        label: "Perfil",
        href: APP_ROUTES.player.profile,
        Icon: UserRound,
      },
    ],
  },
] as const satisfies readonly ShellNavigationGroup[];

function createOrganizationNavigationGroups(
  organizationSlug: string,
  capabilities: OrganizationNavigationCapabilities = {},
): readonly ShellNavigationGroup[] {
  const routes = createOrganizationRoutes(organizationSlug);

  return [
    {
      id: "overview",
      label: "Visão geral",
      items: [
        {
          id: "dashboard",
          label: "Painel",
          href: routes.root,
          Icon: LayoutDashboard,
          match: "exact",
        },
        {
          id: "calendar",
          label: "Agenda",
          href: routes.calendar,
          Icon: CalendarRange,
        },
        {
          id: "reservations",
          label: "Reservas",
          href: routes.reservations,
          Icon: CalendarCheck2,
        },
      ],
    },
    {
      id: "operation",
      label: "Operação",
      items: [
        ...(capabilities.units
          ? [
              {
                id: "units",
                label: "Unidades",
                href: routes.units,
                Icon: Building2,
              },
            ]
          : []),
        {
          id: "courts",
          label: "Quadras",
          href: routes.courts,
          Icon: MapPin,
        },
        {
          id: "availability",
          label: "Disponibilidade",
          href: routes.availability,
          Icon: Clock3,
        },
        {
          id: "payments",
          label: "Pagamentos",
          href: routes.payments,
          Icon: CreditCard,
        },
      ],
    },
    {
      id: "management",
      label: "Gestão",
      items: [
        {
          id: "profile",
          label: "Perfil da organização",
          href: routes.profile,
          Icon: Building2,
        },
        ...(capabilities.members
          ? [
              {
                id: "members",
                label: "Membros",
                href: routes.members,
                Icon: UsersRound,
              },
            ]
          : []),
      ],
    },
  ] satisfies readonly ShellNavigationGroup[];
}

export { createOrganizationNavigationGroups, PLAYER_NAVIGATION_GROUPS };
