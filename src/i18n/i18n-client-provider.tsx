"use client";

import { NextIntlClientProvider, type Messages, type Locale } from "next-intl";
import { I18N_FALLBACK_TIME_ZONE } from "./config";
import { getI18nMessageFallback } from "./fallback";
import { I18N_FORMATS } from "./formats";

type I18nClientProviderProps = Readonly<{
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
}>;

function I18nClientProvider({
  children,
  locale,
  messages,
}: I18nClientProviderProps) {
  return (
    <NextIntlClientProvider
      formats={I18N_FORMATS}
      getMessageFallback={getI18nMessageFallback}
      locale={locale}
      messages={messages}
      timeZone={I18N_FALLBACK_TIME_ZONE}
    >
      {children}
    </NextIntlClientProvider>
  );
}

export { I18nClientProvider };
