import { gallery, pexels, unsplash } from "@/data/media";
import type { Localized } from "@/types/i18n";
import type { BrandName, CategorySlug, Product, ProductFilters } from "@/types/product";

export const L = (ru: string, en: string): Localized => ({ ru, en });

export const LA = (ru: string[], en: string[]): Localized<string[]> => ({ ru, en });

export const LS = (
  ru: Record<string, string>,
  en: Record<string, string>,
): Localized<Record<string, string>> => ({ ru, en });

export function yesNo(yes: boolean) {
  return L(yes ? "Да" : "Нет", yes ? "Yes" : "No");
}

export type ProductDraft = Product;

type Spec = Record<string, string>;

export function photos(...ids: Array<string | number>) {
  return ids.map((id) => (typeof id === "number" ? pexels(id) : unsplash(id)));
}

export function makeProduct(input: {
  id: string;
  slug?: string;
  brand: BrandName;
  model: string;
  category: CategorySlug;
  name?: Localized;
  short: Localized;
  long: Localized;
  basePriceEUR: number;
  oldPriceEUR?: number;
  rating: number;
  reviews: number;
  photos: Array<string | number>;
  features: Localized<string[]>;
  specs: Localized<Spec>;
  energy: Localized;
  dimensions: Localized;
  box: Localized<string[]>;
  filters: ProductFilters;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  createdAt: string;
}): Product {
  const urls = photos(...input.photos);
  return {
    id: input.id,
    slug: input.slug ?? input.id,
    brand: input.brand,
    model: input.model,
    category: input.category,
    name: input.name ?? L(`${input.brand} ${input.model}`, `${input.brand} ${input.model}`),
    shortDescription: input.short,
    description: input.long,
    basePriceEUR: input.basePriceEUR,
    oldPriceEUR: input.oldPriceEUR,
    rating: input.rating,
    reviews: input.reviews,
    image: urls[0],
    images: gallery(urls[0], ...urls.slice(1)),
    features: input.features,
    specifications: input.specs,
    energyInfo: input.energy,
    dimensions: input.dimensions,
    box: input.box,
    filters: input.filters,
    inStock: input.inStock ?? true,
    featured: input.featured,
    isNew: input.isNew,
    createdAt: input.createdAt,
  };
}
