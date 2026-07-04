import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import { APP_ROUTES } from "@/lib/routes/app-routes";

const PUBLIC_HOME_ACTIONS = [
  {
    href: APP_ROUTES.public.discovery,
    label: "Encontrar uma quadra",
    detail: "Busque por esporte, horário e localização.",
    Icon: MapPin,
  },
  {
    href: APP_ROUTES.player.openMatches,
    label: "Entrar em uma partida",
    detail: "Encontre partidas abertas para jogar.",
    Icon: UsersRound,
  },
  {
    href: "/organizations/sandicts-demo",
    label: "Operar a agenda",
    detail: "Acesse quadras, reservas e disponibilidade.",
    Icon: CalendarDays,
  },
] as const;

const PUBLIC_HOME_SIGNALS = [
  {
    label: "Foco do MVP",
    value: "Quadras, reservas e partidas abertas",
  },
  {
    label: "Backend",
    value: "A API Nest permanece como fonte de verdade",
  },
  {
    label: "Frontend",
    value: "Next.js com shells adaptáveis por contexto",
  },
] as const;

export { PUBLIC_HOME_ACTIONS, PUBLIC_HOME_SIGNALS };
