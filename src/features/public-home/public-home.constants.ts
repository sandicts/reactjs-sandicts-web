import {
  CalendarDotsIcon,
  MapPinIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import { APP_ROUTES } from "@/lib/routes/app-routes";

const PUBLIC_HOME_ACTIONS = [
  {
    id: "courts",
    href: APP_ROUTES.public.discovery,
    Icon: MapPinIcon,
  },
  {
    id: "openMatches",
    href: APP_ROUTES.player.openMatches,
    Icon: UsersThreeIcon,
  },
  {
    id: "organization",
    href: "/organizations/sandicts-demo",
    Icon: CalendarDotsIcon,
  },
] as const;

const PUBLIC_HOME_SIGNALS = [
  {
    id: "mvp",
  },
  {
    id: "backend",
  },
  {
    id: "frontend",
  },
] as const;

export { PUBLIC_HOME_ACTIONS, PUBLIC_HOME_SIGNALS };
