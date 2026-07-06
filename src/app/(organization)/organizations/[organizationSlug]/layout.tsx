import { OrganizationShell } from "@/components/shared/app-shell/organization/organization-shell";
import { formatRouteSlugLabel } from "@/lib/routes/route-labels";
import { createPrivatePageMetadata } from "@/lib/seo/seo-metadata";

export const metadata = createPrivatePageMetadata({
  description: "Gerencie sua organização no Sandicts.",
  title: "Área da organização",
});

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
