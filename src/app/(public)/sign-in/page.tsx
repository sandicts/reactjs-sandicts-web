import { getTranslations } from "next-intl/server";
import { parseSignInSearchParams } from "@/features/auth/sign-in/sign-in-search-params.schemas";
import { SignInScreen } from "@/features/auth/sign-in/sign-in-screen";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { seoEnv } from "@/lib/env/seo-env";
import { readSafeReturnTo } from "@/lib/routes/safe-return-to";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

type SignInPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.signIn",
  });

  return createPrivatePageMetadata({
    description: t("metadataDescription"),
    follow: true,
    title: t("metadataTitle"),
  });
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { reason, returnTo } = parseSignInSearchParams(await searchParams);
  const safeReturnTo = readSafeReturnTo(returnTo, seoEnv.webOrigin);

  return <SignInScreen reason={reason} returnTo={safeReturnTo ?? undefined} />;
}
