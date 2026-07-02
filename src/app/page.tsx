import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const actions = [
  {
    href: "/player",
    label: "Find a court",
    detail: "Search by sport, time, and price.",
    Icon: MapPin,
  },
  {
    href: "/player",
    label: "Join a match",
    detail: "Open matches for sand athletes.",
    Icon: UsersRound,
  },
  {
    href: "/organizations/sandicts-demo",
    label: "Run the agenda",
    detail: "Slots, reservations, and payments.",
    Icon: CalendarDays,
  },
];

const signals = [
  ["MVP focus", "Courts, reservations, open matches"],
  ["Backend", "Nest API remains the system of record"],
  ["Frontend", "Next.js app running as a sibling repo"],
];

const sandictsMarkSizePx = 44;

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-border/70 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/sandicts-mark.svg"
              alt="Sandicts mark"
              width={sandictsMarkSizePx}
              height={sandictsMarkSizePx}
              priority
            />
            <span className="text-xl font-semibold">Sandicts</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/player">Player</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/organizations/sandicts-demo">Organization</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </nav>
        </header>

        <section className="grid flex-1 content-center gap-8 py-10 lg:grid-cols-[1fr_420px]">
          <div className="flex max-w-3xl flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-4 gap-2 px-3 py-2 text-sm text-muted-foreground"
            >
              <Trophy className="text-primary" aria-hidden="true" />
              Sand sports marketplace
            </Badge>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Find courts. Join games. Keep the sand moving.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              The first Sandicts web app starts with player discovery, open
              matches, and Organization operations connected to the Nest API.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {actions.map(({ href, label, detail, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="group rounded-xl border border-border bg-card p-4 transition outline-none hover:border-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
          </div>

          <aside>
            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border/70 p-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Foundation status
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">Ready to wire</h2>
                </div>
                <ShieldCheck
                  className="size-7 text-success"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <Alert variant="success">
                  <ShieldCheck aria-hidden="true" />
                  <AlertTitle>UI foundation aligned</AlertTitle>
                  <AlertDescription>
                    Semantic tokens and accessible primitives are ready for
                    feature work.
                  </AlertDescription>
                </Alert>
                {signals.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border/70 p-4"
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                    <strong className="max-w-48 text-right text-sm font-medium leading-6">
                      {value}
                    </strong>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
