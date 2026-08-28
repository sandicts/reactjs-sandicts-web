const protectedRouteBoundaryStyles = {
  loadingIndicator: "mx-auto h-3 w-40",
  loadingRegion:
    "mx-auto flex min-h-dvh w-full max-w-2xl items-center px-5 py-12 sm:px-8",
  minimalMain: "flex min-h-dvh w-full items-center",
  minimalPageState: "min-h-dvh justify-center",
  shellPageState: "min-h-[calc(100dvh-4.5rem)] justify-center",
} as const;

export { protectedRouteBoundaryStyles };
