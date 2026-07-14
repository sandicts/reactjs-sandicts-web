const publicShellStyles = {
  root: "min-h-screen bg-background text-foreground",
  header: "border-b border-border/80 bg-background/95 backdrop-blur-sm",
  headerContent:
    "mx-auto flex min-h-18 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8",
  navigation: "ml-auto flex items-center gap-1 sm:gap-2",
  exploreText: "hidden sm:inline",
  exploreTextMobile: "sr-only sm:hidden",
} as const;

export { publicShellStyles };
