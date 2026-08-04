import {
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from "@/lib/seo/seo.constants";
import { createSocialImage } from "@/lib/seo/social-image";
import messages from "@/i18n/messages/pt-BR.json";

export const alt = messages.Metadata.socialImageAlt;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;
export const size = SOCIAL_IMAGE_SIZE;

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: messages.Metadata.socialImageEyebrow,
    symbolLabel: messages.Metadata.socialImageSymbolLabel,
    title: messages.Metadata.socialImageTitle,
  });
}
