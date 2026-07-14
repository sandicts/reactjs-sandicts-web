import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { publicHomeScreenStyles } from "../public-home-screen.styles";
import type { PublicHomeActionCardProps } from "./public-home-action-card.types";

function PublicHomeActionCard({
  href,
  Icon,
  label,
  detail,
}: PublicHomeActionCardProps) {
  return (
    <Link href={href} className={publicHomeScreenStyles.actionCard.root}>
      <div className={publicHomeScreenStyles.actionCard.iconContainer}>
        <Icon
          className={publicHomeScreenStyles.actionCard.icon}
          aria-hidden="true"
        />
      </div>
      <div className={publicHomeScreenStyles.actionCard.headingRow}>
        <h2 className={publicHomeScreenStyles.actionCard.heading}>{label}</h2>
        <ArrowRight
          className={publicHomeScreenStyles.actionCard.arrow}
          aria-hidden="true"
        />
      </div>
      <p className={publicHomeScreenStyles.actionCard.detail}>{detail}</p>
    </Link>
  );
}

export { PublicHomeActionCard };
