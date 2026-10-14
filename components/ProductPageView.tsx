"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductReviews } from "@/components/ProductReviews";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useLocale } from "@/context/LocaleContext";
import { getCategoryName } from "@/data/categories";
import { loc } from "@/lib/i18n";
import type { Product } from "@/types/product";

export function ProductPageView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { locale, t } = useLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <Breadcrumbs
        items={[
          { label: t("common.home"), href: "/" },
          { label: getCategoryName(product.category, locale), href: `/catalog/${product.category}` },
          { label: product.brand, href: `/catalog/${product.category}` },
          { label: loc(product.name, locale) },
        ]}
      />
      <div className="mt-10">
        <ProductDetails product={product} />
      </div>
      <ProductReviews productId={product.id} rating={product.rating} count={product.reviews} />
      <RelatedProducts products={related} />
    </div>
  );
}
