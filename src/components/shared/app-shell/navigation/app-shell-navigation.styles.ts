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
        "border-t border-sidebar-border bg-sidebar/75 text-sidebar-foreground",
        "supports-backdrop-filter:bg-sidebar/65 supports-backdrop-filter:backdrop-blur-2xl",
        "supports-backdrop-filter:backdrop-saturate-150",
        "px-[max(0.375rem,env(safe-area-inset-left))] pt-1.5",
        "pb-[calc(0.375rem+env(safe-area-inset-bottom))]",
        "shadow-2xl md:hidden",
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
      cn(
        "flex min-h-12 items-center gap-3 rounded-lg px-3",
        "text-sm font-medium text-muted-foreground",
      ),
    isCurrent &&
      cn(
        "bg-sidebar-accent text-sidebar-accent-foreground",
        "shadow-[inset_3px_0_0_var(--sidebar-primary)]",
      ),
    presentation === "bottom" &&
      isCurrent &&
      "bg-sidebar-accent text-sidebar-primary shadow-[inset_0_3px_0_var(--sidebar-primary)]",
    !isCurrent &&
      "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
  );
}

function getNavigationIconClassName(isCurrent: boolean) {
  return cn("size-5 shrink-0", isCurrent && "text-sidebar-primary");
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
