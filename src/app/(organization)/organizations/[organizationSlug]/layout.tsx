import { OrganizationShell } from "@/components/shared/app-shell/organization/organization-shell";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { formatRouteSlugLabel } from "@/lib/routes/route-labels";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const t = await getTranslations({
    locale: DEFAULT_LOCALE,
    namespace: "Pages.organization",
  });

  return createPrivatePageMetadata({
    description: t("metadataDescription"),
    title: t("metadataTitle"),
  });
}

export default async function OrganizationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}>) {
  const { organizationSlug } = await params;

  return (
    <OrganizationShell
      organizationSlug={organizationSlug}
      organizationLabel={formatRouteSlugLabel(organizationSlug)}
    >
      {children}
    </OrganizationShell>
  );
}
