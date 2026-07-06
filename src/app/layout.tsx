import { Geist, Geist_Mono } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { I18nClientProvider } from "@/i18n/i18n-client-provider";
import messages from "@/i18n/messages/pt-BR.json";
import { getSeoLocalization } from "@/lib/seo/seo-localization";
import { createRootMetadata } from "@/lib/seo/seo-metadata";
import { AppProviders } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nClientProvider locale={DEFAULT_LOCALE} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </I18nClientProvider>
      </body>
    </html>
  );
}
