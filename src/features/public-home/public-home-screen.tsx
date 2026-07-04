import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PUBLIC_HOME_ACTIONS,
  PUBLIC_HOME_SIGNALS,
} from "./public-home.constants";

function PublicHomeScreen() {
  return (
    <main id="shell-main" className="min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl content-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <section className="flex max-w-3xl flex-col justify-center">
          <Badge
            variant="outline"
            className="mb-4 w-fit gap-2 px-3 py-2 text-sm text-muted-foreground"
          >
            <Trophy className="text-primary" aria-hidden="true" />
            Esportes de areia em um só lugar
          </Badge>
          <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl">
            Encontre quadras, partidas e gente para jogar.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Descubra espaços, organize sua próxima partida e acompanhe suas
            reservas sem perder o ritmo.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PUBLIC_HOME_ACTIONS.map(({ href, label, detail, Icon }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-xl border border-border bg-card p-4 outline-none transition hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-secondary text-success">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">{label}</h2>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {detail}
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
                  Fundação do aplicativo
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Pronta para evoluir
                </h2>
              </div>
              <ShieldCheck className="size-7 text-success" aria-hidden="true" />
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <Alert variant="success">
                <ShieldCheck aria-hidden="true" />
                <AlertTitle>Experiência consistente</AlertTitle>
                <AlertDescription>
                  Navegação responsiva e componentes acessíveis para cada
                  contexto.
                </AlertDescription>
              </Alert>
              {PUBLIC_HOME_SIGNALS.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/70 p-4"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <strong className="max-w-52 text-right text-sm leading-6 font-medium">
                    {value}
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
