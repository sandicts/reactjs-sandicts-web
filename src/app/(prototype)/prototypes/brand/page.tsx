import type { CSSProperties } from "react";
import type { Metadata } from "next";
import {
  activeBrandVariantId,
  brandVariants,
  type BrandVariantId,
} from "@/config/brand";
import { BrandLockup, BrandMark, BrandName } from "@/components/shared/brand";

export const metadata: Metadata = {
  title: "Galeria da marca Sandicts",
  description:
    "Referência interna da geometria, composições, tamanhos e variantes da marca Sandicts.",
  robots: {
    follow: false,
    index: false,
  },
};

const markSizes = [16, 24, 36, 48, 96] as const;

function VariantSection({
  variantId,
}: Readonly<{ variantId: BrandVariantId }>) {
  const variant = brandVariants[variantId];
  const isActive = variantId === activeBrandVariantId;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-8"
      data-brand-gallery-variant={variantId}
      data-brand-variant={variantId}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-medium tracking-[0.12em] text-brand uppercase">
            {isActive ? "Variante ativa" : "Fixture de validação"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{variant.id}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Arte: {variant.artworkId} · Tratamento padrão:{" "}
            {variant.defaultTreatment}
          </p>
        </div>
        <BrandLockup
          aria-label={`Marca ${variant.displayName}`}
          markSize={48}
          variantId={variantId}
        />
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <article
          className="rounded-xl border border-border bg-background p-5 text-foreground"
          data-brand-gallery-surface="flat-dark"
          data-brand-scheme="dark"
          data-brand-variant={variantId}
        >
          <h3 className="text-sm font-semibold">
            Flat sobre superfície escura
          </h3>
          <div className="mt-8 flex min-h-40 flex-wrap items-center justify-center gap-8">
            <BrandLockup markSize={48} treatment="flat" variantId={variantId} />
            <BrandLockup
              markSize={64}
              orientation="stacked"
              treatment="flat"
              variantId={variantId}
            />
          </div>
        </article>

        <article
          className="rounded-xl border border-brand/30 bg-brand-surface p-5 text-brand"
          data-brand-gallery-surface="flat-light"
          data-brand-scheme="light"
          data-brand-variant={variantId}
        >
          <h3 className="text-sm font-semibold">
            Flat sobre superfície clara/inversa
          </h3>
          <div className="mt-8 flex min-h-40 flex-wrap items-center justify-center gap-8">
            <BrandLockup markSize={48} treatment="flat" variantId={variantId} />
            <BrandLockup
              markSize={64}
              orientation="stacked"
              treatment="flat"
              variantId={variantId}
            />
          </div>
        </article>
      </div>

      <article
        className="mt-6 overflow-hidden rounded-xl border border-brand/30 bg-background p-5 text-foreground"
        data-brand-scheme="dark"
        data-brand-variant={variantId}
      >
        <h3 className="text-sm font-semibold">Expressive</h3>
        <div
          className="mt-5 flex min-h-52 items-center justify-center rounded-lg"
          style={
            {
              background:
                "radial-gradient(circle, var(--brand-glow), transparent 68%)",
            } as CSSProperties
          }
        >
          <BrandLockup
            markSize={96}
            orientation="stacked"
            treatment="expressive"
            variantId={variantId}
          />
        </div>
      </article>

      <article className="mt-6 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold">Escala mínima</h3>
        <div className="mt-5 flex flex-wrap items-end gap-6">
          {markSizes.map((size) => (
            <figure
              className="grid min-w-16 justify-items-center gap-2"
              key={size}
            >
              <BrandMark
                label={`Símbolo Sandicts em ${size}px`}
                size={size}
                variantId={variantId}
              />
              <figcaption className="text-xs text-muted-foreground">
                {size}px
              </figcaption>
            </figure>
          ))}
        </div>
      </article>

      <article className="mt-6 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold">Primitivos</h3>
        <div className="mt-5 flex flex-wrap items-center gap-8">
          <BrandMark
            label={`Símbolo ${variant.displayName}`}
            size={48}
            variantId={variantId}
          />
          <BrandName variantId={variantId} />
          <BrandLockup markSize={48} variantId={variantId} />
        </div>
      </article>
    </section>
  );
}

export default function BrandGalleryPage() {
  const variantIds = Object.keys(brandVariants) as BrandVariantId[];

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-medium tracking-[0.12em] text-brand uppercase">
            KAN-145 · Brand system
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Galeria da marca Sandicts
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            A geometria abaixo é compartilhada por runtime, favicon, imagens
            sociais e protótipos. A variante de celebração existe somente para
            provar a propagação da configuração.
          </p>
        </header>

        <div className="mt-10 grid gap-8">
          {variantIds.map((variantId) => (
            <VariantSection key={variantId} variantId={variantId} />
          ))}
        </div>
      </div>
    </main>
  );
}
