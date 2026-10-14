"use client";

import { ProductCard } from "@/components/ProductCard";
import { useLocale } from "@/context/LocaleContext";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  const { t } = useLocale();
  if (!products.length) return null;

  return (
    <section className="mt-24">
      <h2 className="text-3xl tracking-tight md:text-5xl">{t("product.related")}</h2>
      <div className="mt-10 flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] snap-start md:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
