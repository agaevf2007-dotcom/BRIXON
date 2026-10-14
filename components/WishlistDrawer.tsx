"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEscape } from "@/hooks/useLockBody";
import { loc } from "@/lib/i18n";
import { EASE_PREMIUM } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Price } from "@/components/Price";

export function WishlistDrawer() {
  const { wishlistOpen, closeWishlist } = useUI();
  const { products, toggle } = useWishlist();
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const { locale, t } = useLocale();
  useEscape(closeWishlist, wishlistOpen);

  return (
    <AnimatePresence>
      {wishlistOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t("common.close")}
            className="fixed inset-0 z-[75] bg-night/40 cursor-pointer"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onClick={closeWishlist}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("wishlist.title")}
            className="fixed inset-y-0 right-0 z-[76] flex w-full max-w-[440px] flex-col bg-canvas"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <p className="text-xl tracking-tight">{t("wishlist.title")}</p>
              <button
                type="button"
                onClick={closeWishlist}
                className="grid size-11 place-items-center rounded-full hover:bg-white cursor-pointer"
                aria-label={t("common.close")}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {products.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl tracking-tight">{t("wishlist.empty")}</p>
                  <p className="mt-3 text-muted">{t("wishlist.emptyHint")}</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {products.map((product) => (
                    <li key={product.id} className="flex gap-4">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeWishlist}
                        className="relative size-24 overflow-hidden rounded-2xl bg-white"
                      >
                        <Image
                          src={product.image}
                          alt={loc(product.name, locale)}
                          fill
                          className="object-contain p-1"
                          sizes="96px"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeWishlist}
                          className="tracking-tight"
                        >
                          {loc(product.name, locale)}
                        </Link>
                        <p className="mt-1 text-sm">
                          <Price amountEUR={product.basePriceEUR} />
                        </p>
                        <div className="mt-3 flex gap-4 text-sm">
                          <button
                            type="button"
                            className="cursor-pointer underline underline-offset-4"
                            onClick={() => addItem(product)}
                          >
                            {t("common.addToCart")}
                          </button>
                          <button
                            type="button"
                            className="cursor-pointer text-muted"
                            onClick={() => toggle(product)}
                          >
                            {t("common.remove")}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button href="/wishlist" className="mt-8 w-full" onClick={closeWishlist}>
                {t("wishlist.title")}
              </Button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
