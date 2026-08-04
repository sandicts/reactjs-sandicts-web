import { cn } from "@/lib/utils";

const publicShellStyles = {
  root: "min-h-screen bg-background text-foreground",
  header: cn(
    "border-b border-border bg-popover/70 text-popover-foreground",
    "supports-backdrop-filter:backdrop-blur-2xl",
    "supports-backdrop-filter:backdrop-saturate-150",
  ),
  headerContent:
    "mx-auto flex min-h-18 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8",
  navigation: "ml-auto flex items-center gap-1 sm:gap-2",
  exploreText: "hidden sm:inline",
  exploreTextMobile: "sr-only sm:hidden",
  authActionSkeleton: "h-8 w-16",
  sessionBadge: "max-w-44 truncate",
} as const;

export { publicShellStyles };
