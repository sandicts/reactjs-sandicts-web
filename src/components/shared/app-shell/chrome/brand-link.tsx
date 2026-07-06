import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_ROUTES } from "@/lib/routes/app-routes";

const brandMarkSizePx = 36;

function BrandLink() {
  const t = useTranslations("Common");

  return (
    <Link
      href={APP_ROUTES.public.home}
      className="inline-flex min-h-11 items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label={t("brandHomeLabel")}
    >
      <Image
        src="/sandicts-mark.svg"
        alt=""
        width={brandMarkSizePx}
        height={brandMarkSizePx}
        priority
      />
      <span>Sandicts</span>
    </Link>
  );
}

export { BrandLink };
