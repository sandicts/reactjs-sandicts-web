import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      {...props}
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-accent motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export { Skeleton };
