import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { PublicHomeActionCard } from "./components/public-home-action-card";
import { PublicHomeStatusCard } from "./components/public-home-status-card";
import {
  PUBLIC_HOME_ACTIONS,
  PUBLIC_HOME_SIGNALS,
} from "./public-home.constants";
import { publicHomeScreenStyles } from "./public-home-screen.styles";
import type {
  PublicHomeAction,
  PublicHomeSignal,
} from "./public-home-screen.types";

function PublicHomeScreen() {
  const t = useTranslations("PublicHome");
  const actions: PublicHomeAction[] = PUBLIC_HOME_ACTIONS.map(
    ({ id, href, Icon }) => ({
      id,
      href,
      Icon,
      label: t(`actions.${id}.label`),
      detail: t(`actions.${id}.detail`),
    }),
  );
  const signals: PublicHomeSignal[] = PUBLIC_HOME_SIGNALS.map(({ id }) => ({
    id,
    label: t(`signals.${id}.label`),
    value: t(`signals.${id}.value`),
  }));

  return (
    <main id="shell-main" className={publicHomeScreenStyles.root}>
      <div className={publicHomeScreenStyles.container}>
        <section className={publicHomeScreenStyles.hero}>
          <Badge variant="outline" className={publicHomeScreenStyles.badge}>
            <Trophy
              className={publicHomeScreenStyles.badgeIcon}
              aria-hidden="true"
            />
            {t("badge")}
          </Badge>
          <h1 className={publicHomeScreenStyles.title}>{t("title")}</h1>
          <p className={publicHomeScreenStyles.description}>
            {t("description")}
          </p>
          <div className={publicHomeScreenStyles.actionsGrid}>
            {actions.map(({ id, ...action }) => (
              <PublicHomeActionCard
                key={id}
                href={action.href}
                Icon={action.Icon}
                label={action.label}
                detail={action.detail}
              />
            ))}
          </div>
        </section>

        <PublicHomeStatusCard
          eyebrow={t("cardEyebrow")}
          title={t("cardTitle")}
          status={t("cardStatus")}
          description={t("cardDescription")}
          signals={signals}
        />
      </div>
    </main>
  );
}

export { PublicHomeScreen };
