"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductGrid({
  products,
  loading = false,
  className,
  catalogCovers = false,
}: {
  products: Product[];
  loading?: boolean;
  className?: string;
  catalogCovers?: boolean;
}) {
  const { t } = useLocale();

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2", className ?? "xl:grid-cols-3")}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-ink/8 bg-surface px-8 py-16 text-center">
        <p className="text-2xl tracking-tight">{t("common.emptyFilters")}</p>
        <p className="mt-3 text-muted">{t("common.emptyFiltersHint")}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2", className ?? "xl:grid-cols-3")}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} catalogCover={catalogCovers} />
      ))}
    </div>
  );
}
