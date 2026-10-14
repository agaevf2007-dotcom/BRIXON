import type { Localized } from "@/types/i18n";

export type CategorySlug =
  | "refrigerators"
  | "freezers"
  | "washing-machines"
  | "dryers"
  | "dishwashers"
  | "ovens"
  | "cooktops"
  | "microwaves"
  | "hoods"
  | "air-conditioners"
  | "air-purifiers"
  | "humidifiers"
  | "coffee-machines"
  | "kettles"
  | "blenders"
  | "mixers"
  | "toasters"
  | "vacuum-cleaners"
  | "robot-vacuums"
  | "televisions"
  | "monitors"
  | "soundbars";

export type CategoryGroup = "major" | "climate" | "small" | "electronics";

export type BrandName =
  | "Samsung"
  | "LG"
  | "Bosch"
  | "Siemens"
  | "Miele"
  | "Haier"
  | "Electrolux"
  | "Philips"
  | "Dyson"
  | "Sony"
  | "Xiaomi"
  | "BORK"
  | "De'Longhi";

export type ProductFilters = {
  energyClass?: string;
  wifi?: boolean;
  loadKg?: number;
  spinRpm?: number;
  capacityL?: number;
  fridgeL?: number;
  freezerL?: number;
  noFrost?: boolean;
  screenInch?: number;
  resolution?: string;
  panelType?: string;
  refreshHz?: number;
  hdr?: boolean;
};

export type ProductModel3D = {
  glb: string;
  source: Localized;
};

export type Product = {
  id: string;
  slug: string;
  brand: BrandName;
  model: string;
  category: CategorySlug;
  name: Localized;
  shortDescription: Localized;
  description: Localized;
  basePriceEUR: number;
  oldPriceEUR?: number;
  priceSource?: Localized;
  rating: number;
  reviews: number;
  image: string;
  catalogImage?: string;
  images: string[];
  features: Localized<string[]>;
  specifications: Localized<Record<string, string>>;
  energyInfo: Localized;
  dimensions: Localized;
  box: Localized<string[]>;
  filters: ProductFilters;
  model3d?: ProductModel3D;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  date: Localized;
  rating: number;
  title: Localized;
  text: Localized;
};

export type FaqItem = {
  question: Localized;
  answer: Localized;
};

export type Category = {
  slug: CategorySlug;
  group: CategoryGroup;
  name: Localized;
  tagline: Localized;
  description: Localized;
  longDescription: Localized;
  image: string;
  heroImage: string;
  featuredHome?: boolean;
  features: { title: Localized; text: Localized }[];
  faq: FaqItem[];
  filterKeys: Array<
    | "brand"
    | "price"
    | "energy"
    | "wifi"
    | "load"
    | "spin"
    | "capacity"
    | "noFrost"
    | "screen"
    | "resolution"
    | "panel"
    | "refresh"
    | "rating"
    | "availability"
  >;
};
