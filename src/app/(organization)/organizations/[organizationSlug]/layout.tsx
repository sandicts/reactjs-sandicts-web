import { OrganizationShell } from "@/components/shared/app-shell/organization/organization-shell";
import { formatRouteSlugLabel } from "@/lib/routes/route-labels";

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
