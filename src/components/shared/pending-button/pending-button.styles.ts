const pendingButtonStyles = {
  root: "grid",
  content:
    "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
  hiddenContent: "invisible",
  spinner: "animate-spin motion-reduce:animate-none",
} as const;

export { pendingButtonStyles };
