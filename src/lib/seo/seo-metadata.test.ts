import { describe, expect, it } from "vitest";
import { createSeoEnvironment } from "@/lib/env/seo-env";
import {
  createPrivatePageMetadata,
  createPublicPageMetadata,
  createRootMetadata,
} from "./seo-metadata";

const localization = {
  defaultDescription:
    "Encontre quadras, partidas e pessoas para praticar esportes de areia.",
  locale: "pt-BR",
  socialImageAlt: "Sandicts — encontre quadras, partidas e pessoas para jogar",
} as const;
const publicEnvironment = createSeoEnvironment({
  indexingEnabled: "true",
  webOrigin: "https://sandicts.com.br",
});
const previewEnvironment = createSeoEnvironment({
  indexingEnabled: "false",
  webOrigin: "https://preview.sandicts.com.br",
});
const discoveryPage = {
  canonicalPath: "/discovery",
  description: "Encontre uma quadra perto de você.",
  title: "Descobrir quadras",
} as const;

describe("createRootMetadata", () => {
  it("defines the metadata base and a conservative indexing default", () => {
    const metadata = createRootMetadata(localization, publicEnvironment);

    expect(metadata.metadataBase).toEqual(new URL("https://sandicts.com.br"));
    expect(metadata.title).toEqual({
      default: "Sandicts",
      template: "%s | Sandicts",
    });
    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
    });
  });
});

describe("createPublicPageMetadata", () => {
  it("creates complete indexable metadata when indexing is enabled", () => {
    const metadata = createPublicPageMetadata(
      discoveryPage,
      localization,
      publicEnvironment,
    );

    expect(metadata).toMatchObject({
      alternates: {
        canonical: "https://sandicts.com.br/discovery",
      },
      description: discoveryPage.description,
      openGraph: {
        description: discoveryPage.description,
        images: [
          {
            alt: "Sandicts — encontre quadras, partidas e pessoas para jogar",
            height: 630,
            type: "image/png",
            url: "https://sandicts.com.br/opengraph-image",
            width: 1200,
          },
        ],
        locale: "pt_BR",
        siteName: "Sandicts",
        title: discoveryPage.title,
        type: "website",
        url: "https://sandicts.com.br/discovery",
      },
      robots: {
        follow: true,
        index: true,
      },
      title: discoveryPage.title,
      twitter: {
        card: "summary_large_image",
        description: discoveryPage.description,
        images: [
          {
            alt: "Sandicts — encontre quadras, partidas e pessoas para jogar",
            height: 630,
            url: "https://sandicts.com.br/twitter-image",
            width: 1200,
          },
        ],
        title: discoveryPage.title,
      },
    });
  });

  it("keeps a public preview page out of the index", () => {
    const metadata = createPublicPageMetadata(
      discoveryPage,
      localization,
      previewEnvironment,
    );

    expect(metadata.robots).toEqual({
      follow: true,
      index: false,
    });
    expect(metadata.alternates).toEqual({
      canonical: "https://preview.sandicts.com.br/discovery",
    });
  });
});

describe("createPrivatePageMetadata", () => {
  it("keeps operational pages out of the index and link graph", () => {
    expect(
      createPrivatePageMetadata({
        description: "Gerencie suas reservas.",
        title: "Reservas",
      }),
    ).toEqual({
      description: "Gerencie suas reservas.",
      robots: {
        follow: false,
        index: false,
      },
      title: "Reservas",
    });
  });

  it("allows crawlers to follow links on the sign-in page", () => {
    expect(
      createPrivatePageMetadata({
        description: "Entre na sua conta.",
        follow: true,
        title: "Entrar",
      }).robots,
    ).toEqual({
      follow: true,
      index: false,
    });
  });
});
