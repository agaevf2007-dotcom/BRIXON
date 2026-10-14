"use client";

import { ContactForm } from "@/components/ContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export function ContactsContent() {
  const { t } = useLocale();
  const details = [
    { label: t("contacts.phone"), value: "+1 800 BRIXON", href: "tel:+18002749666" },
    { label: t("contacts.email"), value: "hello@brixon.com", href: "mailto:hello@brixon.com" },
    { label: t("contacts.hours"), value: t("contacts.hoursValue") },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("contacts.kicker")}</p>
          <h1 className="mt-4 text-4xl tracking-tight md:text-6xl">{t("contacts.title")}</h1>
          <p className="mt-5 max-w-md text-lg text-muted">{t("contacts.subtitle")}</p>
          <dl className="mt-12 space-y-8">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</dt>
                <dd className="mt-2 text-2xl tracking-tight">
                  {item.href ? (
                    <a href={item.href} className="hover:text-accent">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
        <ContactForm />
      </div>
    </div>
  );
}
