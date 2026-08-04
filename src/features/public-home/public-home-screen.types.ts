import type {
  PUBLIC_HOME_ACTIONS,
  PUBLIC_HOME_SIGNALS,
} from "./public-home.constants";

type PublicHomeAction = Readonly<{
  id: (typeof PUBLIC_HOME_ACTIONS)[number]["id"];
  href: (typeof PUBLIC_HOME_ACTIONS)[number]["href"];
  Icon: (typeof PUBLIC_HOME_ACTIONS)[number]["Icon"];
  label: string;
  detail: string;
}>;

type PublicHomeSignal = Readonly<{
  id: (typeof PUBLIC_HOME_SIGNALS)[number]["id"];
  label: string;
  value: string;
}>;

type PublicHomeStatusCardProps = Readonly<{
  eyebrow: string;
  title: string;
  status: string;
  description: string;
  signals: readonly PublicHomeSignal[];
}>;

export type { PublicHomeAction, PublicHomeSignal, PublicHomeStatusCardProps };
