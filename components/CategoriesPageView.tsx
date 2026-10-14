"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { useLocale } from "@/context/LocaleContext";
import { categories } from "@/data/categories";

export function CategoriesPageView() {
  const { t, dict } = useLocale();
  const groups = ["major", "climate", "small", "electronics"] as const;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("categoriesPage.kicker")}</p>
      <h1 className="mt-4 max-w-3xl text-4xl tracking-tight md:text-6xl">{t("categoriesPage.title")}</h1>
      {groups.map((group) => (
        <section key={group} className="mt-14">
          <h2 className="text-2xl tracking-tight md:text-3xl">{dict.groups[group]}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {categories
              .filter((category) => category.group === group)
              .map((category, index) => (
                <CategoryCard key={category.slug} category={category} index={index} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
