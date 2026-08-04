import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandLink } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { SkipLink } from "../chrome/skip-link";
import { publicShellStyles } from "./public-shell.styles";
import type { PublicShellProps } from "./public-shell.types";
import { PublicAuthAction } from "./public-auth-action";

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
                <MagnifyingGlassIcon aria-hidden="true" />
                <span className={publicShellStyles.exploreText}>
                  {t("explore")}
                </span>
                <span className={publicShellStyles.exploreTextMobile}>
                  {t("exploreCourts")}
                </span>
              </Link>
            </Button>
            <PublicAuthAction />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export { PublicShell };
