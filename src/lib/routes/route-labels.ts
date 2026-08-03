import { DEFAULT_LOCALE, type AppLocale } from "@/i18n/config";

function formatRouteSlugLabel(
  routeSlug: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  return decodeURIComponent(routeSlug)
    .split(/[-_]+/)
    .filter(Boolean)
    .map(
      (part) => `${part.charAt(0).toLocaleUpperCase(locale)}${part.slice(1)}`,
    )
    .join(" ");
}

export { formatRouteSlugLabel };
