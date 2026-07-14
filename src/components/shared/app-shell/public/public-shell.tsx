import { Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import { publicShellStyles } from "./public-shell.styles";
import type { PublicShellProps } from "./public-shell.types";

function PublicShell({ children }: PublicShellProps) {
  const t = useTranslations("PublicShell");

  return (
    <div className={publicShellStyles.root}>
      <SkipLink />
      <header className={publicShellStyles.header}>
        <div className={publicShellStyles.headerContent}>
          <BrandLink />
          <nav
            className={publicShellStyles.navigation}
            aria-label={t("ariaLabel")}
          >
            <Button asChild variant="ghost" size="sm">
              <Link href={APP_ROUTES.public.discovery}>
                <Search aria-hidden="true" />
                <span className={publicShellStyles.exploreText}>
                  {t("explore")}
                </span>
                <span className={publicShellStyles.exploreTextMobile}>
                  {t("exploreCourts")}
                </span>
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={APP_ROUTES.public.signIn}>{t("signIn")}</Link>
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export { PublicShell };
