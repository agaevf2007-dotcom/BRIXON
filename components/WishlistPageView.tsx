"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { useLocale } from "@/context/LocaleContext";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistPageView() {
  const { products } = useWishlist();
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <Breadcrumbs
        items={[
          { label: t("common.home"), href: "/" },
          { label: t("wishlist.title") },
        ]}
      />
      <h1 className="mt-10 text-4xl tracking-tight md:text-6xl">{t("wishlist.title")}</h1>
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-3xl tracking-tight">{t("wishlist.empty")}</p>
          <p className="mt-4 text-muted">{t("wishlist.emptyHint")}</p>
          <Button href="/catalog" className="mt-10">
            {t("common.continue")}
          </Button>
        </div>
      ) : (
        <div className="mt-12">
          <ProductGrid products={products} className="xl:grid-cols-4" />
        </div>
      )}
    </div>
  );
}
