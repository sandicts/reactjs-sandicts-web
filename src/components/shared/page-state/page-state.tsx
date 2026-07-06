import { cn } from "@/lib/utils";
import type { PageStateProps, PageStateTone } from "./page-state.types";

const pageStateToneClasses: Record<PageStateTone, string> = {
  neutral: "border-border bg-card text-muted-foreground",
  info: "border-info/30 bg-info/10 text-info",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

function getAnnouncementProps(announcement: PageStateProps["announcement"]) {
  if (announcement === "assertive") {
    return { role: "alert" as const };
  }

  if (announcement === "polite") {
    return { role: "status" as const };
  }

  return {};
}

function PageState({
  announcement,
  className,
  description,
  eyebrow,
  headingLevel,
  Icon,
  primaryAction,
  secondaryAction,
  title,
  tone = "neutral",
}: PageStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section
      data-slot="page-state"
      data-tone={tone}
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-12 text-center sm:px-8",
        className,
      )}
      {...getAnnouncementProps(announcement)}
    >
      {Icon && (
        <div
          className={cn(
            "mb-6 flex size-14 items-center justify-center rounded-2xl border",
            pageStateToneClasses[tone],
          )}
        >
          <Icon className="size-7" aria-hidden="true" />
        </div>
      )}

      {eyebrow && (
        <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>
      )}

      <Heading className="text-3xl leading-tight font-semibold text-balance sm:text-4xl">
        {title}
      </Heading>

      <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </section>
  );
}

export { PageState };
