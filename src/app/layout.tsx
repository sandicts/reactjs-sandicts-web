import { IBM_Plex_Sans, Montserrat } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { I18nClientProvider } from "@/i18n/i18n-client-provider";
import messages from "@/i18n/messages/pt-BR.json";
import { getSeoLocalization } from "@/lib/seo/seo-localization";
import { createRootMetadata } from "@/lib/seo/seo-metadata";
import { AppProviders } from "./providers";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export async function generateMetadata() {
  return createRootMetadata(await getSeoLocalization());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setRequestLocale(DEFAULT_LOCALE);

  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${ibmPlexSans.variable} ${montserrat.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nClientProvider locale={DEFAULT_LOCALE} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </I18nClientProvider>
      </body>
    </html>
  );
}
