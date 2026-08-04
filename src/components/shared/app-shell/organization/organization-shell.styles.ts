import { cn } from "@/lib/utils";

const organizationShellStyles = {
  root: cn(
    "min-h-screen bg-background text-foreground md:grid",
    "md:grid-cols-[5rem_minmax(0,1fr)]",
    "lg:grid-cols-[18rem_minmax(0,1fr)]",
  ),
  sidebar: cn(
    "sticky top-0 hidden h-screen border-r border-sidebar-border",
    "bg-sidebar/80 text-sidebar-foreground",
    "supports-backdrop-filter:backdrop-blur-2xl md:flex md:flex-col",
  ),
  sidebarBrand: cn(
    "flex min-h-20 items-center justify-center border-b border-border px-3",
    "lg:justify-start lg:px-6",
    "[&_span]:sr-only lg:[&_span]:not-sr-only",
  ),
  content: "min-w-0",
  mobileMenuTrigger: "md:hidden",
  drawerContent: cn(
    "overflow-y-auto bg-sidebar/85 text-sidebar-foreground",
    "supports-backdrop-filter:backdrop-blur-2xl",
  ),
} as const;

export { organizationShellStyles };
