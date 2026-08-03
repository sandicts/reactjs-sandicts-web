import { cn } from "@/lib/utils";
import { loadingRegionStyles } from "./loading-region.styles";
import type { LoadingRegionProps } from "./loading-region.types";

function LoadingRegion({ children, className, label }: LoadingRegionProps) {
  return (
    <section
      data-slot="loading-region"
      aria-busy="true"
      aria-label={label}
      className={cn(loadingRegionStyles.root, className)}
    >
      <p className={loadingRegionStyles.status} role="status">
        {label}
      </p>
      {children}
    </section>
  );
}

export { LoadingRegion };
