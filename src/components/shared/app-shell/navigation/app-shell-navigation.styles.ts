import { cn } from "@/lib/utils";
import type { ShellNavigationPresentation } from "./navigation.types";

type NavigationItemClassNameOptions = Readonly<{
  isCurrent: boolean;
  presentation: ShellNavigationPresentation;
}>;

function getNavigationRootClassName(presentation: ShellNavigationPresentation) {
  return cn(
    presentation === "bottom" &&
      cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1",
        "border-t border-border bg-background/98",
        "px-[max(0.375rem,env(safe-area-inset-left))] pt-1.5",
        "pb-[calc(0.375rem+env(safe-area-inset-bottom))]",
        "shadow-[0_-12px_35px_rgba(0,0,0,0.28)] md:hidden",
      ),
    presentation === "adaptive" &&
      "flex h-full flex-col gap-5 px-2 py-4 lg:px-4",
    presentation === "drawer" && "flex flex-col gap-6 px-5 pb-8",
  );
}

function getNavigationGroupClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    presentation === "bottom" && "contents",
    presentation === "adaptive" && "grid gap-1.5",
    presentation === "drawer" && "grid gap-2",
  );
}

function getNavigationGroupTitleClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    "text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase",
    presentation === "adaptive" && "sr-only lg:not-sr-only lg:px-3",
  );
}

function getNavigationItemsClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    presentation === "bottom" && "contents",
    presentation !== "bottom" && "grid gap-1",
  );
}

function getNavigationItemClassName({
  isCurrent,
  presentation,
}: NavigationItemClassNameOptions) {
  return cn(
    "transition outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    presentation === "bottom" &&
      cn(
        "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1",
        "rounded-lg px-1 py-1.5 text-[0.68rem] font-medium",
        "text-muted-foreground",
      ),
    presentation === "adaptive" &&
      cn(
        "flex min-h-12 items-center justify-center gap-3 rounded-lg px-3",
        "text-muted-foreground lg:justify-start",
      ),
    presentation === "drawer" &&
      "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground",
    isCurrent &&
      "bg-accent text-foreground shadow-[inset_3px_0_0_var(--primary)]",
    presentation === "bottom" &&
      isCurrent &&
      "bg-secondary text-primary shadow-[inset_0_3px_0_var(--primary)]",
    !isCurrent && "hover:bg-accent/70 hover:text-foreground",
  );
}

function getNavigationIconClassName(isCurrent: boolean) {
  return cn("size-5 shrink-0", isCurrent && "text-primary");
}

function getNavigationLabelClassName(
  presentation: ShellNavigationPresentation,
) {
  return cn(
    "truncate",
    presentation === "adaptive" && "sr-only lg:not-sr-only",
  );
}

export {
  getNavigationGroupClassName,
  getNavigationGroupTitleClassName,
  getNavigationIconClassName,
  getNavigationItemClassName,
  getNavigationItemsClassName,
  getNavigationLabelClassName,
  getNavigationRootClassName,
};
