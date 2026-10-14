"use client";

import { cn, EASE_PREMIUM } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { loc } from "@/lib/i18n";
import { getProductsByCategory } from "@/data/products";
import type { Category } from "@/types/product";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({
  category,
  index = 0,
}: {
  category: Category;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const { locale } = useLocale();
  const name = loc(category.name, locale);
  const cover =
    getProductsByCategory(category.slug)[0]?.catalogImage ??
    getProductsByCategory(category.slug)[0]?.image ??
    category.image;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: EASE_PREMIUM }}
    >
      <Link
        href={`/catalog/${category.slug}`}
        className="group relative block overflow-hidden rounded-[1.75rem]"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-white">
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 md:p-12"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent transition-opacity duration-500 group-hover:from-night/85" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
          <div>
            <h3 className="text-2xl text-white tracking-tight md:text-3xl">{name}</h3>
            <p className="mt-1 text-sm text-white/70">{loc(category.tagline, locale)}</p>
          </div>
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all duration-500",
              "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            )}
            aria-hidden
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
