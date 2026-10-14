"use client";

import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export function ServiceContent() {
  const { dict, t } = useLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("service.kicker")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl tracking-tight md:text-6xl">{t("service.title")}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted">{t("service.subtitle")}</p>
      </ScrollReveal>

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {dict.service.items.map((item, index) => (
          <ScrollReveal key={item.title} delay={index * 0.05}>
            <article className="h-full rounded-[1.75rem] bg-white p-7">
              <h2 className="text-2xl tracking-tight">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl tracking-tight md:text-5xl">{t("service.faqTitle")}</h2>
        <Accordion items={[...dict.service.faqs]} className="mt-10" />
      </div>

      <div className="mt-16 flex flex-col gap-3 sm:flex-row">
        <Button href="/contacts">{t("service.contact")}</Button>
        <Button href="/catalog" variant="secondary">
          {t("service.browse")}
        </Button>
      </div>
    </div>
  );
}
