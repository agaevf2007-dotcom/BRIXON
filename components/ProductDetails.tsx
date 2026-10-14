"use client";

import { ARKitchenViewer } from "@/components/ARKitchenViewer";
import { Button } from "@/components/Button";
import { DiscountBadge, Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantitySelector } from "@/components/QuantitySelector";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategoryName } from "@/data/categories";
import { loc } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { locale, t } = useLocale();
  const saved = has(product.id);
  const router = useRouter();
  const name = loc(product.name, locale);
  const specs = loc(product.specifications, locale);
  const features = loc(product.features, locale);
  const box = loc(product.box, locale);

  return (
    <div>
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={name} />

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{product.brand}</p>
          <p className="mt-2 text-sm text-muted">{getCategoryName(product.category, locale)}</p>
          <h1 className="mt-3 text-4xl tracking-tight md:text-5xl">{name}</h1>
          <p className="mt-2 text-sm text-muted">{product.model}</p>
          <div className="mt-4">
            <StarRating value={product.rating} count={product.reviews} size="md" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Price amountEUR={product.basePriceEUR} className="text-3xl" />
            {product.oldPriceEUR ? (
              <Price amountEUR={product.oldPriceEUR} className="text-muted" struck />
            ) : null}
            <DiscountBadge priceEUR={product.basePriceEUR} oldPriceEUR={product.oldPriceEUR} />
          </div>
          {product.priceSource ? (
            <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted">
              {t("product.priceSource")}: {loc(product.priceSource, locale)}
            </p>
          ) : null}

          <p className="mt-3 text-sm">
            {product.inStock ? (
              <span className="text-accent">
                {t("common.inStock")} · {t("common.ships")}
              </span>
            ) : (
              <span className="text-muted">{t("common.outOfStock")}</span>
            )}
          </p>

          <p className="mt-6 max-w-lg leading-relaxed text-muted">
            {loc(product.shortDescription, locale)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button
              className="sm:flex-1"
              disabled={!product.inStock}
              onClick={() => addItem(product, quantity)}
            >
              {t("common.addToCart")}
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="dark"
              className="sm:flex-1"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product, quantity, { openDrawer: false });
                router.push("/cart");
              }}
            >
              {t("common.buyNow")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => toggle(product)}
              ariaLabel={saved ? t("common.wishlistRemove") : t("common.wishlistAdd")}
            >
              <Heart className={cn("size-4", saved && "fill-ink")} />
              {saved ? t("common.saved") : t("common.wishlistAdd")}
            </Button>
          </div>
          {product.model3d ? (
            <ARKitchenViewer model={product.model3d} name={name} />
          ) : null}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl tracking-tight">{t("product.overview")}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            {loc(product.description, locale)}
          </p>
        </section>
        <section>
          <h2 className="text-2xl tracking-tight">{t("product.features")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="rounded-2xl bg-white px-4 py-3 text-sm">
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl tracking-tight">{t("product.specs")}</h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            {Object.entries(specs).map(([key, value]) => (
              <tr key={key} className="border-b border-ink/8">
                <th className="py-3 pr-6 text-left font-normal text-muted">{key}</th>
                <td className="py-3 text-right">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-6">
          <h3 className="text-lg tracking-tight">{t("product.energy")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{loc(product.energyInfo, locale)}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-6">
          <h3 className="text-lg tracking-tight">{t("product.dimensions")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{loc(product.dimensions, locale)}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-6">
          <h3 className="text-lg tracking-tight">{t("product.box")}</h3>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {box.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
