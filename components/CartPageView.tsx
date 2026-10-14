"use client";

import { Button } from "@/components/Button";
import { Price } from "@/components/Price";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { loc } from "@/lib/i18n";
import { FREE_DELIVERY_FROM_EUR } from "@/lib/price";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CartPageView() {
  const { lines, subtotal, delivery, total, setQuantity, removeItem, clear, itemCount } = useCart();
  const [placed, setPlaced] = useState(false);
  const { locale, t } = useLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <h1 className="text-4xl tracking-tight md:text-6xl">{t("cart.title")}</h1>
      <div className="mt-12">
        {placed ? (
          <div className="py-20 text-center">
            <p className="text-4xl tracking-tight md:text-6xl">{t("cart.received")}</p>
            <p className="mx-auto mt-5 max-w-md text-muted">{t("cart.receivedHint")}</p>
            <Button href="/catalog" className="mt-10">
              {t("common.continue")}
            </Button>
          </div>
        ) : !lines.length ? (
          <div className="py-20 text-center">
            <p className="text-4xl tracking-tight md:text-6xl">{t("cart.empty")}</p>
            <p className="mt-4 text-muted">{t("cart.emptyHint")}</p>
            <Button href="/catalog" className="mt-10">
              {t("home.explore")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
            <ul className="space-y-6">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 rounded-[1.75rem] bg-white p-4 sm:p-5">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-white"
                  >
                    <Image
                      src={product.image}
                      alt={loc(product.name, locale)}
                      fill
                      className="object-contain p-2"
                      sizes="112px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/product/${product.slug}`} className="text-lg tracking-tight">
                        {loc(product.name, locale)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-sm text-muted hover:text-ink cursor-pointer"
                      >
                        {t("common.remove")}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      <Price amountEUR={product.basePriceEUR} />
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <QuantitySelector
                        value={quantity}
                        onChange={(value) => setQuantity(product.id, value)}
                      />
                      <Price amountEUR={product.basePriceEUR * quantity} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-[1.75rem] bg-white p-6 md:p-8">
              <p className="text-2xl tracking-tight">{t("cart.summary")}</p>
              <p className="mt-1 text-sm text-muted">
                {itemCount} {t("cart.items")}
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{t("cart.subtotal")}</dt>
                  <dd>
                    <Price amountEUR={subtotal} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{t("cart.delivery")}</dt>
                  <dd>{delivery === 0 ? t("cart.free") : <Price amountEUR={delivery} />}</dd>
                </div>
                {delivery > 0 ? (
                  <p className="text-xs text-muted">
                    {t("cart.freeFrom")} <Price amountEUR={FREE_DELIVERY_FROM_EUR} />
                  </p>
                ) : null}
                <div className="flex justify-between border-t border-ink/8 pt-4 text-base">
                  <dt>{t("cart.total")}</dt>
                  <dd>
                    <Price amountEUR={total} />
                  </dd>
                </div>
              </dl>
              <Button
                className="mt-8 w-full"
                onClick={() => {
                  clear();
                  setPlaced(true);
                }}
              >
                {t("cart.checkout")}
              </Button>
              <button
                type="button"
                onClick={clear}
                className="mt-4 w-full text-sm text-muted cursor-pointer"
              >
                {t("cart.clear")}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
