import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageState } from "@/components/shared/page-state/page-state";
import { PublicShell } from "@/components/shared/app-shell/public/public-shell";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/routes/app-routes";

export default function NotFound() {
  const t = useTranslations("Pages.notFound");

  return (
    <PublicShell>
      <main
        id="shell-main"
        className="grid min-h-[calc(100vh-4.5rem)] content-center px-4 py-12 sm:px-6"
      >
        <PageState
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
          headingLevel={1}
          Icon={FileQuestion}
          primaryAction={
            <Button asChild>
              <Link href={APP_ROUTES.public.discovery}>
                {t("primaryAction")}
              </Link>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="outline">
              <Link href={APP_ROUTES.public.home}>{t("secondaryAction")}</Link>
            </Button>
          }
        />
      </main>
    </PublicShell>
  );
}
