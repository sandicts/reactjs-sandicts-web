import { cn } from "@/lib/utils";

const playerShellStyles = {
  root: cn(
    "min-h-screen bg-background text-foreground md:grid",
    "md:grid-cols-[5rem_minmax(0,1fr)]",
    "lg:grid-cols-[17rem_minmax(0,1fr)]",
  ),
  sidebar:
    "sticky top-0 hidden h-screen border-r border-border bg-card/40 md:flex md:flex-col",
  sidebarBrand: cn(
    "flex min-h-20 items-center justify-center border-b border-border px-3",
    "lg:justify-start lg:px-6",
    "[&_span]:sr-only lg:[&_span]:not-sr-only",
  ),
  content: "min-w-0",
  main: "pb-24 md:pb-0",
} as const;

export { playerShellStyles };
