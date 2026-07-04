import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ShellNavigationProps } from "./navigation.types";
import { getActiveNavigationItem } from "./navigation.utils";

function AppShellNavigation({
  ariaLabel,
  groups,
  pathname,
  presentation,
  onNavigate,
}: ShellNavigationProps) {
  const activeItem = getActiveNavigationItem(pathname, groups);
  const isBottom = presentation === "bottom";
  const isAdaptive = presentation === "adaptive";

  return (
    <nav
      aria-label={ariaLabel}
      data-navigation-presentation={presentation}
      className={cn(
        isBottom &&
          "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-border bg-background/98 px-[max(0.375rem,env(safe-area-inset-left))] pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-12px_35px_rgba(0,0,0,0.28)] md:hidden",
        isAdaptive && "flex h-full flex-col gap-5 px-2 py-4 lg:px-4",
        presentation === "drawer" && "flex flex-col gap-6 px-5 pb-8",
      )}
    >
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={
            group.id === "player" ? undefined : `${presentation}-${group.id}`
          }
          className={cn(
            isBottom && "contents",
            isAdaptive && "grid gap-1.5",
            presentation === "drawer" && "grid gap-2",
          )}
        >
          {group.id === "player" ? null : (
            <h2
              id={`${presentation}-${group.id}`}
              className={cn(
                "text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase",
                isAdaptive && "sr-only lg:not-sr-only lg:px-3",
              )}
            >
              {group.label}
            </h2>
          )}
          <div
            className={cn(isBottom && "contents", !isBottom && "grid gap-1")}
          >
            {group.items.map((item) => {
              const isCurrent = activeItem?.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isCurrent ? "page" : undefined}
                  title={isAdaptive ? item.label : undefined}
                  className={cn(
                    "outline-none transition focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    isBottom &&
                      "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[0.68rem] font-medium text-muted-foreground",
                    isAdaptive &&
                      "flex min-h-12 items-center justify-center gap-3 rounded-lg px-3 text-muted-foreground lg:justify-start",
                    presentation === "drawer" &&
                      "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground",
                    isCurrent &&
                      "bg-accent text-foreground shadow-[inset_3px_0_0_var(--primary)]",
                    isBottom &&
                      isCurrent &&
                      "bg-secondary text-primary shadow-[inset_0_3px_0_var(--primary)]",
                    !isCurrent && "hover:bg-accent/70 hover:text-foreground",
                  )}
                >
                  <item.Icon
                    className={cn(
                      "size-5 shrink-0",
                      isCurrent && "text-primary",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "truncate",
                      isAdaptive && "sr-only lg:not-sr-only",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

export { AppShellNavigation };
