import type {
  OrganizationNavigationLabels,
  PlayerNavigationLabels,
} from "@/components/shared/app-shell/navigation/navigation.constants";

const PLAYER_NAVIGATION_LABELS = {
  courts: "Explorar",
  group: "Player",
  home: "Início",
  openMatches: "Partidas",
  profile: "Perfil",
  reservations: "Reservas",
} satisfies PlayerNavigationLabels;

const ORGANIZATION_NAVIGATION_LABELS = {
  availability: "Disponibilidade",
  calendar: "Agenda",
  courts: "Quadras",
  dashboard: "Painel",
  managementGroup: "Gestão",
  members: "Membros",
  operationGroup: "Operação",
  overviewGroup: "Visão geral",
  payments: "Pagamentos",
  profile: "Perfil da organização",
  reservations: "Reservas",
  units: "Unidades",
} satisfies OrganizationNavigationLabels;

export { ORGANIZATION_NAVIGATION_LABELS, PLAYER_NAVIGATION_LABELS };
