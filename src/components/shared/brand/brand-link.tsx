import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./brand-lockup";
import { BrandMark } from "./brand-mark";

type BrandLinkProps = Readonly<{
  className?: string;
  compact?: boolean;
}>;

function BrandLink({ className, compact = false }: BrandLinkProps) {
  const t = useTranslations("Common");

  return (
    <Link
      href={APP_ROUTES.public.home}
      className={cn(
        "inline-flex min-h-11 items-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      aria-label={t("brandHomeLabel")}
      data-brand-link=""
    >
      {compact ? (
        <BrandMark size={36} />
      ) : (
        <BrandLockup aria-hidden="true" markSize={36} treatment="flat" />
      )}
    </Link>
  );
}

export { BrandLink };
export type { BrandLinkProps };
