import { APP_ROUTES } from "@/lib/routes/app-routes";

const SEO_SITE_NAME = "Sandicts";
const SEO_DEFAULT_DESCRIPTION =
  "Encontre quadras, partidas e pessoas para praticar esportes de areia.";
const SEO_LOCALE = "pt_BR";

const SOCIAL_IMAGE_ALT =
  "Sandicts — encontre quadras, partidas e pessoas para jogar";
const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;
const SOCIAL_IMAGE_CONTENT_TYPE = "image/png";
const OPEN_GRAPH_IMAGE_PATH = "/opengraph-image";
const TWITTER_IMAGE_PATH = "/twitter-image";

const PUBLIC_SITEMAP_PATHS = [
  APP_ROUTES.public.home,
  APP_ROUTES.public.discovery,
] as const;

export {
  OPEN_GRAPH_IMAGE_PATH,
  PUBLIC_SITEMAP_PATHS,
  SEO_DEFAULT_DESCRIPTION,
  SEO_LOCALE,
  SEO_SITE_NAME,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  TWITTER_IMAGE_PATH,
};
