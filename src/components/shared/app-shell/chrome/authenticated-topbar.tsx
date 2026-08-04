import { BrandLink } from "@/components/shared/brand";
import type { AuthenticatedTopbarProps } from "./authenticated-topbar.types";
import { ContextSwitcher } from "../context/context-switcher";

function AuthenticatedTopbar({
  contexts,
  eyebrow,
  menuTrigger,
  title,
}: AuthenticatedTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      {menuTrigger}
      {menuTrigger ? null : (
        <div className="md:hidden">
          <BrandLink compact />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <p className="truncate text-base font-semibold">{title}</p>
      </div>
      <div className="max-w-48 shrink-0 sm:max-w-xs">
        <ContextSwitcher contexts={contexts} />
      </div>
    </header>
  );
}

export { AuthenticatedTopbar };
