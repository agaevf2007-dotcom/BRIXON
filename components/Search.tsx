"use client";

import { Price } from "@/components/Price";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { getCategoryName } from "@/data/categories";
import { searchProducts } from "@/data/products";
import { useEscape } from "@/hooks/useLockBody";
import { loc } from "@/lib/i18n";
import { EASE_PREMIUM } from "@/lib/utils";
import { Search as SearchIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export function Search() {
  const { searchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const { locale, t } = useLocale();

  useEscape(closeSearch, searchOpen);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  const results = useMemo(() => searchProducts(query, locale).slice(0, 8), [query, locale]);

  return (
    <AnimatePresence>
      {searchOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] bg-canvas/92 backdrop-blur-xl"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
        >
          <div className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8 sm:px-8">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("search.title")}</p>
              <button
                type="button"
                onClick={closeSearch}
                className="grid size-11 place-items-center rounded-full hover:bg-ink/5 cursor-pointer"
                aria-label={t("search.close")}
              >
                <X className="size-5" />
              </button>
            </div>

            <label className="mt-10 flex items-center gap-3 border-b border-ink/10 pb-4">
              <SearchIcon className="size-6 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent text-3xl tracking-tight outline-none placeholder:text-ink/25 md:text-4xl"
                aria-label={t("search.title")}
              />
            </label>

            <ul className="mt-8 space-y-2 overflow-y-auto pb-10">
              {results.length === 0 ? (
                <motion.li
                  className="py-10 text-muted"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t("search.empty")} “{query}”.
                </motion.li>
              ) : (
                results.map((product, index) => (
                  <motion.li
                    key={product.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.35, ease: EASE_PREMIUM }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white"
                    >
                      <span className="relative size-16 overflow-hidden rounded-xl bg-white">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs uppercase tracking-[0.16em] text-muted">
                          {product.brand} · {getCategoryName(product.category, locale)}
                        </span>
                        <span className="block truncate text-lg tracking-tight">
                          {loc(product.name, locale)}
                        </span>
                        <span className="block text-sm text-muted">
                          {loc(product.shortDescription, locale)}
                        </span>
                      </span>
                      <Price amountEUR={product.basePriceEUR} className="text-sm" />
                    </Link>
                  </motion.li>
                ))
              )}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
