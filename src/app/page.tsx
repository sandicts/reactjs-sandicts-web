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
        <header className="flex items-center justify-between gap-4 border-b border-line/70 pb-5">
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
            <Link
              href="/player"
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground"
            >
              Player
            </Link>
            <Link
              href="/organizations/sandicts-demo"
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground"
            >
              Organization
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg bg-sand px-4 py-2 text-sm font-semibold text-sand-contrast transition hover:bg-sand-hover"
            >
              Sign in
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 content-center gap-8 py-10 lg:grid-cols-[1fr_420px]">
          <div className="flex max-w-3xl flex-col justify-center">
            <p className="mb-4 flex w-fit items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted">
              <Trophy className="h-4 w-4 text-sand" aria-hidden="true" />
              Sand sports marketplace
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Find courts. Join games. Keep the sand moving.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              The first Sandicts web app starts with player discovery, open
              matches, and Organization operations connected to the Nest API.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {actions.map(({ href, label, detail, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="group rounded-lg border border-line bg-surface p-4 transition hover:border-sand"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-mint">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{label}</h2>
                    <ArrowRight
                      className="h-4 w-4 text-muted transition group-hover:text-sand"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-line bg-surface p-5">
            <div className="flex items-center justify-between border-b border-line/70 pb-4">
              <div>
                <p className="text-sm text-muted">Foundation status</p>
                <h2 className="mt-1 text-2xl font-semibold">Ready to wire</h2>
              </div>
              <ShieldCheck className="h-7 w-7 text-mint" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-4">
              {signals.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 rounded-lg border border-line/70 p-4"
                >
                  <span className="text-sm text-muted">{label}</span>
                  <strong className="max-w-48 text-right text-sm font-medium leading-6">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
