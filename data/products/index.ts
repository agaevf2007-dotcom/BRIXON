import { applyRetail } from "@/data/apply-retail";
import { climateProducts } from "@/data/products/climate";
import { electronicsProducts } from "@/data/products/electronics";
import { kitchenProducts } from "@/data/products/kitchen";
import { laundryProducts } from "@/data/products/laundry";
import { smallProducts } from "@/data/products/small";
import { assertUniqueProductImages } from "@/data/media";
import { categories, getCategoryName } from "@/data/categories";
import { loc } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";
import type { BrandName, CategorySlug, Product } from "@/types/product";

const catalog = applyRetail([
  ...laundryProducts,
  ...kitchenProducts,
  ...climateProducts,
  ...smallProducts,
  ...electronicsProducts,
]);

assertUniqueProductImages(catalog);

export const products: Product[] = catalog;

export const brands = [...new Set(products.map((product) => product.brand))].sort() as BrandName[];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function getFeaturedProducts(limit = 8) {
  const featured = products.filter((product) => product.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = products
    .filter((product) => !product.featured)
    .sort((a, b) => b.rating - a.rating);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const pool = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const scored = pool
    .map((item) => {
      let score = 0;
      if (item.brand === product.brand) score += 4;
      const delta = Math.abs(item.basePriceEUR - product.basePriceEUR) / Math.max(product.basePriceEUR, 1);
      score += Math.max(0, 3 - delta * 5);
      score += item.rating / 5;
      if (item.inStock) score += 0.3;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.item);
}

const SEARCH_ALIASES: Array<[string[], CategorySlug[]]> = [
  [["стиральн", "washer", "washing machine", "washing"], ["washing-machines"]],
  [["сушильн", "dryer", "tumble"], ["dryers"]],
  [["холодильн", "refrigerator", "fridge"], ["refrigerators"]],
  [["морозил", "freezer"], ["freezers"]],
  [["посудомо", "dishwasher"], ["dishwashers"]],
  [["духов", "oven"], ["ovens"]],
  [["варочн", "cooktop", "hob", "induction"], ["cooktops"]],
  [["микроволн", "microwave"], ["microwaves"]],
  [["вытяжк", "hood", "cooker hood"], ["hoods"]],
  [["кондиционер", "air conditioner", "split"], ["air-conditioners"]],
  [["очистител", "air purifier", "hepa"], ["air-purifiers"]],
  [["увлажнит", "humidifier"], ["humidifiers"]],
  [["кофемаш", "coffee", "espresso", "латте"], ["coffee-machines"]],
  [["чайник", "kettle"], ["kettles"]],
  [["блендер", "blender"], ["blenders"]],
  [["миксер", "mixer"], ["mixers"]],
  [["тостер", "toaster"], ["toasters"]],
  [["пылесос", "vacuum", "dyson"], ["vacuum-cleaners", "robot-vacuums"]],
  [["робот", "robot vacuum"], ["robot-vacuums"]],
  [["телевиз", "television", "tv", "oled", "qled"], ["televisions"]],
  [["монитор", "monitor"], ["monitors"]],
  [["саундбар", "soundbar", "atmos"], ["soundbars"]],
];

function haystack(product: Product, locale: Locale) {
  const category = getCategoryName(product.category, locale);
  const otherLocale: Locale = locale === "ru" ? "en" : "ru";
  const parts = [
    product.brand,
    product.model,
    loc(product.name, locale),
    loc(product.name, otherLocale),
    loc(product.shortDescription, locale),
    loc(product.shortDescription, otherLocale),
    loc(product.description, locale),
    loc(product.description, otherLocale),
    product.category,
    category,
    getCategoryName(product.category, otherLocale),
    loc(product.features, locale).join(" "),
    loc(product.features, otherLocale).join(" "),
    Object.entries(loc(product.specifications, locale))
      .flat()
      .join(" "),
    Object.entries(loc(product.specifications, otherLocale))
      .flat()
      .join(" "),
  ];
  return parts.join(" ").toLowerCase();
}

export function searchProducts(query: string, locale: Locale) {
  const value = query.trim().toLowerCase();
  if (!value) return products.slice(0, 8);

  const aliasCategories = SEARCH_ALIASES.filter(([keys]) =>
    keys.some((key) => value.includes(key) || key.includes(value)),
  ).flatMap(([, slugs]) => slugs);

  return products
    .map((product) => {
      const text = haystack(product, locale);
      let score = 0;
      if (product.brand.toLowerCase() === value) score += 8;
      if (product.model.toLowerCase().includes(value)) score += 7;
      if (loc(product.name, locale).toLowerCase().includes(value)) score += 6;
      if (text.includes(value)) score += 3;
      if (aliasCategories.includes(product.category)) score += 5;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}

export function brandsForCategory(slug?: CategorySlug) {
  const list = slug ? getProductsByCategory(slug) : products;
  return [...new Set(list.map((product) => product.brand))].sort() as BrandName[];
}

export function uniqueFilterValues<K extends keyof Product["filters"]>(
  slug: CategorySlug | undefined,
  key: K,
) {
  const list = slug ? getProductsByCategory(slug) : products;
  const values = list
    .map((product) => product.filters[key])
    .filter((value): value is NonNullable<typeof value> => value !== undefined);
  return [...new Set(values.map((value) => String(value)))].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
}

export { categories };
