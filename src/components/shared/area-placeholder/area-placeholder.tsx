import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { areaPlaceholderStyles } from "./area-placeholder.styles";
import type { AreaPlaceholderProps } from "./area-placeholder.types";

export function AreaPlaceholder({
  eyebrow,
  title,
  description,
  Icon,
}: AreaPlaceholderProps) {
  const t = useTranslations("Common");

  return (
    <main id="shell-main" className={areaPlaceholderStyles.root}>
      <div className={areaPlaceholderStyles.container}>
        <Button
          asChild
          variant="outline"
          className={areaPlaceholderStyles.backButton}
        >
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            {t("backToSandicts")}
          </Link>
        </Button>

        <section className={areaPlaceholderStyles.content}>
          <div>
            <p className={areaPlaceholderStyles.eyebrow}>{eyebrow}</p>
            <h1 className={areaPlaceholderStyles.title}>{title}</h1>
            <p className={areaPlaceholderStyles.description}>{description}</p>
          </div>
          <Card className={areaPlaceholderStyles.iconCard}>
            <Icon className={areaPlaceholderStyles.icon} aria-hidden="true" />
          </Card>
        </section>
      </div>
    </main>
  );
}
