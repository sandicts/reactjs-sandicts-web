import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getI18nMessageFallback } from "@/i18n/fallback";
import { I18N_FORMATS } from "@/i18n/formats";
import messages from "@/i18n/messages/pt-BR.json";

function renderWithI18n(
  ui: React.ReactNode,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(
    <NextIntlClientProvider
      formats={I18N_FORMATS}
      getMessageFallback={getI18nMessageFallback}
      locale={DEFAULT_LOCALE}
      messages={messages}
    >
      {ui}
    </NextIntlClientProvider>,
    options,
  );
}

export { renderWithI18n };
