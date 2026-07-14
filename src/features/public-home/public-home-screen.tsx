import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PUBLIC_HOME_ACTIONS,
  PUBLIC_HOME_SIGNALS,
} from "./public-home.constants";

function PublicHomeScreen() {
  const t = useTranslations("PublicHome");

  return (
    <main id="shell-main" className="min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl content-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <section className="flex max-w-3xl flex-col justify-center">
          <Badge
            variant="outline"
            className="mb-4 w-fit gap-2 px-3 py-2 text-sm text-muted-foreground"
          >
            <Trophy className="text-primary" aria-hidden="true" />
            {t("badge")}
          </Badge>
          <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("description")}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PUBLIC_HOME_ACTIONS.map(({ id, href, Icon }) => (
              <Link
                key={id}
                href={href}
                className="group rounded-xl border border-border bg-card p-4 transition outline-none hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-secondary text-success">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">
                    {t(`actions.${id}.label`)}
                  </h2>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(`actions.${id}.detail`)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <aside className="self-center">
          <Card className="gap-0 overflow-hidden py-0">
            <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border/70 p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("cardEyebrow")}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {t("cardTitle")}
                </h2>
              </div>
              <ShieldCheck className="size-7 text-success" aria-hidden="true" />
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <Alert variant="success">
                <ShieldCheck aria-hidden="true" />
                <AlertTitle>{t("cardStatus")}</AlertTitle>
                <AlertDescription>{t("cardDescription")}</AlertDescription>
              </Alert>
              {PUBLIC_HOME_SIGNALS.map(({ id }) => (
                <div
                  key={id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/70 p-4"
                >
                  <span className="text-sm text-muted-foreground">
                    {t(`signals.${id}.label`)}
                  </span>
                  <strong className="max-w-52 text-right text-sm leading-6 font-medium">
                    {t(`signals.${id}.value`)}
                  </strong>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

export { PublicHomeScreen };
