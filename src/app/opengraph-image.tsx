import {
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from "@/lib/seo/seo.constants";
import { createSocialImage } from "@/lib/seo/social-image";

export const alt = SOCIAL_IMAGE_ALT;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;
export const size = SOCIAL_IMAGE_SIZE;

export default function OpenGraphImage() {
  return createSocialImage();
}
