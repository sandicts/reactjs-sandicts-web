import type { ComponentProps } from "react";
import type { Button } from "@/components/ui/button";

type PendingButtonProps = Omit<ComponentProps<typeof Button>, "asChild"> &
  Readonly<{
    pending: boolean;
    pendingLabel: string;
  }>;

export type { PendingButtonProps };
