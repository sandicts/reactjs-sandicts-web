import { cn } from "@/lib/utils";
import { skeletonStyles } from "./skeleton.styles";
import type { SkeletonProps } from "./skeleton.types";

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      {...props}
      aria-hidden="true"
      className={cn(skeletonStyles.root, className)}
    />
  );
}

export { Skeleton };
