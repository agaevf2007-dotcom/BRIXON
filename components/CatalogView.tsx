"use client";

import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/Button";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { categories, getCategory } from "@/data/categories";
import {
  brandsForCategory,
  products as allProducts,
  uniqueFilterValues,
} from "@/data/products";
import { useEscape } from "@/hooks/useLockBody";
import { loc } from "@/lib/i18n";
import { formatPrice } from "@/lib/price";
import { EASE_PREMIUM } from "@/lib/utils";
import type { CategorySlug } from "@/types/product";
import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import Image from "next/image";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const PRICE_BUCKETS = [
  { id: "under-500", test: (price: number) => price < 500 },
  { id: "500-1000", test: (price: number) => price >= 500 && price < 1000 },
  { id: "1000-1500", test: (price: number) => price >= 1000 && price < 1500 },
  { id: "over-1500", test: (price: number) => price >= 1500 },
];

const CAPACITY_BUCKETS = [
  { id: "under-300", test: (value?: number) => (value ?? 0) > 0 && value! < 300 },
  { id: "300-450", test: (value?: number) => (value ?? 0) >= 300 && value! < 450 },
  { id: "450-600", test: (value?: number) => (value ?? 0) >= 450 && value! < 600 },
  { id: "over-600", test: (value?: number) => (value ?? 0) >= 600 },
];

type Filters = {
  categories: CategorySlug[];
  prices: string[];
  brands: string[];
  energy: string[];
  rating: number | null;
  availability: "all" | "in" | "out";
  wifi: "all" | "yes" | "no";
  load: string[];
  spin: string[];
  capacity: string[];
  noFrost: boolean;
  screen: string[];
  resolution: string[];
  panel: string[];
  refresh: string[];
};

const emptyFilters: Filters = {
  categories: [],
  prices: [],
  brands: [],
  energy: [],
  rating: null,
  availability: "all",
  wifi: "all",
  load: [],
  spin: [],
  capacity: [],
  noFrost: false,
  screen: [],
  resolution: [],
  panel: [],
  refresh: [],
};

export function CatalogView({
  heading,
  description,
  presetCategory,
  presetBrand,
  hideIntro = false,
}: {
  heading?: string;
  description?: string;
  presetCategory?: CategorySlug;
  presetBrand?: string;
  hideIntro?: boolean;
}) {
  const { locale, t } = useLocale();
  const [sort, setSort] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    categories: presetCategory ? [presetCategory] : [],
    brands: presetBrand ? [presetBrand] : [],
  });
  const { filtersOpen, openFilters, closeFilters } = useUI();
  const reduce = useReducedMotion();
  useEscape(closeFilters, filtersOpen);

  const categoryMeta = presetCategory ? getCategory(presetCategory) : undefined;
  const filterKeys = categoryMeta?.filterKeys ?? [
    "brand",
    "price",
    "rating",
    "availability",
  ];

  const filtered = useMemo(() => {
    let list = allProducts.slice();
    if (filters.categories.length) {
      list = list.filter((product) => filters.categories.includes(product.category));
    }
    if (filters.prices.length) {
      list = list.filter((product) =>
        filters.prices.some((id) =>
          PRICE_BUCKETS.find((bucket) => bucket.id === id)?.test(product.basePriceEUR),
        ),
      );
    }
    if (filters.brands.length) {
      list = list.filter((product) => filters.brands.includes(product.brand));
    }
    if (filters.energy.length) {
      list = list.filter((product) =>
        product.filters.energyClass ? filters.energy.includes(product.filters.energyClass) : false,
      );
    }
    if (filters.rating) {
      list = list.filter((product) => product.rating >= filters.rating!);
    }
    if (filters.availability === "in") list = list.filter((product) => product.inStock);
    if (filters.availability === "out") list = list.filter((product) => !product.inStock);
    if (filters.wifi === "yes") list = list.filter((product) => product.filters.wifi);
    if (filters.wifi === "no") list = list.filter((product) => product.filters.wifi === false);
    if (filters.load.length) {
      list = list.filter((product) =>
        product.filters.loadKg ? filters.load.includes(String(product.filters.loadKg)) : false,
      );
    }
    if (filters.spin.length) {
      list = list.filter((product) =>
        product.filters.spinRpm ? filters.spin.includes(String(product.filters.spinRpm)) : false,
      );
    }
    if (filters.capacity.length) {
      list = list.filter((product) =>
        filters.capacity.some((id) =>
          CAPACITY_BUCKETS.find((bucket) => bucket.id === id)?.test(product.filters.capacityL),
        ),
      );
    }
    if (filters.noFrost) {
      list = list.filter((product) => product.filters.noFrost);
    }
    if (filters.screen.length) {
      list = list.filter((product) =>
        product.filters.screenInch ? filters.screen.includes(String(product.filters.screenInch)) : false,
      );
    }
    if (filters.resolution.length) {
      list = list.filter((product) =>
        product.filters.resolution ? filters.resolution.includes(product.filters.resolution) : false,
      );
    }
    if (filters.panel.length) {
      list = list.filter((product) =>
        product.filters.panelType ? filters.panel.includes(product.filters.panelType) : false,
      );
    }
    if (filters.refresh.length) {
      list = list.filter((product) =>
        product.filters.refreshHz ? filters.refresh.includes(String(product.filters.refreshHz)) : false,
      );
    }

    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "price-asc") sorted.sort((a, b) => a.basePriceEUR - b.basePriceEUR);
    if (sort === "price-desc") sorted.sort((a, b) => b.basePriceEUR - a.basePriceEUR);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") {
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return sorted;
  }, [filters, sort]);

  const brands = brandsForCategory(presetCategory);
  const title = heading ?? t("catalog.title");
  const lead = description ?? t("catalog.description");

  const filterPanel = (
    <FilterFields
      filters={filters}
      setFilters={setFilters}
      hideCategory={Boolean(presetCategory)}
      filterKeys={filterKeys}
      presetCategory={presetCategory}
    />
  );

  const sortSelect = (
    <select
      value={sort}
      onChange={(event) => setSort(event.target.value as SortKey)}
      className="h-11 rounded-full border border-ink/10 bg-white px-4 cursor-pointer"
      aria-label={t("common.sort")}
    >
      <option value="featured">{t("catalog.sortFeatured")}</option>
      <option value="newest">{t("catalog.sortNewest")}</option>
      <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
      <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
      <option value="rating">{t("catalog.sortRating")}</option>
    </select>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      {hideIntro ? null : (
        <>
          <Breadcrumbs
            items={[
              { label: t("common.home"), href: "/" },
              { label: t("common.catalog"), href: "/catalog" },
              ...(presetCategory && categoryMeta
                ? [{ label: loc(categoryMeta.name, locale) }]
                : []),
            ]}
          />
          <ScrollReveal className="mt-10 max-w-3xl">
            <h1 className="text-4xl tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-5 text-lg text-muted">{lead}</p>
          </ScrollReveal>
        </>
      )}

      {presetCategory ? (
        <div className="mt-10 flex flex-wrap gap-2">
          {brands.map((brand) => {
            const active = filters.brands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    brands: current.brands.includes(brand)
                      ? current.brands.filter((item) => item !== brand)
                      : [...current.brands, brand],
                  }))
                }
                className={`rounded-full px-4 py-2 text-sm transition-colors cursor-pointer ${
                  active ? "bg-ink text-white" : "bg-white text-ink hover:bg-ink/5"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {filtered.length} {t("common.products")}
        </p>
        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-3 text-sm sm:flex">
            <span className="text-muted">{t("common.sort")}</span>
            {sortSelect}
          </label>
          <button
            type="button"
            onClick={openFilters}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm lg:hidden cursor-pointer"
          >
            <SlidersHorizontal className="size-4" />
            {t("common.filters")}
          </button>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm sm:hidden">
        <span className="text-muted">{t("common.sort")}</span>
        <span className="flex-1">{sortSelect}</span>
      </label>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>
        <ProductGrid products={filtered} catalogCovers />
      </div>

      <AnimatePresence>
        {filtersOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[80] bg-night/40 lg:hidden cursor-pointer"
              aria-label={t("common.close")}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              onClick={closeFilters}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("common.filters")}
              className="fixed inset-x-0 bottom-0 z-[81] max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-canvas p-6 lg:hidden"
              initial={reduce ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: "100%" }}
              transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xl tracking-tight">{t("common.filters")}</p>
                <button
                  type="button"
                  onClick={closeFilters}
                  className="grid size-10 place-items-center rounded-full hover:bg-white cursor-pointer"
                  aria-label={t("common.close")}
                >
                  <X className="size-5" />
                </button>
              </div>
              {filterPanel}
              <Button className="mt-8 w-full" onClick={closeFilters}>
                {t("common.showProducts")} {filtered.length}
              </Button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilterFields({
  filters,
  setFilters,
  hideCategory,
  filterKeys,
  presetCategory,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  hideCategory?: boolean;
  filterKeys: string[];
  presetCategory?: CategorySlug;
}) {
  const { locale, t } = useLocale();
  const show = (key: string) => filterKeys.includes(key);
  const brands = brandsForCategory(presetCategory);
  const energy = uniqueFilterValues(presetCategory, "energyClass");
  const loads = uniqueFilterValues(presetCategory, "loadKg");
  const spins = uniqueFilterValues(presetCategory, "spinRpm");
  const screens = uniqueFilterValues(presetCategory, "screenInch");
  const resolutions = uniqueFilterValues(presetCategory, "resolution");
  const panels = uniqueFilterValues(presetCategory, "panelType");
  const refresh = uniqueFilterValues(presetCategory, "refreshHz");

  const toggle = (key: keyof Omit<Filters, "rating" | "availability" | "wifi" | "noFrost">, value: string) => {
    setFilters((current) => {
      const list = current[key] as string[];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [key]: next };
    });
  };

  const priceLabels: Record<string, string> = {
    "under-500": `${locale === "ru" ? "До" : "Under"} ${formatPrice(500, locale)}`,
    "500-1000": `${formatPrice(500, locale)} – ${formatPrice(1000, locale)}`,
    "1000-1500": `${formatPrice(1000, locale)} – ${formatPrice(1500, locale)}`,
    "over-1500": `${locale === "ru" ? "От" : "Over"} ${formatPrice(1500, locale)}`,
  };

  const capacityLabels: Record<string, string> = {
    "under-300": locale === "ru" ? "До 300 л" : "Under 300 L",
    "300-450": "300–450 L",
    "450-600": "450–600 L",
    "over-600": locale === "ru" ? "От 600 л" : "Over 600 L",
  };

  return (
    <div className="space-y-8">
      {!hideCategory ? (
        <FilterGroup title={t("catalog.filterCategory")}>
          {categories.map((category) => (
            <Check
              key={category.slug}
              label={loc(category.name, locale)}
              checked={filters.categories.includes(category.slug)}
              onChange={() => toggle("categories", category.slug)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("brand") ? (
        <FilterGroup title={t("catalog.filterBrand")}>
          {brands.map((brand) => (
            <Check
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggle("brands", brand)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("price") ? (
        <FilterGroup title={t("catalog.filterPrice")}>
          {PRICE_BUCKETS.map((bucket) => (
            <Check
              key={bucket.id}
              label={priceLabels[bucket.id]}
              checked={filters.prices.includes(bucket.id)}
              onChange={() => toggle("prices", bucket.id)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("load") && loads.length ? (
        <FilterGroup title={t("catalog.filterLoad")}>
          {loads.map((value) => (
            <Check
              key={value}
              label={`${value} ${locale === "ru" ? "кг" : "kg"}`}
              checked={filters.load.includes(value)}
              onChange={() => toggle("load", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("spin") && spins.length ? (
        <FilterGroup title={t("catalog.filterSpin")}>
          {spins.map((value) => (
            <Check
              key={value}
              label={`${value} ${locale === "ru" ? "об/мин" : "rpm"}`}
              checked={filters.spin.includes(value)}
              onChange={() => toggle("spin", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("capacity") ? (
        <FilterGroup title={t("catalog.filterCapacity")}>
          {CAPACITY_BUCKETS.map((bucket) => (
            <Check
              key={bucket.id}
              label={capacityLabels[bucket.id]}
              checked={filters.capacity.includes(bucket.id)}
              onChange={() => toggle("capacity", bucket.id)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("noFrost") ? (
        <FilterGroup title={t("catalog.filterNoFrost")}>
          <Check
            label={t("catalog.noFrostYes")}
            checked={filters.noFrost}
            onChange={() => setFilters((current) => ({ ...current, noFrost: !current.noFrost }))}
          />
        </FilterGroup>
      ) : null}

      {show("energy") && energy.length ? (
        <FilterGroup title={t("catalog.filterEnergy")}>
          {energy.map((item) => (
            <Check
              key={item}
              label={item}
              checked={filters.energy.includes(item)}
              onChange={() => toggle("energy", item)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("wifi") ? (
        <FilterGroup title={t("catalog.filterWifi")}>
          {[
            { id: "yes" as const, label: t("catalog.wifiYes") },
            { id: "no" as const, label: t("catalog.wifiNo") },
          ].map((item) => (
            <Check
              key={item.id}
              label={item.label}
              checked={filters.wifi === item.id}
              onChange={() =>
                setFilters((current) => ({
                  ...current,
                  wifi: current.wifi === item.id ? "all" : item.id,
                }))
              }
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("screen") && screens.length ? (
        <FilterGroup title={t("catalog.filterScreen")}>
          {screens.map((value) => (
            <Check
              key={value}
              label={`${value}"`}
              checked={filters.screen.includes(value)}
              onChange={() => toggle("screen", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("resolution") && resolutions.length ? (
        <FilterGroup title={t("catalog.filterResolution")}>
          {resolutions.map((value) => (
            <Check
              key={value}
              label={value}
              checked={filters.resolution.includes(value)}
              onChange={() => toggle("resolution", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("panel") && panels.length ? (
        <FilterGroup title={t("catalog.filterPanel")}>
          {panels.map((value) => (
            <Check
              key={value}
              label={value}
              checked={filters.panel.includes(value)}
              onChange={() => toggle("panel", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("refresh") && refresh.length ? (
        <FilterGroup title={t("catalog.filterRefresh")}>
          {refresh.map((value) => (
            <Check
              key={value}
              label={`${value} Hz`}
              checked={filters.refresh.includes(value)}
              onChange={() => toggle("refresh", value)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("rating") ? (
        <FilterGroup title={t("catalog.filterRating")}>
          {[4, 3].map((value) => (
            <Check
              key={value}
              label={`${value}.0 ${t("catalog.ratingUp")}`}
              checked={filters.rating === value}
              onChange={() =>
                setFilters((current) => ({
                  ...current,
                  rating: current.rating === value ? null : value,
                }))
              }
            />
          ))}
        </FilterGroup>
      ) : null}

      {show("availability") ? (
        <FilterGroup title={t("catalog.filterAvailability")}>
          {[
            { id: "all" as const, label: t("catalog.availabilityAll") },
            { id: "in" as const, label: t("catalog.availabilityIn") },
            { id: "out" as const, label: t("catalog.availabilityOut") },
          ].map((item) => (
            <Check
              key={item.id}
              label={item.label}
              checked={filters.availability === item.id}
              onChange={() =>
                setFilters((current) => ({
                  ...current,
                  availability: item.id,
                }))
              }
            />
          ))}
        </FilterGroup>
      ) : null}

      <button
        type="button"
        className="text-sm underline underline-offset-4 cursor-pointer"
        onClick={() =>
          setFilters({
            ...emptyFilters,
            categories: hideCategory ? filters.categories : [],
          })
        }
      >
        {t("common.clearFilters")}
      </button>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <fieldset>
      <legend className="w-full">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm tracking-tight cursor-pointer"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {title}
          <span className="text-muted">{open ? "–" : "+"}</span>
        </button>
      </legend>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 space-y-2.5 overflow-hidden">{children}</div>
      </div>
    </fieldset>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-muted hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-[#68715A]"
      />
      {label}
    </label>
  );
}

export function CategoryHero({ slug }: { slug: CategorySlug }) {
  const category = categories.find((item) => item.slug === slug);
  const { locale, t } = useLocale();
  if (!category) return null;

  return (
    <>
      <section className="relative min-h-[56vh] overflow-hidden bg-night text-white">
        <div className="absolute inset-0">
          <Image
            src={category.heroImage}
            alt={loc(category.name, locale)}
            fill
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-night/50" />
        <div className="relative mx-auto flex min-h-[56vh] max-w-[1440px] flex-col justify-end px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">{t("catalog.filterCategory")}</p>
          <h1 className="mt-4 max-w-3xl text-5xl tracking-tight md:text-7xl">
            {loc(category.name, locale)}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">{loc(category.description, locale)}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12">
        <p className="max-w-3xl text-xl leading-relaxed text-muted">
          {loc(category.longDescription, locale)}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {category.features.map((feature) => (
            <article key={loc(feature.title, locale)} className="rounded-[1.75rem] bg-white p-7">
              <h2 className="text-2xl tracking-tight">{loc(feature.title, locale)}</h2>
              <p className="mt-3 text-muted leading-relaxed">{loc(feature.text, locale)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function CategoryFaq({ slug }: { slug: CategorySlug }) {
  const category = categories.find((item) => item.slug === slug);
  const { locale, t } = useLocale();
  if (!category?.faq.length) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-12">
      <h2 className="text-3xl tracking-tight md:text-5xl">{t("catalog.questions")}</h2>
      <Accordion
        items={category.faq.map((item) => ({
          question: loc(item.question, locale),
          answer: loc(item.answer, locale),
        }))}
        className="mt-10"
      />
    </section>
  );
}
