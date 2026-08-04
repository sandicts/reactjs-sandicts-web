import { getRequestConfig } from "next-intl/server";
import { I18N_FALLBACK_TIME_ZONE, resolveLocale } from "./config";
import { getI18nMessageFallback } from "./fallback";
import { I18N_FORMATS } from "./formats";
import messages from "./messages/pt-BR.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);

  return {
    formats: I18N_FORMATS,
    getMessageFallback: getI18nMessageFallback,
    locale,
    messages,
    timeZone: I18N_FALLBACK_TIME_ZONE,
  };
});
