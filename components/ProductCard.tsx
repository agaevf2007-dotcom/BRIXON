"use client";

import { DiscountBadge, Price } from "@/components/Price";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategoryName } from "@/data/categories";
import { loc } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  catalogCover = false,
}: {
  product: Product;
  catalogCover?: boolean;
}) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { locale, t } = useLocale();
  const saved = has(product.id);
  const reduce = useReducedMotion();
  const name = loc(product.name, locale);
  const category = getCategoryName(product.category, locale);

  return (
    <motion.article
      className="group flex h-full flex-col"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_0_0_rgba(17,17,17,0)] transition-[box-shadow] duration-500 group-hover:shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-[4/5] bg-white"
          aria-label={name}
        >
          <Image
            src={catalogCover ? (product.catalogImage ?? product.image) : product.image}
            alt={name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {!product.inStock ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs tracking-wide">
              {t("common.outOfStock")}
            </span>
          ) : product.isNew ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs tracking-wide">
              {t("common.new")}
            </span>
          ) : null}
          <DiscountBadge priceEUR={product.basePriceEUR} oldPriceEUR={product.oldPriceEUR} />
        </div>
        <button
          type="button"
          onClick={() => toggle(product)}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink transition-colors hover:bg-white cursor-pointer"
          aria-label={saved ? t("common.wishlistRemove") : t("common.wishlistAdd")}
          aria-pressed={saved}
        >
          <Heart className={cn("size-4", saved && "fill-ink")} />
        </button>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-0 opacity-100 transition-all duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="pointer-events-auto w-full rounded-full bg-ink py-3 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {t("common.addToCart")}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{product.brand}</p>
        <p className="mt-1 text-xs text-muted">{category}</p>
        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="text-xl tracking-tight md:text-[1.35rem]">{name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {loc(product.shortDescription, locale)}
        </p>
        <div className="mt-3">
          <StarRating value={product.rating} count={product.reviews} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex flex-wrap items-baseline gap-2">
            <Price amountEUR={product.basePriceEUR} className="text-lg" />
            {product.oldPriceEUR ? (
              <Price amountEUR={product.oldPriceEUR} className="text-sm text-muted" struck />
            ) : null}
          </p>
          <p className="text-xs text-muted">
            {product.inStock ? t("common.inStock") : t("common.outOfStock")}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
