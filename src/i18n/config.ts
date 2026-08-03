const SUPPORTED_LOCALES = ["pt-BR"] as const;

type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: AppLocale = "pt-BR";
const I18N_FALLBACK_TIME_ZONE = "UTC";

function isSupportedLocale(
  value: string | null | undefined,
): value is AppLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

function resolveLocale(value: string | null | undefined): AppLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

function toOpenGraphLocale(locale: AppLocale) {
  return locale.replace("-", "_");
}

export {
  DEFAULT_LOCALE,
  I18N_FALLBACK_TIME_ZONE,
  isSupportedLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
  toOpenGraphLocale,
};
export type { AppLocale };
