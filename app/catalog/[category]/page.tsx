import { CategoryFaq, CategoryHero, CatalogView } from "@/components/CatalogView";
import { CTA } from "@/components/home/CTA";
import { categories, getCategory } from "@/data/categories";
import type { CategorySlug } from "@/types/product";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const item = getCategory(category);
  if (!item) return { title: "Category" };
  return {
    title: item.name.ru,
    description: item.description.ru,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const item = getCategory(category);
  if (!item) notFound();

  return (
    <>
      <CategoryHero slug={item.slug} />
      <CatalogView
        key={item.slug}
        presetCategory={item.slug as CategorySlug}
        hideIntro
        heading={item.name.ru}
        description={item.description.ru}
      />
      <CategoryFaq slug={item.slug} />
      <CTA />
    </>
  );
}
