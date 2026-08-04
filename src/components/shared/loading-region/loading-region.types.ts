import type { ReactNode } from "react";

type LoadingRegionProps = Readonly<{
  label: string;
  children: ReactNode;
  className?: string;
}>;

export type { LoadingRegionProps };
