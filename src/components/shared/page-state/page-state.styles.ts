import type { PageStateTone } from "./page-state.types";

const pageStateToneClasses: Record<PageStateTone, string> = {
  neutral: "border-border bg-card text-muted-foreground",
  info: "border-info-border bg-info-subtle text-info",
  success: "border-success-border bg-success-subtle text-success",
  warning: "border-warning-border bg-warning-subtle text-warning",
  destructive:
    "border-destructive-border bg-destructive-subtle text-destructive",
};

const pageStateStyles = {
  root: "mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-12 text-center sm:px-8",
  iconContainer:
    "mb-6 flex size-14 items-center justify-center rounded-2xl border",
  icon: "size-7",
  eyebrow: "mb-3 text-sm font-medium text-primary",
  heading: "text-3xl leading-tight font-semibold text-balance sm:text-4xl",
  description: "mt-4 max-w-xl text-base leading-7 text-muted-foreground",
  actions:
    "mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row",
} as const;

export { pageStateStyles, pageStateToneClasses };
