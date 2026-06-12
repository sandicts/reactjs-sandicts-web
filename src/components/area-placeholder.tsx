import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";

type AreaPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export function AreaPlaceholder({
  eyebrow,
  title,
  description,
  Icon,
}: AreaPlaceholderProps) {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">
        <Link
          href="/"
          className="mb-10 flex w-fit items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Sandicts
        </Link>

        <section className="grid flex-1 content-center gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-4 text-sm font-medium text-sand">{eyebrow}</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              {description}
            </p>
          </div>
          <div className="flex h-64 items-center justify-center rounded-lg border border-line bg-surface">
            <Icon className="h-16 w-16 text-mint" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}
