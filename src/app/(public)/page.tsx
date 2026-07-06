import { PublicHomeScreen } from "@/features/public-home/public-home-screen";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { SEO_DEFAULT_DESCRIPTION } from "@/lib/seo/seo.constants";
import { createPublicPageMetadata } from "@/lib/seo/seo-metadata";

export const metadata = createPublicPageMetadata({
  canonicalPath: APP_ROUTES.public.home,
  description: SEO_DEFAULT_DESCRIPTION,
  title: "Sandicts",
  useAbsoluteTitle: true,
});

export default function HomePage() {
  return <PublicHomeScreen />;
}
