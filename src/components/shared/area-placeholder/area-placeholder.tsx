import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AreaPlaceholderProps } from "./area-placeholder.types";

export function AreaPlaceholder({
  eyebrow,
  title,
  description,
  Icon,
}: AreaPlaceholderProps) {
  const t = useTranslations("Common");

  return (
    <main
      id="shell-main"
      className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">
        <Button
          asChild
          variant="outline"
          className="mb-10 w-fit text-muted-foreground"
        >
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            {t("backToSandicts")}
          </Link>
        </Button>

        <section className="grid flex-1 content-center gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-4 text-sm font-medium text-primary">{eyebrow}</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          </div>
          <Card className="flex h-64 items-center justify-center py-0 shadow-none">
            <Icon className="size-16 text-success" aria-hidden="true" />
          </Card>
        </section>
      </div>
    </main>
  );
}
