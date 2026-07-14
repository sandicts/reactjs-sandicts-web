const areaPlaceholderStyles = {
  root: "min-h-screen bg-background px-5 py-6 text-foreground sm:px-8",
  container: "mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col",
  backButton: "mb-10 w-fit text-muted-foreground",
  content: "grid flex-1 content-center gap-8 lg:grid-cols-[1fr_320px]",
  eyebrow: "mb-4 text-sm font-medium text-primary",
  title: "max-w-2xl text-5xl font-semibold leading-[1.05]",
  description: "mt-5 max-w-xl text-lg leading-8 text-muted-foreground",
  iconCard: "flex h-64 items-center justify-center py-0 shadow-none",
  icon: "size-16 text-success",
} as const;

export { areaPlaceholderStyles };
