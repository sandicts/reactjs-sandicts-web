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
import { CONTEXT_KIND_ORDER } from "./context-switcher.constants";
import { contextSwitcherStyles } from "./context-switcher.styles";
import type { ContextSwitcherProps } from "./context-switcher.types";
import {
  getContextInitials,
  getContextsByKind,
  getCurrentContext,
} from "./context-switcher.utils";

function ContextSwitcher({ contexts }: ContextSwitcherProps) {
  const commonT = useTranslations("Common");
  const t = useTranslations("ContextSwitcher");
  const currentContext = getCurrentContext(contexts);
  const contextKindLabels = {
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
        className={contextSwitcherStyles.singleContainer}
        data-context-switcher="single"
      >
        <span className={contextSwitcherStyles.singleEyebrow}>
          {t("currentContext")}
        </span>
        <strong className={contextSwitcherStyles.singleLabel}>
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
          className={contextSwitcherStyles.trigger}
          aria-label={t("triggerLabel", { context: currentContext.label })}
        >
          <span className={contextSwitcherStyles.triggerText}>
            <span className={contextSwitcherStyles.triggerEyebrow}>
              {t("currentContext")}
            </span>
            <strong className={contextSwitcherStyles.triggerLabel}>
              {currentContext.label}
            </strong>
          </span>
          <ChevronsUpDown
            className={contextSwitcherStyles.triggerIcon}
            aria-hidden="true"
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeLabel={commonT("close")}
        side="bottom"
        className={contextSwitcherStyles.sheetContent}
      >
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className={contextSwitcherStyles.content}>
          {CONTEXT_KIND_ORDER.map((kind) => {
            const options = getContextsByKind(contexts, kind);

            if (options.length === 0) {
              return null;
            }

            return (
              <section key={kind} className={contextSwitcherStyles.group}>
                <h2 className={contextSwitcherStyles.groupTitle}>
                  {contextKindLabels[kind]}
                </h2>
                <div className={contextSwitcherStyles.groupOptions}>
                  {options.map((context) => (
                    <SheetClose asChild key={context.id}>
                      <Link
                        href={context.homeHref}
                        className={contextSwitcherStyles.optionLink}
                        aria-current={context.current ? "page" : undefined}
                      >
                        <span className={contextSwitcherStyles.optionAvatar}>
                          {getContextInitials(context.label)}
                        </span>
                        <span className={contextSwitcherStyles.optionBody}>
                          <strong className={contextSwitcherStyles.optionLabel}>
                            {context.label}
                          </strong>
                          {context.detail ? (
                            <span
                              className={contextSwitcherStyles.optionDetail}
                            >
                              {context.detail}
                            </span>
                          ) : null}
                        </span>
                        {context.current ? (
                          <Check
                            className={contextSwitcherStyles.currentIcon}
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
