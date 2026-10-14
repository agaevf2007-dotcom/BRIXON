"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getFeaturedProducts } from "@/data/products";
import { Button } from "@/components/Button";
import { useLocale } from "@/context/LocaleContext";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
      <ScrollReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("home.selected")}</p>
          <h2 className="mt-4 text-4xl tracking-tight md:text-6xl">{t("home.featured")}</h2>
        </div>
        <Button href="/catalog" variant="secondary">
          {t("home.viewCollection")}
        </Button>
      </ScrollReveal>
      <div className="mt-14">
        <ProductGrid products={products} className="xl:grid-cols-4" />
      </div>
    </section>
  );
}
