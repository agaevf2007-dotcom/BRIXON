"use client";

import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export function CTA() {
  const { t } = useLocale();

  return (
    <section className="bg-night text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
        <ScrollReveal>
          <h2 className="max-w-4xl text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            {t("home.ctaTitle1")}
            <span className="block">{t("home.ctaTitle2")}</span>
          </h2>
          <p className="mt-6 text-lg text-white/60">{t("home.ctaSubtitle")}</p>
          <Button href="/catalog" variant="invert" size="lg" className="mt-10 w-fit">
            {t("home.ctaButton")}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
