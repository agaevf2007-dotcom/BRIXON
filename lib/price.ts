import type { Locale } from "@/types/i18n";

export const EUR_TO_RUB = 95;

export function convertFromEUR(amountEUR: number, locale: Locale) {
  if (locale === "ru") return Math.round(amountEUR * EUR_TO_RUB);
  return Math.round(amountEUR);
}

function formatCurrency(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/[\u00a0\u202f]/g, " ");
}

export function formatPrice(amountEUR: number, locale: Locale) {
  if (locale === "ru") {
    return formatCurrency(convertFromEUR(amountEUR, "ru"), "ru-RU", "RUB");
  }

  return formatCurrency(amountEUR, "en-US", "EUR");
}

export function discountPercent(priceEUR: number, oldPriceEUR?: number) {
  if (!oldPriceEUR || oldPriceEUR <= priceEUR) return 0;
  return Math.round((1 - priceEUR / oldPriceEUR) * 100);
}

export const DELIVERY_FEE_EUR = 49;
export const FREE_DELIVERY_FROM_EUR = 1000;

export function getDeliveryFeeEUR(subtotalEUR: number) {
  if (subtotalEUR === 0) return 0;
  return subtotalEUR >= FREE_DELIVERY_FROM_EUR ? 0 : DELIVERY_FEE_EUR;
}
