import { useTranslations } from "next-intl";

function SkipLink() {
  const t = useTranslations("Common");

  return (
    <a
      href="#shell-main"
      className="fixed top-3 left-3 z-100 -translate-y-24 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-lg transition focus:translate-y-0 focus:outline-none"
    >
      {t("skipToContent")}
    </a>
  );
}

export { SkipLink };
