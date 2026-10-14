"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";
import { homeCategories } from "@/data/categories";

export function CategorySection() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("home.collectionKicker")}</p>
        <h2 className="mt-4 max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {t("home.collectionTitle")}
        </h2>
      </ScrollReveal>
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
        {homeCategories.map((category, index) => (
          <CategoryCard key={category.slug} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}
