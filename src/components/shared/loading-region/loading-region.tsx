import { cn } from "@/lib/utils";
import type { LoadingRegionProps } from "./loading-region.types";

function LoadingRegion({ children, className, label }: LoadingRegionProps) {
  return (
    <section
      data-slot="loading-region"
      aria-busy="true"
      aria-label={label}
      className={cn("w-full", className)}
    >
      <p className="sr-only" role="status">
        {label}
      </p>
      {children}
    </section>
  );
}

export { LoadingRegion };
