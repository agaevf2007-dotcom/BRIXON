"use client";

import { Button } from "@/components/Button";
import { Price } from "@/components/Price";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { useEscape } from "@/hooks/useLockBody";
import { loc } from "@/lib/i18n";
import { FREE_DELIVERY_FROM_EUR } from "@/lib/price";
import { EASE_PREMIUM } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { lines, subtotal, delivery, total, itemCount, setQuantity, removeItem, lastAddedId } =
    useCart();
  const reduce = useReducedMotion();
  const { locale, t } = useLocale();
  useEscape(closeCart, cartOpen);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t("common.close")}
            className="fixed inset-0 z-[75] bg-night/40 cursor-pointer"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("cart.title")}
            className="fixed inset-y-0 right-0 z-[76] flex w-full max-w-[440px] flex-col bg-canvas shadow-[-24px_0_60px_rgba(17,17,17,0.08)]"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xl tracking-tight">{t("cart.title")}</p>
                <p className="text-sm text-muted">
                  {itemCount} {t("cart.items")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="grid size-11 place-items-center rounded-full hover:bg-white cursor-pointer"
                aria-label={t("common.close")}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl tracking-tight">{t("cart.empty")}</p>
                  <p className="mt-3 text-muted">{t("cart.emptyHint")}</p>
                  <Button href="/catalog" className="mt-8" onClick={closeCart}>
                    {t("home.explore")}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6 pb-6">
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-4">
                      <motion.div
                        className="relative size-24 overflow-hidden rounded-2xl bg-white"
                        animate={
                          lastAddedId === product.id && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }
                        }
                        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                      >
                        <Image
                          src={product.image}
                          alt={loc(product.name, locale)}
                          fill
                          className="object-contain p-1"
                          sizes="96px"
                        />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <Link href={`/product/${product.slug}`} onClick={closeCart} className="tracking-tight">
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
                        <p className="mt-1 text-sm">
                          <Price amountEUR={product.basePriceEUR} />
                        </p>
                        <div className="mt-3">
                          <QuantitySelector
                            value={quantity}
                            onChange={(value) => setQuantity(product.id, value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-ink/8 px-6 py-6">
                <Row label={t("cart.subtotal")} value={<Price amountEUR={subtotal} />} />
                <Row
                  label={t("cart.delivery")}
                  value={delivery === 0 ? t("cart.free") : <Price amountEUR={delivery} />}
                />
                {delivery > 0 ? (
                  <p className="mt-2 text-xs text-muted">
                    {t("cart.freeFrom")} <Price amountEUR={FREE_DELIVERY_FROM_EUR} />
                  </p>
                ) : null}
                <Row label={t("cart.total")} value={<Price amountEUR={total} />} strong />
                <Button href="/cart" className="mt-6 w-full" onClick={closeCart}>
                  {t("cart.checkout")}
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className={strong ? "text-base" : undefined}>{value}</span>
    </div>
  );
}
