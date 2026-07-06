"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AppContextKind } from "./app-context.types";
import type { ContextSwitcherProps } from "./context-switcher.types";

const contextKindOrder: readonly AppContextKind[] = [
  "player",
  "organization",
  "academy",
  "admin",
];

function ContextSwitcher({ contexts }: ContextSwitcherProps) {
  const commonT = useTranslations("Common");
  const t = useTranslations("ContextSwitcher");
  const currentContext =
    contexts.find((context) => context.current) ?? contexts[0];
  const contextKindLabels: Record<AppContextKind, string> = {
    player: t("playerGroup"),
    organization: t("organizationGroup"),
    academy: t("academyGroup"),
    admin: t("adminGroup"),
  };

  if (!currentContext) {
    return null;
  }

  if (contexts.length === 1) {
    return (
      <div
        className="min-w-0 rounded-lg border border-border/70 bg-card px-3 py-2 text-right"
        data-context-switcher="single"
      >
        <span className="block text-xs text-muted-foreground">
          {t("currentContext")}
        </span>
        <strong className="block truncate text-sm font-medium">
          {currentContext.label}
        </strong>
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-w-0 justify-between gap-3 px-3 py-2"
          aria-label={t("triggerLabel", { context: currentContext.label })}
        >
          <span className="min-w-0 text-left">
            <span className="block text-xs font-normal text-muted-foreground">
              {t("currentContext")}
            </span>
            <strong className="block truncate text-sm font-medium">
              {currentContext.label}
            </strong>
          </span>
          <ChevronsUpDown className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeLabel={commonT("close")}
        side="bottom"
        className="mx-auto max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-5 pb-6">
          {contextKindOrder.map((kind) => {
            const options = contexts.filter((context) => context.kind === kind);

            if (options.length === 0) {
              return null;
            }

            return (
              <section key={kind} className="mt-5 first:mt-0">
                <h2 className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {contextKindLabels[kind]}
                </h2>
                <div className="grid gap-2">
                  {options.map((context) => (
                    <SheetClose asChild key={context.id}>
                      <Link
                        href={context.homeHref}
                        className="flex min-h-14 items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 outline-none transition hover:border-primary/70 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        aria-current={context.current ? "page" : undefined}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                          {context.label.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-sm">
                            {context.label}
                          </strong>
                          {context.detail ? (
                            <span className="block truncate text-xs text-muted-foreground">
                              {context.detail}
                            </span>
                          ) : null}
                        </span>
                        {context.current ? (
                          <Check
                            className="size-5 text-success"
                            aria-label={t("currentContext")}
                          />
                        ) : null}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { ContextSwitcher };
