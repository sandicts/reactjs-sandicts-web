import { createFormatter } from "next-intl";
import { DEFAULT_LOCALE, type AppLocale } from "./config";
import { I18N_FORMATS } from "./formats";

type AppFormatterOptions = Readonly<{
  locale?: AppLocale;
  timeZone?: string;
}>;

function createAppFormatter({
  locale = DEFAULT_LOCALE,
  timeZone,
}: AppFormatterOptions = {}) {
  return createFormatter({
    formats: I18N_FORMATS,
    locale,
    timeZone,
  });
}

export { createAppFormatter };
export type { AppFormatterOptions };
