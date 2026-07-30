import { cn } from "@/lib/utils";

const prototypeStyles = {
  page: "min-h-dvh overflow-x-clip bg-background text-foreground",
  skipLink: cn(
    "fixed top-3 left-3 z-[70] -translate-y-20 rounded-lg bg-primary",
    "px-4 py-2 text-sm font-medium text-primary-foreground",
    "focus:translate-y-0 focus:outline-none focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50 motion-reduce:transition-none",
  ),
  header: cn(
    "sticky top-0 z-30 border-b border-border/80 bg-background/90",
    "supports-backdrop-filter:backdrop-blur-md min-[48rem]:static",
  ),
  headerInner:
    "mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 min-[48rem]:px-6",
  brand: "text-brand",
  scenarioArea: "mx-auto w-full max-w-6xl px-4 pt-4 min-[48rem]:px-6",
  scenarioPanel: cn(
    "grid gap-3 rounded-xl border border-dashed border-warning-border",
    "bg-warning-subtle p-4 min-[48rem]:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]",
    "min-[48rem]:items-end",
  ),
  scenarioHeading: "flex items-center gap-2 font-heading text-sm font-semibold",
  scenarioDescription: "mt-1 max-w-3xl text-sm leading-6 text-muted-foreground",
  scenarioSelect: cn(
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm",
    "outline-none focus-visible:border-ring focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50",
  ),
  main: "mx-auto w-full max-w-4xl px-4 py-8 min-[48rem]:px-6 min-[48rem]:py-12",
  pageHeading: "outline-none",
  eyebrow: "text-sm font-medium text-primary",
  title:
    "mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance min-[48rem]:text-4xl",
  description: "mt-3 max-w-2xl text-base leading-7 text-muted-foreground",
  requiredNote: "mt-3 text-sm text-muted-foreground",
  panel: "mt-8 border-border/80 bg-card/70",
  panelContent: "space-y-8",
  section: "space-y-4",
  sectionHeading: "text-xl font-semibold tracking-tight",
  sectionDescription: "text-sm leading-6 text-muted-foreground",
  fieldError: "text-sm text-destructive",
  groupErrorSummary: "sr-only",
  radioGrid: "grid grid-cols-1 gap-3 min-[48rem]:grid-cols-3",
  levelGrid: "grid grid-cols-1 gap-3 min-[48rem]:grid-cols-2",
  radioCard: cn(
    "relative flex min-h-11 w-full items-start gap-3 rounded-xl border",
    "border-border bg-background/70 p-4 text-left outline-none",
    "transition-colors hover:border-primary/60 hover:bg-accent/70",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "motion-reduce:transition-none",
  ),
  radioIndicator:
    "mt-0.5 flex size-5 shrink-0 items-center justify-center text-primary",
  radioText: "min-w-0 flex-1",
  radioTitleRow: "flex flex-wrap items-baseline gap-x-2 gap-y-1",
  radioTitle: "font-heading text-sm font-semibold text-foreground",
  radioFriendly: "text-sm font-medium text-primary",
  radioDescription: "mt-1 text-sm leading-6 text-muted-foreground",
  disabledGroup:
    "rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground",
  inlineState:
    "rounded-xl border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground",
  actionArea: "space-y-4 border-t border-border pt-6",
  actions: "flex flex-col gap-3 min-[48rem]:flex-row min-[48rem]:justify-end",
  primaryAction: "w-full min-[48rem]:w-auto min-[48rem]:min-w-36",
  alert: "scroll-mt-24",
  alertActions: "mt-3 flex flex-wrap gap-2",
  routeCard:
    "mt-4 rounded-lg border border-border bg-background/60 p-3 text-sm",
  routeCode: "mt-1 block break-all font-mono text-xs text-muted-foreground",
  loading: "mt-8 space-y-8 rounded-xl border border-border bg-card/70 p-6",
  skeletonBlock: "space-y-3",
  skeletonGrid: "grid grid-cols-1 gap-3 min-[48rem]:grid-cols-3",
  skeletonLevelGrid: "grid grid-cols-1 gap-3 min-[48rem]:grid-cols-2",
  outcome: "mt-8 rounded-xl border border-border bg-card/70",
  comboboxTrigger:
    "h-11 w-full justify-between text-left font-normal min-[48rem]:max-w-md",
  comboboxContent: cn(
    "z-50 w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-border",
    "bg-popover p-3 text-popover-foreground shadow-lg outline-none",
  ),
  searchField: "relative",
  searchIcon:
    "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
  searchInput: "h-11 pl-9",
  listbox: "mt-3 max-h-72 space-y-1 overflow-y-auto rounded-lg outline-none",
  option: cn(
    "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3",
    "py-2 text-left text-sm transition-colors outline-none",
    "hover:bg-accent focus-visible:bg-accent data-[active=true]:bg-accent",
    "motion-reduce:transition-none",
  ),
  noResults: "py-8 text-center text-sm text-muted-foreground",
  clearSearch: "mt-3 w-full",
  dialogOverlay: cn(
    "fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0 motion-reduce:animate-none",
  ),
  dialogContent: cn(
    "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg",
    "-translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border",
    "bg-popover p-6 text-popover-foreground shadow-xl outline-none",
  ),
  dialogTitle: "text-lg font-semibold",
  dialogDescription: "text-sm leading-6 text-muted-foreground",
  dialogActions:
    "mt-2 flex flex-col-reverse gap-3 min-[30rem]:flex-row min-[30rem]:justify-end",
} as const;

export { prototypeStyles };
