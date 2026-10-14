"use client";

import { discountPercent, formatPrice } from "@/lib/price";
import { EASE_PREMIUM } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { motion, useReducedMotion } from "motion/react";

export function Price({
  amountEUR,
  className,
  struck,
}: {
  amountEUR: number;
  className?: string;
  struck?: boolean;
}) {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const text = formatPrice(amountEUR, locale);

  return (
    <motion.span
      key={text}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
    >
      {struck ? <s>{text}</s> : text}
    </motion.span>
  );
}

export function DiscountBadge({
  priceEUR,
  oldPriceEUR,
}: {
  priceEUR: number;
  oldPriceEUR?: number;
}) {
  const { t } = useLocale();
  const value = discountPercent(priceEUR, oldPriceEUR);
  if (!value) return null;
  return (
    <span className="rounded-full bg-accent px-2.5 py-1 text-xs text-white">
      −{value}% {t("common.discount")}
    </span>
  );
}
