"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { categories } from "@/data/categories";
import { loc } from "@/lib/i18n";
import Link from "next/link";

export function Footer() {
  const { t, locale } = useLocale();

  const company = [
    { href: "/about", label: t("nav.about") },
    { href: "/delivery", label: t("nav.delivery") },
    { href: "/service", label: t("nav.service") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  const support = [
    { href: "/service", label: t("footer.faq") },
    { href: "/service", label: t("footer.warranty") },
    { href: "/delivery", label: t("footer.returns") },
  ];

  const productSlugs = [
    "refrigerators",
    "washing-machines",
    "dishwashers",
    "coffee-machines",
    "televisions",
  ] as const;

  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-4xl tracking-tight md:text-6xl">BRIXON.</p>
            <p className="mt-6 max-w-sm text-white/55 leading-relaxed">{t("slogan")}</p>
            <div className="mt-8">
              <LanguageSwitcher light />
            </div>
          </div>

          <FooterColumn title={t("footer.products")}>
            {productSlugs.map((slug) => {
              const category = categories.find((item) => item.slug === slug);
              if (!category) return null;
              return (
                <Link
                  key={category.slug}
                  href={`/catalog/${category.slug}`}
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  {loc(category.name, locale)}
                </Link>
              );
            })}
          </FooterColumn>

          <FooterColumn title={t("footer.company")}>
            {company.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.support")}>
            {support.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>
        </div>

        <p className="mt-16 max-w-3xl text-sm leading-relaxed text-white/40">{t("footer.disclaimer")}</p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <p>{t("footer.living")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">{title}</p>
      <div className="mt-6 space-y-3 text-sm">{children}</div>
    </div>
  );
}
