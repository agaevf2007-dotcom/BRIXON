"use client";

import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export function DeliveryContent() {
  const { dict, t } = useLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("delivery.kicker")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl tracking-tight md:text-6xl">{t("delivery.title")}</h1>
      </ScrollReveal>

      <ol className="mt-16 grid gap-6 md:grid-cols-5">
        {dict.delivery.steps.map((step, index) => (
          <ScrollReveal key={step.n} delay={index * 0.05}>
            <li className="rounded-[1.75rem] bg-white p-6">
              <p className="text-sm text-muted">{step.n}</p>
              <h2 className="mt-6 text-2xl tracking-tight">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          </ScrollReveal>
        ))}
      </ol>

      <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dict.delivery.extras.map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-ink/8 p-7">
            <h2 className="text-2xl tracking-tight">{item.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl tracking-tight md:text-5xl">{t("delivery.questions")}</h2>
        <Accordion items={[...dict.delivery.faqs]} className="mt-10" />
      </div>

      <div className="mt-16">
        <Button href="/contacts">{t("delivery.plan")}</Button>
      </div>
    </div>
  );
}
