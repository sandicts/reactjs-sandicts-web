import type { I18N_FORMATS } from "./formats";
import type messages from "./messages/pt-BR.json";

declare module "next-intl" {
  interface AppConfig {
    Formats: typeof I18N_FORMATS;
    Locale: "pt-BR";
    Messages: typeof messages;
  }
}
