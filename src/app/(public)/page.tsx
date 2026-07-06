import { PublicHomeScreen } from "@/features/public-home/public-home-screen";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { getSeoLocalization } from "@/lib/seo/seo-localization";
import { createPublicPageMetadata } from "@/lib/seo/seo-metadata";

export async function generateMetadata() {
  const localization = await getSeoLocalization();

  return createPublicPageMetadata(
    {
      canonicalPath: APP_ROUTES.public.home,
      description: localization.defaultDescription,
      title: "Sandicts",
      useAbsoluteTitle: true,
    },
    localization,
  );
}

export default function HomePage() {
  return <PublicHomeScreen />;
}
